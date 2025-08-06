import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Mail, 
  AlertCircle,
  TrendingUp,
  Send,
  MessageSquare,
  FileText,
  ArrowRight
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'https://emailsender-zhym.onrender.com'; // Render backend URL

interface CampaignData {
  _id: string;
  name: string;
  status: string;
  date: string;
  opens: number;
  clicks: number;
}

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  const [stats, setStats] = useState({
    totalEmailsSent: 0,
    totalSubscribers: 0,
    totalUnsubscribed: 0,
    responsesNeedingReview: 0
  });

  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    neutral: 0,
    negative: 0
  });

  const [recentCampaigns, setRecentCampaigns] = useState<CampaignData[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');

    // Fetch stats
    fetch(`${API_URL}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('Stats data:', data);
      if (data && typeof data === 'object') {
        setStats({
          totalEmailsSent: Number(data.totalEmailsSent) || 0,
          totalSubscribers: Number(data.totalSubscribers) || 0,
          totalUnsubscribed: Number(data.totalUnsubscribed) || 0,
          responsesNeedingReview: Number(data.responsesNeedingReview) || 0
        });
      } else {
        console.error('Invalid stats data format:', data);
      }
    })
    .catch(error => {
      console.error('Error fetching stats:', error);
      setStats({
        totalEmailsSent: 0,
        totalSubscribers: 0,
        totalUnsubscribed: 0,
        responsesNeedingReview: 0
      });
    });

    // Fetch sentiment data
    fetch(`${API_URL}/response-sentiment`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => setSentimentData(data))
    .catch(error => console.error('Error fetching sentiment data:', error));

    // Fetch recent campaigns
    fetch(`${API_URL}/recent-campaigns`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => setRecentCampaigns(data))
    .catch(error => console.error('Error fetching recent campaigns:', error));

  }, [isAuthenticated]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your email campaigns and responses</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={async () => {
                const token = localStorage.getItem('token');
                try {
                  const res = await fetch(`${API_URL}/scan-responses`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  if (!res.ok) {
                    const errorText = await res.text();
                    alert(`Scan failed: ${errorText}`);
                  } else {
                    alert('Scan completed successfully!');
                  }
                } catch (err) {
                  alert('Error triggering scan: ' + err);
                }
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Scan Responses
            </Button>
            <Link to="/campaigns/new">
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90">
                <Send className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {typeof stats.totalEmailsSent === 'number' && stats.totalEmailsSent !== undefined && stats.totalEmailsSent !== null ? stats.totalEmailsSent.toLocaleString() : 'N/A'}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {typeof stats.totalSubscribers === 'number' && stats.totalSubscribers !== undefined && stats.totalSubscribers !== null ? stats.totalSubscribers.toLocaleString() : 'N/A'}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                +8% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Unsubscribed</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {stats.totalUnsubscribed}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                -2% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Responses to Review</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {stats.responsesNeedingReview}
              </div>
              <Link to="/responses" className="text-xs text-purple-600 hover:underline inline-flex items-center mt-1">
                Review now <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Response Sentiment Chart */}
          <Card className="lg:col-span-1 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Response Sentiment
              </CardTitle>
              <CardDescription>Breakdown of response sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Positive
                  </span>
                  <span className="font-semibold">{sentimentData.positive}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${sentimentData.positive}%` }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Neutral
                  </span>
                  <span className="font-semibold">{sentimentData.neutral}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${sentimentData.neutral}%` }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Negative
                  </span>
                  <span className="font-semibold">{sentimentData.negative}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${sentimentData.negative}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Campaigns
                </CardTitle>
                <CardDescription>Latest email campaigns and their performance</CardDescription>
              </div>
              <Link to="/campaigns">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCampaigns.map((campaign: CampaignData) => (
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your email campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/campaigns/new" className="group">
                <div className="p-6 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <Send className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium mb-2">Create New Campaign</h3>
                  <p className="text-sm text-muted-foreground">Design and send a new email campaign to your subscribers</p>
                </div>
              </Link>

              <Link to="/responses" className="group">
                <div className="p-6 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <MessageSquare className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium mb-2">Review Responses</h3>
                  <p className="text-sm text-muted-foreground">Check and categorize incoming email responses</p>
                </div>
              </Link>

              <Link to="/templates" className="group">
                <div className="p-6 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <FileText className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium mb-2">Manage Templates</h3>
                  <p className="text-sm text-muted-foreground">Create and edit reusable email templates</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}