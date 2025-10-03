'use client';

import { ProtectedRoute, useAuth } from '@/features/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Shield } from 'lucide-react';

function DashboardContent() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 capitalize">{user?.role?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Analysis</CardTitle>
              <CardDescription>Recent analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No analyses yet</p>
                <Button className="w-full">
                  Analyze Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Upload Resume
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
