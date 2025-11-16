import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, subDays, startOfDay } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Award, Clock } from "lucide-react";

export default function Stats() {
  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.MeditationSession.list("-created_date"),
  });

  // Calculate stats
  const last7Days = sessions.filter(s => {
    const sessionDate = new Date(s.created_date);
    return sessionDate >= subDays(new Date(), 7);
  });

  const last30Days = sessions.filter(s => {
    const sessionDate = new Date(s.created_date);
    return sessionDate >= subDays(new Date(), 30);
  });

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const longestSession = Math.max(...sessions.map(s => s.duration_minutes || 0), 0);

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

  // Mood distribution
  const moodCounts = sessions.reduce((acc, s) => {
    if (s.mood) {
      acc[s.mood] = (acc[s.mood] || 0) + 1;
    }
    return acc;
  }, {});

  const moodData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count
  }));

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#6366f1'];

  // Last 7 days activity
  const last7DaysData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59);
    
    const daySessions = sessions.filter(s => {
      const sessionDate = new Date(s.created_date);
      return sessionDate >= dayStart && sessionDate <= dayEnd;
    });

    const totalMins = daySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    
    return {
      date: format(date, 'EEE'),
      minutes: totalMins
    };
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Statistics</h1>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-green-400 to-emerald-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Total Minutes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalMinutes}</p>
            <p className="text-white/80 text-sm">{sessions.length} sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {last7Days.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)} min
            </p>
            <p className="text-white/80 text-sm">{last7Days.length} sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{streak} days</p>
            <p className="text-white/80 text-sm">Keep going!</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Longest Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{longestSession} min</p>
            <p className="text-white/80 text-sm">Personal best</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Last 7 Days Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No mood data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.slice(0, 10).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">
                      {session.duration_minutes} minutes
                    </span>
                    {session.mood && (
                      <Badge variant="secondary" className="capitalize">
                        {session.mood}
                      </Badge>
                    )}
                    {session.session_type && session.session_type !== "timer" && (
                      <Badge variant="outline" className="capitalize">
                        {session.session_type.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.created_date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  {session.note && (
                    <p className="text-sm text-gray-700 mt-2 italic">"{session.note}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}