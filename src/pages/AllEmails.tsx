import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const API_URL = 'https://emailsender-zhym.onrender.com'; // Render backend URL

type EmailStatus = 'all' | 'subscribed' | 'unsubscribed' | 'failed';

interface EmailData {
  _id: string;
  from_email: string;
  subject: string;
  received_date: string;
  category: string;
  body: string;
  status?: 'subscribed' | 'unsubscribed' | 'failed';
}

export default function AllEmails() {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTestEmails, setIsAddingTestEmails] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<EmailStatus>('all');
  const { toast } = useToast();

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching emails with filter:', currentFilter);
      const response = await fetch(`${API_URL}/all-received-emails${currentFilter !== 'all' ? `?status=${currentFilter}` : ''}`, {
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
      console.log('Received emails:', data);
      setEmails(data);
      setFilteredEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
      // You might want to show this error to the user
      setEmails([]);
      setFilteredEmails([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [currentFilter]);

  const handleFilterChange = (status: EmailStatus) => {
    setCurrentFilter(status);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>All Received Emails</CardTitle>
                <CardDescription>A log of all emails received by hr@wellorgs.com</CardDescription>
              </div>
              <Button
                variant="outline"
                disabled={isAddingTestEmails}
                onClick={async () => {
                  try {
                    setIsAddingTestEmails(true);
                    const token = localStorage.getItem('token');
                    if (!token) {
                      throw new Error('No authentication token found');
                    }

                    console.log('Adding test emails...');
                    const response = await fetch(`${API_URL}/add_test_emails`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }
                    });

                    if (!response.ok) {
                      const errorText = await response.text();
                      console.error('Server response:', errorText);
                      throw new Error(errorText || 'Failed to add test emails');
                    }

                    toast({
                      title: "Success",
                      description: "Test emails added successfully",
                    });

                    // Refresh the email list
                    await fetchEmails();
                  } catch (error) {
                    console.error('Error adding test emails:', error);
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: error instanceof Error ? error.message : "Failed to add test emails",
                    });
                  } finally {
                    setIsAddingTestEmails(false);
                  }
                }}
              >
                {isAddingTestEmails ? 'Adding...' : 'Add Test Emails'}
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                variant={currentFilter === 'all' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('all')}
              >
                All
              </Button>
              <Button 
                variant={currentFilter === 'subscribed' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('subscribed')}
              >
                Subscribed
              </Button>
              <Button 
                variant={currentFilter === 'unsubscribed' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('unsubscribed')}
              >
                Unsubscribed
              </Button>
              <Button 
                variant={currentFilter === 'failed' ? 'default' : 'outline'}
                onClick={() => handleFilterChange('failed')}
              >
                Failed
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-lg text-muted-foreground">Loading emails...</p>
              </div>
            ) : emails.length === 0 ? (
              <div className="flex justify-center items-center p-8">
                <p className="text-lg text-muted-foreground">No emails found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {emails.map((email: EmailData) => (
                  <div key={email._id} className="p-4 border rounded-lg">
                    <p><strong>From:</strong> {email.from_email}</p>
                    <p><strong>Subject:</strong> {email.subject}</p>
                    <p><strong>Date:</strong> {new Date(email.received_date).toLocaleString()}</p>
                    <p><strong>Category:</strong> {email.category}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <Badge variant={
                        email.status === 'subscribed' ? 'default' :
                        email.status === 'unsubscribed' ? 'destructive' :
                        email.status === 'failed' ? 'secondary' : 'outline'
                      }>
                        {email.status || 'unknown'}
                      </Badge>
                    </p>
                    <hr className="my-2" />
                    <p>{email.body}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}