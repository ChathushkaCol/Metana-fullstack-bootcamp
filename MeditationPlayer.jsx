import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, Pause, RotateCcw, Save, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function MeditationPlayer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const meditationId = params.get("id");

  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");

  const { data: meditation, isLoading } = useQuery({
    queryKey: ['meditation', meditationId],
    queryFn: async () => {
      const meds = await base44.entities.GuidedMeditation.list();
      return meds.find(m => m.id === meditationId);
    },
    enabled: !!meditationId,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.MeditationSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success("Session saved!");
      navigate(createPageUrl("Home"));
    },
  });

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (seconds < 60) {
      toast.error("Please meditate for at least 1 minute");
      return;
    }
    saveMutation.mutate({
      duration_minutes: Math.floor(seconds / 60),
      mood: mood || undefined,
      note: note || undefined,
      session_type: "guided",
      guided_script: meditation?.title
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!meditation) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">Meditation not found</p>
            <Button onClick={() => navigate(createPageUrl("Library"))}>
              Back to Library
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Library"))}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Library
      </Button>

      <Card className="bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">{meditation.title}</CardTitle>
          {meditation.description && (
            <p className="text-gray-600">{meditation.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer */}
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-gray-900 mb-4 font-mono">
              {formatTime(seconds)}
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
              <Clock className="w-4 h-4" />
              <span>Recommended: {meditation.duration_minutes} minutes</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                size="lg"
                className={`px-8 py-6 text-lg rounded-full ${
                  isPlaying 
                    ? "bg-white text-gray-900 hover:bg-gray-100 border-2" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-6 h-6 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2" />
                    {seconds > 0 ? 'Resume' : 'Start'}
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => {
                  setIsPlaying(false);
                  setSeconds(0);
                }}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-2"
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Meditation Script */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Meditation Guide</h3>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {meditation.script}
              </p>
            </div>
          </div>

          {/* Session Details */}
          {seconds > 0 && (
            <div className="space-y-4 pt-6 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling? (optional)
                </label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calm">😌 Calm</SelectItem>
                    <SelectItem value="stressed">😰 Stressed</SelectItem>
                    <SelectItem value="focused">🎯 Focused</SelectItem>
                    <SelectItem value="anxious">😟 Anxious</SelectItem>
                    <SelectItem value="peaceful">☮️ Peaceful</SelectItem>
                    <SelectItem value="restless">😤 Restless</SelectItem>
                    <SelectItem value="grateful">🙏 Grateful</SelectItem>
                    <SelectItem value="tired">😴 Tired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="How was your meditation?"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                disabled={saveMutation.isPending}
              >
                <Save className="w-5 h-5 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Session"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}