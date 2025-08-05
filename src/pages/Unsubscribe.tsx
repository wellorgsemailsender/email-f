import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleUnsubscribe = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please provide an email address to unsubscribe."
      });
      return;
    }

    setIsLoading(true);

    // This will be replaced with actual API call
    setTimeout(() => {
      setIsUnsubscribed(true);
      setIsLoading(false);
      toast({
        title: "Successfully unsubscribed",
        description: "You have been removed from our mailing list."
      });
    }, 1000);
  };

  if (isUnsubscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <div className="w-full max-w-md mx-auto">{/* Explicit centering */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-600">Unsubscribed</h1>
          </div>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">You're all set!</h2>
              <p className="text-muted-foreground mb-4">
                {email} has been successfully removed from our mailing list.
              </p>
              <p className="text-sm text-muted-foreground">
                You will no longer receive emails from us. If you change your mind, 
                you can always subscribe again using our sign-up form.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-md mx-auto">{/* Explicit centering */}
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Unsubscribe</h1>
          <p className="text-muted-foreground">Manage your email preferences</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle>Confirm Unsubscribe</CardTitle>
            <CardDescription>
              Are you sure you want to unsubscribe from our emails?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {email && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-2">
              <p>By confirming, you will:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Stop receiving promotional emails</li>
                <li>Stop receiving newsletter updates</li>
                <li>Be removed from our mailing list</li>
              </ul>
              <p className="mt-3">
                <strong>Note:</strong> You may still receive transactional emails 
                related to your account or services.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleUnsubscribe}
                disabled={isLoading}
              >
                {isLoading ? "Unsubscribing..." : "Unsubscribe"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}