import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Download, Search, UserX } from "lucide-react";

const API_URL = 'https://emailsender-zhym.onrender.com';

interface Unsubscriber {
  email: string;
  unsubscribed_at?: string;
  _id?: string;
}

export default function Unsubscribers() {
  const [unsubscribers, setUnsubscribers] = useState<Unsubscriber[]>([]);
  const [filteredUnsubscribers, setFilteredUnsubscribers] = useState<Unsubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchUnsubscribers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token found:', !!token);
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making API call to:', `${API_URL}/unsubscribers`);
      const response = await fetch(`${API_URL}/unsubscribers`, {
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
      console.log('Received unsubscribers:', data);
      console.log('Response status:', response.status);
      
      // Format unsubscribers data - the API returns unsubscribers array
      const formattedUnsubscribers = data.unsubscribers
        .filter((user: any) => user.email) // Only include unsubscribers with email
        .map((user: any) => ({
          email: user.email,
          unsubscribed_at: user.created_at || user.date_added || new Date().toISOString(),
          _id: user._id || user.email
        }));
      
      console.log('Formatted unsubscribers:', formattedUnsubscribers);
      setUnsubscribers(formattedUnsubscribers);
      setFilteredUnsubscribers(formattedUnsubscribers);
    } catch (error) {
      console.error('Error fetching unsubscribers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch unsubscribers. Please try again.",
        variant: "destructive",
      });
      setUnsubscribers([]);
      setFilteredUnsubscribers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnsubscribers();
  }, []);

  useEffect(() => {
    const filtered = unsubscribers.filter(unsubscriber =>
      unsubscriber.email && unsubscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUnsubscribers(filtered);
  }, [searchTerm, unsubscribers]);

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Unsubscribed At'],
      ...filteredUnsubscribers.map(unsubscriber => [
        unsubscriber.email,
        unsubscriber.unsubscribed_at || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unsubscribers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Unsubscribers exported to CSV successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UserX className="h-6 w-6" />
                <div>
                  <CardTitle>Unsubscribers</CardTitle>
                  <CardDescription>
                    Manage unsubscribed email addresses ({filteredUnsubscribers.length} of {unsubscribers.length})
                  </CardDescription>
                </div>
              </div>
              <Button onClick={exportToCSV} disabled={filteredUnsubscribers.length === 0}>
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
                  placeholder="Search unsubscribers by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading unsubscribers...</p>
                </div>
              ) : filteredUnsubscribers.length === 0 ? (
                <div className="text-center py-8">
                  <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? "No unsubscribers found matching your search." : "No unsubscribers found."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUnsubscribers.map((unsubscriber, index) => (
                    <div
                      key={unsubscriber._id || index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          Unsubscribed
                        </Badge>
                        <span className="font-medium">{unsubscriber.email}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {unsubscriber.unsubscribed_at ? 
                          new Date(unsubscriber.unsubscribed_at).toLocaleDateString() : 
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