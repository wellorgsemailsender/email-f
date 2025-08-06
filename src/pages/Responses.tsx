import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageSquare, 
  Filter, 
  Search, 
  Eye,
  Reply,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";

interface EmailResponse {
  id: string; // MongoDB ObjectId as string
  from: string;
  subject: string;
  category: string;
  receivedDate: string;
  processed: boolean;
  body: string;
  selectedTemplate?: string;
}

interface PendingReview {
  id: string; // MongoDB ObjectId as string
  from: string;
  subject: string;
  receivedDate: string;
  body: string;
  reviewed?: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
}

export default function Responses() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<EmailResponse | null>(null);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [sendingAutoReply, setSendingAutoReply] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Real data from backend
  const [responses, setResponses] = useState<EmailResponse[]>([]);

  // Fetch email responses from backend on mount
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const result = await apiClient.getEmailResponses();
        if (result.success && Array.isArray(result.data?.responses)) {
          // Map backend fields to EmailResponse type
          const mapped = result.data.responses.map((item: any) => ({
            id: item._id,
            from: item.from_email || item.from || '',
            subject: item.subject || '',
            category: item.category || '',
            receivedDate: item.received_date ? new Date(item.received_date).toISOString().slice(0, 10) : '',
            processed: item.processed || false,
            body: item.body || ''
          }));
          setResponses(mapped);
        }
      } catch (error) {
        // Optionally show error toast
      }
    };
    fetchResponses();
  }, []);

  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);

  // Fetch manual reviews from backend on mount
  useEffect(() => {
    const fetchManualReviews = async () => {
      try {
        const result = await apiClient.request('/manual-review');
        if (result.success && Array.isArray(result.data)) {
          // Map backend fields to PendingReview type
          const reviews = result.data.map((item: any) => ({
            id: item._id,
            from: item.from_email || item.from || '',
            subject: item.subject || '',
            receivedDate: item.received_date ? new Date(item.received_date).toISOString().slice(0, 10) : '',
            body: item.body || item.message || '',
            reviewed: item.reviewed === true,
            reviewed_by: item.reviewed_by,
            reviewed_at: item.reviewed_at
          }));
          setPendingReviews(reviews);
        }
      } catch (error) {
        // Optionally show error toast
      }
    };
    fetchManualReviews();
  }, []);



  const getCategoryColor = (category: string) => {
    switch (category) {
      case "interested": return "bg-green-100 text-green-800";
      case "not_interested": return "bg-red-100 text-red-800";
      case "question": return "bg-blue-100 text-blue-800";
      case "complaint": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAutoReply = async (responseId: string, templateType: string = 'default') => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to send auto-replies.",
        variant: "destructive"
      });
      return;
    }

    setSendingAutoReply(responseId);
    try {
      let result;
      if (templateType === "custom") {
        result = await apiClient.sendAutoReply(responseId, templateType, customMessage);
      } else {
        result = await apiClient.sendAutoReply(responseId, templateType);
      }
      if (result.success) {
        toast({
          title: "Auto-reply sent successfully",
          description: result.message || "An automatic response has been sent to the customer."
        });
        // Update the local state to reflect the change
        const updatedResponses = responses.map(response => 
          response.id === responseId 
            ? { ...response, processed: true }
            : response
        );
      } else {
        throw new Error(result.error || 'Failed to send auto-reply');
      }
    } catch (error) {
      console.error('Auto-reply error:', error);
      toast({
        title: "Failed to send auto-reply",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setSendingAutoReply(null);
      setCustomMessage("");
    }
  };

  const [completingReview, setCompletingReview] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});
  const [reviewActions, setReviewActions] = useState<{ [key: string]: string }>({});

  const handleMarkComplete = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete reviews.",
        variant: "destructive"
      });
      return;
    }

    const actionTaken = reviewActions[reviewId];
    const notes = reviewNotes[reviewId];

    if (!actionTaken) {
      toast({
        title: "Action required",
        description: "Please select an action before marking as complete.",
        variant: "destructive"
      });
      return;
    }

    setCompletingReview(reviewId);
    
    try {
      const result = await apiClient.completeReview(reviewId, actionTaken, notes);

      if (result.success) {
        toast({
          title: "Review marked complete",
          description: "The response has been processed and marked as complete."
        });
        // Remove the completed review from the list
        setPendingReviews(prev => prev.filter(review => review.id !== reviewId));
        // Clear the form data for this review
        setReviewNotes(prev => {
          const newNotes = { ...prev };
          delete newNotes[reviewId];
          return newNotes;
        });
        setReviewActions(prev => {
          const newActions = { ...prev };
          delete newActions[reviewId];
          return newActions;
        });
      } else if (result.error === "Review not found and removed from backend") {
        toast({
          title: "Review not found",
          description: "This review was already processed or removed. It has been removed from your queue.",
          variant: "destructive"
        });
        setPendingReviews(prev => prev.filter(review => review.id !== reviewId));
        setReviewNotes(prev => {
          const newNotes = { ...prev };
          delete newNotes[reviewId];
          return newNotes;
        });
        setReviewActions(prev => {
          const newActions = { ...prev };
          delete newActions[reviewId];
          return newActions;
        });
      } else {
        throw new Error(result.error || 'Failed to complete review');
      }
    } catch (error) {
      console.error('Review completion error:', error);
      toast({
        title: "Failed to complete review",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setCompletingReview(null);
    }
  };

  const filteredResponses = responses.filter(response => {
    const matchesFilter = selectedFilter === "all" || response.category === selectedFilter;
    const matchesSearch = response.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Response Management</h1>
          <p className="text-muted-foreground">View, categorize, and manage email responses</p>
        </div>

        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Manual Review ({pendingReviews.filter(r => !r.reviewed).length})
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Reviewed ({pendingReviews.filter(r => r.reviewed).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Email Responses</CardTitle>
                <CardDescription>All categorized email responses from your campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by email or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="not_interested">Not Interested</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Responses Table */}
                <div className="space-y-3">
                  {filteredResponses.map((response) => (
                    <div key={response.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{response.from}</h4>
                            <Badge className={getCategoryColor(response.category)}>
                              {response.category.replace('_', ' ')}
                            </Badge>
                            {response.processed && (
                              <Badge variant="outline" className="text-green-600">
                                Processed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{response.subject}</p>
                          <p className="text-xs text-muted-foreground">{response.receivedDate}</p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedResponse(response)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Email Response</DialogTitle>
                                <DialogDescription>
                                  From: {response.from} • {response.receivedDate}
                                </DialogDescription>
                              </DialogHeader>
                                                              <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Subject: {response.subject}</h4>
                                    <div className="p-4 bg-muted rounded-lg">
                                      <p className="whitespace-pre-wrap">{response.body}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Auto-reply Preview */}
                                  <div>
                                    <h4 className="font-medium mb-2">Auto-reply Preview:</h4>
                                    {selectedResponse?.selectedTemplate === 'custom' ? (
                                      <Textarea
                                        value={customMessage}
                                        onChange={e => setCustomMessage(e.target.value)}
                                        placeholder="Type your custom auto-response message here..."
                                        className="w-full bg-blue-50 border border-blue-200 text-blue-800 font-medium"
                                        rows={7}
                                      />
                                    ) : (
                                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800 font-medium mb-2">
                                          Subject: {selectedResponse?.selectedTemplate === 'unsubscribe' ? 'Unsubscribe Request Processed' : 
                                                   selectedResponse?.selectedTemplate === 'complaint' ? 'Your Concern Has Been Received' : 
                                                   'Thank you for your message'}
                                        </p>
                                        <div className="text-sm text-blue-700">
                                          {selectedResponse?.selectedTemplate === 'unsubscribe' ? (
                                            <>
                                              <p>Dear Customer,</p>
                                              <p>Your unsubscribe request has been processed. You will no longer receive promotional emails from us.</p>
                                              <p>If you have any questions, please contact us at hr@wellorgs.com</p>
                                              <p>Thank you,<br/>Customer Service Team</p>
                                            </>
                                          ) : selectedResponse?.selectedTemplate === 'complaint' ? (
                                            <>
                                              <p>Dear Customer,</p>
                                              <p>We have received your concern and take it seriously. Our team will review your message and respond within 24 hours.</p>
                                              <p>Your feedback is important to us and helps us improve our services.</p>
                                              <p>Best regards,<br/>Customer Relations Team</p>
                                            </>
                                          ) : (
                                            <>
                                              <p>Dear Valued Customer,</p>
                                              <p>Thank you for your email. We have received your message and will respond within 24-48 hours.</p>
                                              <p>If this is urgent, please contact us directly at hr@wellorgs.com</p>
                                              <p>Best regards,<br/>Customer Service Team</p>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                      Reply Template:
                                    </span>
                                    <Select 
                                      defaultValue="default"
                                      onValueChange={(value) => {
                                        // Store the selected template for this response
                                        setSelectedResponse(prev => prev ? { ...prev, selectedTemplate: value } : null);
                                      }}
                                    >
                                      <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Select template" />
                                      </SelectTrigger>
                                      <SelectContent>
                                    <SelectItem value="default">Default Response</SelectItem>
                                    <SelectItem value="unsubscribe">Unsubscribe Confirmation</SelectItem>
                                    <SelectItem value="complaint">Complaint Acknowledgment</SelectItem>
                                    <SelectItem value="custom">Custom Message</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {selectedResponse?.selectedTemplate === "custom" && (
                                    <div className="w-full my-2">
                                      <Textarea
                                        placeholder="Type your custom auto-response message here..."
                                        value={customMessage}
                                        onChange={e => setCustomMessage(e.target.value)}
                                        className="w-full"
                                        rows={5}
                                      />
                                    </div>
                                  )}
                                  <Button 
                                    onClick={() => {
                                      if (selectedResponse?.selectedTemplate === "custom" && customMessage.trim()) {
                                        handleAutoReply(response.id, "custom");
                                      } else {
                                        handleAutoReply(response.id, selectedResponse?.selectedTemplate || 'default');
                                      }
                                    }}
                                    disabled={sendingAutoReply === response.id || (selectedResponse?.selectedTemplate === "custom" && !customMessage.trim())}
                                  >
                                    {sendingAutoReply === response.id ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <Reply className="w-4 h-4 mr-2" />
                                    )}
                                    {sendingAutoReply === response.id ? "Sending..." : "Send Auto-Reply"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Manual Review Queue</CardTitle>
                <CardDescription>Responses that require manual review and action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReviews.filter(r => !r.reviewed).map((review) => (
                  <div key={review.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{review.from}</h4>
                        <p className="text-sm text-muted-foreground">{review.subject}</p>
                        <p className="text-xs text-muted-foreground">{review.receivedDate}</p>
                        <Badge variant="outline" className="text-yellow-600 mr-2">Pending</Badge>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Manual Review</DialogTitle>
                            <DialogDescription>
                              Review and take action on this response
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Original Message:</h4>
                              <div className="p-4 bg-muted rounded-lg">
                                <p className="whitespace-pre-wrap">{review.body}</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-medium">Notes:</label>
                                <Textarea 
                                  placeholder="Add your notes about this response..." 
                                  className="mt-1"
                                  value={reviewNotes[review.id] || ''}
                                  onChange={(e) => setReviewNotes(prev => ({
                                    ...prev,
                                    [review.id]: e.target.value
                                  }))}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Action Taken:</label>
                                <Select 
                                  value={reviewActions[review.id] || ''}
                                  onValueChange={(value) => setReviewActions(prev => ({
                                    ...prev,
                                    [review.id]: value
                                  }))}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select action taken" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="replied_manually">Replied Manually</SelectItem>
                                    <SelectItem value="added_to_do_not_contact">Added to Do Not Contact</SelectItem>
                                    <SelectItem value="no_action_needed">No Action Needed</SelectItem>
                                    <SelectItem value="escalated">Escalated to Team</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button 
                                onClick={() => handleMarkComplete(review.id)}
                                disabled={completingReview === review.id}
                              >
                                {completingReview === review.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : null}
                                {completingReview === review.id ? "Completing..." : "Mark as Complete"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{review.body}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Reviewed Mails</CardTitle>
                <CardDescription>All mails that have been reviewed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReviews.filter(r => r.reviewed).map((review) => (
                  <div key={review.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{review.from}</h4>
                        <p className="text-sm text-muted-foreground">{review.subject}</p>
                        <p className="text-xs text-muted-foreground">{review.receivedDate}</p>
                        <Badge variant="outline" className="text-green-600 mr-2">Reviewed</Badge>
                        {review.reviewed_by && review.reviewed_at && (
                          <span className="text-xs text-muted-foreground ml-2">by {review.reviewed_by} at {new Date(review.reviewed_at).toLocaleString()}</span>
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Change Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Manual Review</DialogTitle>
                            <DialogDescription>
                              Update review or take further action on this response
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Original Message:</h4>
                              <div className="p-4 bg-muted rounded-lg">
                                <p className="whitespace-pre-wrap">{review.body}</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-medium">Notes:</label>
                                <Textarea 
                                  placeholder="Add your notes about this response..." 
                                  className="mt-1"
                                  value={reviewNotes[review.id] || ''}
                                  onChange={(e) => setReviewNotes(prev => ({
                                    ...prev,
                                    [review.id]: e.target.value
                                  }))}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Action Taken:</label>
                                <Select 
                                  value={reviewActions[review.id] || ''}
                                  onValueChange={(value) => setReviewActions(prev => ({
                                    ...prev,
                                    [review.id]: value
                                  }))}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select action taken" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="replied_manually">Replied Manually</SelectItem>
                                    <SelectItem value="added_to_do_not_contact">Added to Do Not Contact</SelectItem>
                                    <SelectItem value="no_action_needed">No Action Needed</SelectItem>
                                    <SelectItem value="escalated">Escalated to Team</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button 
                                onClick={() => handleMarkComplete(review.id)}
                                disabled={completingReview === review.id}
                              >
                                {completingReview === review.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : null}
                                {completingReview === review.id ? "Completing..." : "Change Review"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{review.body}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>
    </DashboardLayout>
  );
}