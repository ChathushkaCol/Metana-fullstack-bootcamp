import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Sparkles, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Library() {
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: meditations = [], isLoading } = useQuery({
    queryKey: ['guided-meditations'],
    queryFn: () => base44.entities.GuidedMeditation.list("-created_date"),
  });

  const generateMutation = useMutation({
    mutationFn: async ({ category, duration }) => {
      const prompt = `Create a ${duration}-minute guided meditation script for ${category}. 
      The script should be calming, detailed, and include:
      - A gentle introduction
      - Breathing exercises
      - Body scan or visualization
      - Positive affirmations
      - A peaceful closing
      
      Format it as a continuous meditation guide that can be read aloud.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            script: { type: "string" }
          }
        }
      });

      return base44.entities.GuidedMeditation.create({
        title: result.title,
        script: result.script,
        duration_minutes: duration,
        category,
        difficulty: "beginner",
        is_ai_generated: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guided-meditations'] });
    },
  });

  const filteredMeditations = category === "all" 
    ? meditations 
    : meditations.filter(m => m.category === category);

  const categoryColors = {
    stress_relief: "bg-orange-100 text-orange-700",
    sleep: "bg-purple-100 text-purple-700",
    focus: "bg-blue-100 text-blue-700",
    anxiety: "bg-red-100 text-red-700",
    gratitude: "bg-green-100 text-green-700",
    mindfulness: "bg-teal-100 text-teal-700",
    breathing: "bg-cyan-100 text-cyan-700",
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meditation Library</h1>
          <p className="text-gray-600">Guided meditations for every need</p>
        </div>
        <Button
          onClick={() => navigate(createPageUrl("AICoach"))}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create Custom Meditation
        </Button>
      </div>

      {/* Category Filter */}
      <Tabs value={category} onValueChange={setCategory} className="mb-6">
        <TabsList className="bg-white shadow-sm">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="stress_relief">Stress Relief</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="anxiety">Anxiety</TabsTrigger>
          <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          <TabsTrigger value="breathing">Breathing</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Meditations Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : filteredMeditations.length === 0 ? (
        <Card className="bg-white shadow-md">
          <CardContent className="py-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No meditations found in this category yet</p>
            <Button
              onClick={() => navigate(createPageUrl("AICoach"))}
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate One with AI
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeditations.map((meditation) => (
            <Card
              key={meditation.id}
              className="hover:shadow-xl transition-shadow cursor-pointer bg-white"
              onClick={() => navigate(createPageUrl("MeditationPlayer") + `?id=${meditation.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{meditation.title}</CardTitle>
                  {meditation.is_ai_generated && (
                    <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={categoryColors[meditation.category]}>
                    {meditation.category?.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {meditation.duration_minutes} min
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {meditation.description || meditation.script.substring(0, 150) + "..."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}