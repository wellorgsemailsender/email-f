import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Download, Search, AlertTriangle } from "lucide-react";

const API_URL = 'https://emailsender-zhym.onrender.com';

interface FailedEmail {
  email: string;
  failed_at?: string;
  error_message?: string;
  campaign_id?: string;
  _id?: string;
}

export default function FailedEmails() {
  const [failedEmails, setFailedEmails] = useState<FailedEmail[]>([]);
  const [filteredFailedEmails, setFilteredFailedEmails] = useState<FailedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchFailedEmails = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token found:', !!token);
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making API call to:', `${API_URL}/failed-emails`);
      const response = await fetch(`${API_URL}/failed-emails`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in again');
        }
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received failed emails:', data);
      console.log('Response status:', response.status);
      
      // Format failed emails data - the API returns failed_emails array
      const formattedFailedEmails = data.failed_emails
        .filter((failedEmail: any) => failedEmail.to_email || failedEmail.email) // Only include failed emails with email
        .map((failedEmail: any) => ({
          email: failedEmail.to_email || failedEmail.email,
          failed_at: failedEmail.created_at || failedEmail.timestamp || new Date().toISOString(),
          error_message: failedEmail.error_message || 'Email delivery failed',
          campaign_id: failedEmail.campaign_id,
          _id: failedEmail._id || failedEmail.email
        }));
      
      console.log('Formatted failed emails:', formattedFailedEmails);
      setFailedEmails(formattedFailedEmails);
      setFilteredFailedEmails(formattedFailedEmails);
    } catch (error) {
      console.error('Error fetching failed emails:', error);
      toast({
        title: "Error",
        description: "Failed to fetch failed emails. Please try again.",
        variant: "destructive",
      });
      setFailedEmails([]);
      setFilteredFailedEmails([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFailedEmails();
  }, []);

  useEffect(() => {
    const filtered = failedEmails.filter(failedEmail =>
      failedEmail.email && failedEmail.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFailedEmails(filtered);
  }, [searchTerm, failedEmails]);

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Failed At', 'Error Message'],
      ...filteredFailedEmails.map(failedEmail => [
        failedEmail.email,
        failedEmail.failed_at || 'N/A',
        failedEmail.error_message || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `failed_emails_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Failed emails exported to CSV successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <div>
                  <CardTitle>Failed Emails</CardTitle>
                  <CardDescription>
                    Track emails that failed to deliver ({filteredFailedEmails.length} of {failedEmails.length})
                  </CardDescription>
                </div>
              </div>
              <Button onClick={exportToCSV} disabled={filteredFailedEmails.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search failed emails by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading failed emails...</p>
                </div>
              ) : filteredFailedEmails.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? "No failed emails found matching your search." : "No failed emails found."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFailedEmails.map((failedEmail, index) => (
                    <div
                      key={failedEmail._id || index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                          Failed
                        </Badge>
                        <span className="font-medium">{failedEmail.email}</span>
                        {failedEmail.error_message && (
                          <span className="text-sm text-gray-500">
                            ({failedEmail.error_message})
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {failedEmail.failed_at ? 
                          new Date(failedEmail.failed_at).toLocaleDateString() : 
                          'N/A'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 