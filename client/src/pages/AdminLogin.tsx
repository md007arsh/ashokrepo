import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (loginData: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", loginData);
      return response.json();
    },
    onSuccess: () => {
      localStorage.setItem("adminAuthenticated", "true");
      navigate("/admin/dashboard");
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Admin Login</CardTitle>
          <p className="text-gray-600">Access the admin dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-blue-600"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => navigate("/")}>
              Back to Shop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
