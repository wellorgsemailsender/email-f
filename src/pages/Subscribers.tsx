import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Download, Search, Users } from "lucide-react";

const API_URL = 'https://emailsender-zhym.onrender.com';

interface Subscriber {
  email: string;
  subscribed_at?: string;
  _id?: string;
}

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token found:', !!token);
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making API call to:', `${API_URL}/subscribers`);
      const response = await fetch(`${API_URL}/subscribers`, {
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
      console.log('Received subscribers:', data);
      console.log('Response status:', response.status);
      
      // Check if data.subscribers exists
      if (!data.subscribers) {
        console.error('No subscribers array in response:', data);
        throw new Error('Invalid response format from server');
      }
      
      // Format subscribers data - the API returns subscribers array
      const formattedSubscribers = data.subscribers
        .filter((user: any) => user.email) // Only include subscribers with email
        .map((user: any) => ({
          email: user.email,
          subscribed_at: user.created_at || user.date_added || new Date().toISOString(),
          _id: user._id || user.email
        }));
      
      console.log('Formatted subscribers:', formattedSubscribers);
      setSubscribers(formattedSubscribers);
      setFilteredSubscribers(formattedSubscribers);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscribers. Please try again.",
        variant: "destructive",
      });
      setSubscribers([]);
      setFilteredSubscribers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    const filtered = subscribers.filter(subscriber =>
      subscriber.email && subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchTerm, subscribers]);

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Subscribed At'],
      ...filteredSubscribers.map(subscriber => [
        subscriber.email,
        subscriber.subscribed_at || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Subscribers exported to CSV successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <div>
                  <CardTitle>Subscribers</CardTitle>
                  <CardDescription>
                    Manage your email subscribers ({filteredSubscribers.length} of {subscribers.length})
                  </CardDescription>
                </div>
              </div>
              <Button onClick={exportToCSV} disabled={filteredSubscribers.length === 0}>
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
                  placeholder="Search subscribers by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading subscribers...</p>
                </div>
              ) : filteredSubscribers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? "No subscribers found matching your search." : "No subscribers found."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSubscribers.map((subscriber, index) => (
                    <div
                      key={subscriber._id || index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Subscribed
                        </Badge>
                        <span className="font-medium">{subscriber.email}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {subscriber.subscribed_at ? 
                          new Date(subscriber.subscribed_at).toLocaleDateString() : 
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