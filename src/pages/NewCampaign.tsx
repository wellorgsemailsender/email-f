import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  FileText, 
  Mail, 
  Send, 
  Paperclip,
  Check,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewCampaign() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [campaignData, setCampaignData] = useState({
    csvFile: null as File | null,
    fromEmail: "hr@wellorgs.com",
    subject: "",
    emailBody: "",
    attachments: [] as File[],
    selectedTemplate: ""
  });

  // Mock campaign templates - in real app, this would come from API
  const campaignTemplates = [
    {
      id: "welcome",
      name: "Welcome Email",
      subject: "Welcome to {{company}}!",
      body: "Hi {{name}},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team"
    },
    {
      id: "newsletter",
      name: "Newsletter Template",
      subject: "Monthly Newsletter - {{month}}",
      body: "Hi {{name}},\n\nHere's what's new this month:\n\n- Feature updates\n- Company news\n- Upcoming events\n\nStay connected!\nThe Team"
    },
    {
      id: "promotion",
      name: "Promotional Email",
      subject: "Special Offer for {{name}}",
      body: "Hi {{name}},\n\nWe have a special offer just for you! Use code SAVE20 for 20% off.\n\nDon't miss out!\nThe Sales Team"
    }
  ];

  const handleFileUpload = (type: 'csv' | 'attachment', files: FileList | null) => {
    if (!files) return;
    
    if (type === 'csv') {
      setCampaignData(prev => ({ ...prev, csvFile: files[0] }));
    } else {
      setCampaignData(prev => ({ 
        ...prev, 
        attachments: [...prev.attachments, ...Array.from(files)]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setCampaignData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSendCampaign = async () => {
    if (!campaignData.csvFile) {
      toast({
        variant: "destructive",
        title: "Missing CSV File",
        description: "Please upload a CSV file with recipient emails."
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('csv_file', campaignData.csvFile);
    formData.append('from', campaignData.fromEmail);
    formData.append('subject', campaignData.subject);
    formData.append('email_template', campaignData.emailBody);

    campaignData.attachments.forEach(attachment => {
      formData.append('attachments', attachment);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://emailsender-zhym.onrender.com/upload-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast({
          title: "Campaign sent successfully!",
          description: "Your email campaign has been sent to all recipients."
        });
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Failed to send campaign",
          description: errorData.error || "An unknown error occurred."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not connect to the server. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: "Recipients", description: "Upload your CSV file" },
    { number: 2, title: "Email Content", description: "Compose your message" },
    { number: 3, title: "Attachments", description: "Add files to include" }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Create New Campaign</h1>
          <p className="text-muted-foreground">Design and send your email campaign</p>
        </div>

        {/* Progress Steps */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.number 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-muted-foreground mx-8" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Recipients
              </CardTitle>
              <CardDescription>
                Upload a CSV file containing your email recipients. 
                The file should include columns for email addresses and any personalization fields.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center relative"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add('border-primary');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-primary');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-primary');
                  const files = e.dataTransfer.files;
                  if (files && files[0]?.type === 'text/csv') {
                    handleFileUpload('csv', files);
                  }
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload('csv', e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="csv-upload"
                />
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Drop your CSV file here</h3>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Button variant="outline" className="pointer-events-none">
                  Select CSV File
                </Button>
              </div>

              {campaignData.csvFile && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{campaignData.csvFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(campaignData.csvFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Badge variant="secondary">Ready</Badge>
                </div>
              )}

              <div className="text-sm text-muted-foreground space-y-2">
                <h4 className="font-medium text-foreground">CSV Format Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Must include an "email" column</li>
                  <li>Optional columns: "name", "company", "custom_field"</li>
                  <li>First row should contain column headers</li>
                  <li>Maximum file size: 10MB</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Content
              </CardTitle>
              <CardDescription>
                Compose your email message with subject line and body content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Campaign Template (Optional)</Label>
                  <Select
                    value={campaignData.selectedTemplate}
                    onValueChange={(value) => {
                      const template = campaignTemplates.find(t => t.id === value);
                      if (template) {
                        setCampaignData(prev => ({
                          ...prev,
                          selectedTemplate: value,
                          subject: template.subject,
                          emailBody: template.body
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campaign template">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{campaignData.selectedTemplate ? campaignTemplates.find(t => t.id === campaignData.selectedTemplate)?.name : "Select a campaign template"}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {template.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      value={campaignData.fromEmail}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, fromEmail: e.target.value }))}
                      placeholder="hr@wellorgs.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      value={campaignData.subject}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Your email subject..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailBody">Email Body</Label>
                <Textarea
                  id="emailBody"
                  value={campaignData.emailBody}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, emailBody: e.target.value }))}
                  placeholder="Write your email content here... You can use {{name}} for personalization."
                  className="min-h-[300px]"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <h4 className="font-medium text-foreground mb-2">Personalization Variables:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{"{{name}}"}</Badge>
                  <Badge variant="outline">{"{{email}}"}</Badge>
                  <Badge variant="outline">{"{{company}}"}</Badge>
                  <Badge variant="outline">{"{{custom_field}}"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="w-5 h-5" />
                Attachments
              </CardTitle>
              <CardDescription>
                Add files to include with your email campaign (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Paperclip className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Add attachments</h3>
                <p className="text-sm text-muted-foreground mb-4">Select files to attach to your emails</p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload('attachment', e.target.files)}
                  className="hidden"
                  id="attachment-upload"
                />
                <Label htmlFor="attachment-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Select Files
                  </Button>
                </Label>
              </div>

              {campaignData.attachments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Attached Files:</h4>
                  {campaignData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <p><strong>Note:</strong> Keep attachments under 5MB total for better deliverability.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={nextStep}
              disabled={currentStep === 1 && !campaignData.csvFile}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSendCampaign}
              disabled={isLoading || !campaignData.subject || !campaignData.emailBody}
              className="bg-gradient-to-r from-primary to-primary-glow"
            >
              {isLoading ? (
                "Sending Campaign..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Campaign
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}