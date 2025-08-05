import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Mail, 
  MessageSquare,
  Eye,
  MousePointer,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
  // Mock data - will be replaced with real API calls
  const campaignMetrics = {
    totalCampaigns: 45,
    totalEmailsSent: 125430,
    totalOpens: 87501,
    totalClicks: 23478,
    openRate: 69.8,
    clickRate: 18.7,
    bounceRate: 2.3,
    unsubscribeRate: 0.8
  };

  const topCampaigns = [
    { name: "Summer Product Launch", sent: 15430, opens: 12344, clicks: 4567, openRate: 80.0, clickRate: 29.6 },
    { name: "Newsletter Q4 2023", sent: 12890, opens: 9234, clicks: 2890, openRate: 71.6, clickRate: 22.4 },
    { name: "Black Friday Special", sent: 18765, opens: 13456, clicks: 5234, openRate: 71.7, clickRate: 27.9 },
    { name: "Welcome Series Part 1", sent: 8934, opens: 6789, clicks: 1567, openRate: 76.0, clickRate: 17.5 },
    { name: "Product Update News", sent: 11245, opens: 7890, clicks: 1890, openRate: 70.2, clickRate: 16.8 }
  ];

  const responseMetrics = {
    totalResponses: 3456,
    responseRate: 2.8,
    sentimentBreakdown: {
      positive: 2234,
      neutral: 890,
      negative: 332
    },
    categoryBreakdown: {
      interested: 1890,
      question: 890,
      not_interested: 456,
      complaint: 220
    }
  };

  const timeFrameData = [
    { period: "Jan 2024", campaigns: 8, emails: 23450, opens: 16815, clicks: 4378 },
    { period: "Feb 2024", campaigns: 6, emails: 18790, opens: 13153, clicks: 3508 },
    { period: "Mar 2024", campaigns: 9, emails: 28945, opens: 20861, clicks: 5789 },
    { period: "Apr 2024", campaigns: 7, emails: 21234, opens: 14864, clicks: 3967 },
    { period: "May 2024", campaigns: 5, emails: 15678, opens: 10975, clicks: 2934 },
    { period: "Jun 2024", campaigns: 10, emails: 32333, opens: 22633, clicks: 6789 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Detailed insights into your email campaign performance</p>
          </div>
          <div className="flex gap-3">
            <Select defaultValue="last-6-months">
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
            <TabsTrigger value="responses">Response Analytics</TabsTrigger>
            <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {campaignMetrics.totalCampaigns}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    +12% from last period
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                  <Mail className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {campaignMetrics.totalEmailsSent.toLocaleString()}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    +18% from last period
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                  <Eye className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {campaignMetrics.openRate}%
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    +5.2% from last period
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                  <MousePointer className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {campaignMetrics.clickRate}%
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                    -1.3% from last period
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Campaign Performance Over Time</CardTitle>
                  <CardDescription>Monthly campaign metrics for the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeFrameData.map((month, index) => (
                      <div key={month.period} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{month.period}</h4>
                          <p className="text-sm text-muted-foreground">{month.campaigns} campaigns sent</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium">{month.emails.toLocaleString()}</div>
                            <div className="text-muted-foreground">Sent</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{month.opens.toLocaleString()}</div>
                            <div className="text-muted-foreground">Opens</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{month.clicks.toLocaleString()}</div>
                            <div className="text-muted-foreground">Clicks</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Key Ratios</CardTitle>
                  <CardDescription>Important email marketing metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Open Rate</span>
                      <span className="text-sm font-bold">{campaignMetrics.openRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${campaignMetrics.openRate}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Click Rate</span>
                      <span className="text-sm font-bold">{campaignMetrics.clickRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${campaignMetrics.clickRate}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Bounce Rate</span>
                      <span className="text-sm font-bold">{campaignMetrics.bounceRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${campaignMetrics.bounceRate * 10}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Unsubscribe Rate</span>
                      <span className="text-sm font-bold">{campaignMetrics.unsubscribeRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${campaignMetrics.unsubscribeRate * 10}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Top Performing Campaigns</CardTitle>
                <CardDescription>Best performing campaigns based on open and click rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCampaigns.map((campaign, index) => (
                    <div key={campaign.name} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-muted-foreground">{campaign.sent.toLocaleString()} emails sent</p>
                        </div>
                      </div>
                      <div className="flex gap-8 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{campaign.opens.toLocaleString()}</div>
                          <div className="text-muted-foreground">Opens</div>
                          <Badge variant="outline" className="mt-1">{campaign.openRate}%</Badge>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{campaign.clicks.toLocaleString()}</div>
                          <div className="text-muted-foreground">Clicks</div>
                          <Badge variant="outline" className="mt-1">{campaign.clickRate}%</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
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
                      <span className="font-semibold">{responseMetrics.sentimentBreakdown.positive}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ 
                        width: `${(responseMetrics.sentimentBreakdown.positive / responseMetrics.totalResponses) * 100}%` 
                      }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Neutral
                      </span>
                      <span className="font-semibold">{responseMetrics.sentimentBreakdown.neutral}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ 
                        width: `${(responseMetrics.sentimentBreakdown.neutral / responseMetrics.totalResponses) * 100}%` 
                      }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Negative
                      </span>
                      <span className="font-semibold">{responseMetrics.sentimentBreakdown.negative}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ 
                        width: `${(responseMetrics.sentimentBreakdown.negative / responseMetrics.totalResponses) * 100}%` 
                      }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Response Categories</CardTitle>
                  <CardDescription>Types of responses received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(responseMetrics.categoryBreakdown).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="capitalize">{category.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{count}</span>
                          <Badge variant="outline">
                            {((count / responseMetrics.totalResponses) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Key insights and patterns in your email marketing performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Best Day to Send</span>
                    </div>
                    <p className="text-2xl font-bold">Tuesday</p>
                    <p className="text-sm text-muted-foreground">23% higher open rates</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Best Time to Send</span>
                    </div>
                    <p className="text-2xl font-bold">10:00 AM</p>
                    <p className="text-sm text-muted-foreground">Peak engagement window</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Avg. Response Time</span>
                    </div>
                    <p className="text-2xl font-bold">2.4 hrs</p>
                    <p className="text-sm text-muted-foreground">From send to response</p>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-medium mb-4">Key Recommendations</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">Optimize Send Times</p>
                        <p className="text-sm text-green-700 dark:text-green-300">Schedule more campaigns for Tuesday mornings to maximize engagement</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">Segment Your Audience</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Create targeted segments based on engagement patterns to improve performance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <Mail className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800 dark:text-orange-200">A/B Test Subject Lines</p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">Test different subject line styles to improve open rates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}