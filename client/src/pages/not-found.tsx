import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-300">404</h1>
          <h2 className="text-2xl font-bold text-slate-900 mt-4">Page Not Found</h2>
          <p className="text-slate-600 mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 space-y-4">
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setLocation('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
            <Button
              variant="outline"
              className="w-full border-green-500 text-green-700 hover:bg-green-50"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}