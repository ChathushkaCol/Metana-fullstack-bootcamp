import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Library, Sparkles, TrendingUp, Calendar, Award } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export default function Home() {
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.MeditationSession.list("-created_date"),
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  // Calculate stats
  const last7Days = sessions.filter(s => {
    const sessionDate = new Date(s.created_date);
    return sessionDate >= subDays(new Date(), 7);
  });

  const totalMinutes = last7Days.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const todaySessions = sessions.filter(s => {
    const sessionDate = startOfDay(new Date(s.created_date));
    const today = startOfDay(new Date());
    return sessionDate.getTime() === today.getTime();
  });

  // Calculate streak
  let streak = 0;
  let currentDate = new Date();
  for (let i = 0; i < 365; i++) {
    const dayStart = startOfDay(subDays(currentDate, i));
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59);
    
    const hasSession = sessions.some(s => {
      const sessionDate = new Date(s.created_date);
      return sessionDate >= dayStart && sessionDate <= dayEnd;
    });
    
    if (hasSession) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  const recentSession = sessions[0];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name?.split(' ')[0] || 'Friend'} 🌸
        </h1>
        <p className="text-gray-600 text-lg">
          {todaySessions.length > 0 
            ? `Great work! You've meditated ${todaySessions.length} time${todaySessions.length > 1 ? 's' : ''} today.`
            : "Ready to find your calm today?"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-400 to-emerald-500 text-white border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              7-Day Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalMinutes} min</p>
            <p className="text-white/80 text-sm mt-1">{last7Days.length} sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{streak} days</p>
            <p className="text-white/80 text-sm mt-1">Keep it going!</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {todaySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)} min
            </p>
            <p className="text-white/80 text-sm mt-1">{todaySessions.length} sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to={createPageUrl("Timer")} className="block">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-200 bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Start Timer</h3>
              <p className="text-gray-600 text-sm">Begin a meditation session</p>
            </CardContent>
          </Card>
        </Link>

        <Link to={createPageUrl("Library")} className="block">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200 bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Library className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Guided Library</h3>
              <p className="text-gray-600 text-sm">Browse meditation guides</p>
            </CardContent>
          </Card>
        </Link>

        <Link to={createPageUrl("AICoach")} className="block">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Coach</h3>
              <p className="text-gray-600 text-sm">Get personalized guidance</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Session */}
      {recentSession && (
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Last Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {recentSession.duration_minutes} minutes
                </p>
                <p className="text-gray-600 mt-1">
                  {format(new Date(recentSession.created_date), "MMM d, yyyy 'at' h:mm a")}
                </p>
                {recentSession.mood && (
                  <p className="text-sm text-gray-500 mt-2">
                    Mood: <span className="font-medium capitalize">{recentSession.mood}</span>
                  </p>
                )}
                {recentSession.note && (
                  <p className="text-sm text-gray-700 mt-2 italic">"{recentSession.note}"</p>
                )}
              </div>
              <Link to={createPageUrl("Stats")}>
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}