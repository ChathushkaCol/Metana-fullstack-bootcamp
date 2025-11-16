import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const intervalRef = useRef(null);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.MeditationSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success("Session saved!");
      handleReset();
    },
  });

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setMood("");
    setNote("");
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
      session_type: "timer"
    });
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meditation Timer</h1>

      <Card className="bg-white shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-center text-gray-700">Your Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-8xl font-bold text-gray-900 mb-8 font-mono">
              {formatTime(seconds)}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full"
                >
                  <Play className="w-6 h-6 mr-2" />
                  {seconds > 0 ? 'Resume' : 'Start'}
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-full border-2"
                >
                  <Pause className="w-6 h-6 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-2"
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                Reset
              </Button>
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
                  placeholder="How was your meditation? Any insights?"
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