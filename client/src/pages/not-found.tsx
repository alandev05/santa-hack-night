import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as RadixIcons from "@radix-ui/react-icons";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-semibold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mt-4">Page Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <Button
              className="w-full"
              onClick={() => setLocation('/')}
            >
              <RadixIcons.HomeIcon className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <RadixIcons.ArrowLeftIcon className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}