import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'https://emailsender-zhym.onrender.com';

interface CampaignData {
  _id: string;
  name: string;
  status: string;
  created_at: string;
  opens: number;
  clicks: number;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/campaigns`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setCampaigns(data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching campaigns:', error);
      setIsLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Email Campaigns</h1>
            <p className="text-muted-foreground">Manage and track your email campaigns</p>
          </div>
          <Link to="/campaigns/new">
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90">
              <Send className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>A complete list of your email campaigns and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading campaigns...</p>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign: CampaignData) => (
                  <div key={campaign._id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge variant={
                          campaign.status === "Completed" ? "default" :
                          campaign.status === "Sending" ? "secondary" : "outline"
                        }>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{campaign.created_at}</p>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{typeof campaign.opens === 'number' && campaign.opens !== undefined && campaign.opens !== null ? campaign.opens.toLocaleString() : '0'}</div>
                        <div className="text-muted-foreground">Opens</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{typeof campaign.clicks === 'number' && campaign.clicks !== undefined && campaign.clicks !== null ? campaign.clicks.toLocaleString() : '0'}</div>
                        <div className="text-muted-foreground">Clicks</div>
                      </div>
                    </div>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No campaigns found</p>
                    <Link to="/campaigns/new">
                      <Button variant="outline" className="mt-4">
                        Create your first campaign
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}