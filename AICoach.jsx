import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Lightbulb, TrendingUp, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AICoach() {
  const [userInput, setUserInput] = useState("");
  const [category, setCategory] = useState("stress_relief");
  const [duration, setDuration] = useState(10);
  const [insights, setInsights] = useState(null);
  const [generatedMeditation, setGeneratedMeditation] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.MeditationSession.list("-created_date", 50),
  });

  const insightsMutation = useMutation({
    mutationFn: async () => {
      const sessionsContext = sessions.slice(0, 20).map(s => ({
        duration: s.duration_minutes,
        mood: s.mood,
        note: s.note,
        date: s.created_date
      }));

      const prompt = `As a meditation coach, analyze these recent meditation sessions and provide personalized insights:
      
      ${JSON.stringify(sessionsContext, null, 2)}
      
      Provide:
      1. Overall progress assessment
      2. Patterns in mood and practice
      3. Specific recommendations for improvement
      4. Suggested meditation types or techniques
      
      Be encouraging, specific, and actionable.`;

      return await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            progress: { type: "string" },
            patterns: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            suggested_techniques: { type: "array", items: { type: "string" } }
          }
        }
      });
    },
    onSuccess: (data) => {
      setInsights(data);
      toast.success("Insights generated!");
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const prompt = `Create a personalized ${duration}-minute guided meditation for ${category}.
      
      User's current situation: ${userInput}
      
      Create a detailed, calming meditation script that:
      - Addresses their specific needs
      - Includes breathing techniques
      - Has visualization or body scan elements
      - Provides positive affirmations
      - Ends with a gentle return to awareness
      
      Make it personal, warm, and therapeutic.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            script: { type: "string" }
          }
        }
      });

      const meditation = await base44.entities.GuidedMeditation.create({
        title: result.title,
        description: result.description,
        script: result.script,
        duration_minutes: duration,
        category,
        difficulty: "beginner",
        is_ai_generated: true
      });

      return meditation;
    },
    onSuccess: (meditation) => {
      queryClient.invalidateQueries({ queryKey: ['guided-meditations'] });
      setGeneratedMeditation(meditation);
      toast.success("Custom meditation created!");
    },
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-500" />
          AI Meditation Coach
        </h1>
        <p className="text-gray-600">Get personalized guidance and custom meditations</p>
      </div>

      <div className="grid gap-6">
        {/* Personal Insights */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Your Progress Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!insights ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Get AI-powered insights about your meditation journey based on your recent sessions.
                </p>
                <Button
                  onClick={() => insightsMutation.mutate()}
                  disabled={insightsMutation.isPending || sessions.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {insightsMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Generate Insights
                    </>
                  )}
                </Button>
                {sessions.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Complete a few meditation sessions first to get insights!
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Progress Assessment</h4>
                  <p className="text-gray-700">{insights.progress}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Patterns Observed</h4>
                  <p className="text-gray-700">{insights.patterns}</p>
                </div>
                {insights.recommendations?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {insights.recommendations.map((rec, i) => (
                        <li key={i} className="text-gray-700">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {insights.suggested_techniques?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Suggested Techniques</h4>
                    <div className="flex flex-wrap gap-2">
                      {insights.suggested_techniques.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Meditation Generator */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Create Custom Meditation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!generatedMeditation ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What would you like to focus on?
                  </label>
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="E.g., I'm feeling stressed about work and need help relaxing..."
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stress_relief">Stress Relief</SelectItem>
                        <SelectItem value="sleep">Sleep</SelectItem>
                        <SelectItem value="focus">Focus</SelectItem>
                        <SelectItem value="anxiety">Anxiety</SelectItem>
                        <SelectItem value="gratitude">Gratitude</SelectItem>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="breathing">Breathing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending || !userInput.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Your Meditation...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Custom Meditation
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {generatedMeditation.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{generatedMeditation.description}</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate(createPageUrl("MeditationPlayer") + `?id=${generatedMeditation.id}`)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Start Meditation
                    </Button>
                    <Button
                      onClick={() => {
                        setGeneratedMeditation(null);
                        setUserInput("");
                      }}
                      variant="outline"
                    >
                      Create Another
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}