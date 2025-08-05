import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Plus, 
  Edit, 
  Copy, 
  Trash2,
  Search,
  Calendar,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateData {
  id: number;
  name: string;
  subject: string;
  body: string;
  lastModified: string;
  category: string;
}

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);
  const { toast } = useToast();

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    body: ""
  });

  // Mock data - will be replaced with real API calls
  const templates: TemplateData[] = [
    {
      id: 1,
      name: "Welcome Email",
      subject: "Welcome to {{company}}!",
      body: "Hi {{name}},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team",
      lastModified: "2024-01-15",
      category: "Onboarding"
    },
    {
      id: 2,
      name: "Product Launch",
      subject: "Introducing Our New Product: {{product_name}}",
      body: "Dear {{name}},\n\nWe're thrilled to announce the launch of our latest product...\n\nKey features:\n- Feature 1\n- Feature 2\n- Feature 3\n\nBest regards,\n{{sender_name}}",
      lastModified: "2024-01-12",
      category: "Marketing"
    },
    {
      id: 3,
      name: "Newsletter Template",
      subject: "{{company}} Newsletter - {{month}} {{year}}",
      body: "Hello {{name}},\n\nHere's what's new this month...\n\n## Latest Updates\n- Update 1\n- Update 2\n\n## Featured Article\n{{featured_content}}\n\nThanks for reading!\nThe {{company}} Team",
      lastModified: "2024-01-10",
      category: "Newsletter"
    },
    {
      id: 4,
      name: "Follow-up Email",
      subject: "Following up on our conversation",
      body: "Hi {{name}},\n\nI wanted to follow up on our recent conversation about {{topic}}.\n\nAs discussed, here are the next steps:\n1. Step 1\n2. Step 2\n3. Step 3\n\nPlease let me know if you have any questions.\n\nBest regards,\n{{sender_name}}",
      lastModified: "2024-01-08",
      category: "Sales"
    }
  ];

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields."
      });
      return;
    }

    // This will be replaced with actual API call
    toast({
      title: "Template created!",
      description: `Template "${newTemplate.name}" has been saved.`
    });
    
    setNewTemplate({ name: "", subject: "", body: "" });
    setIsCreating(false);
  };

  const handleEditTemplate = (template: TemplateData) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      subject: template.subject,
      body: template.body
    });
  };

  const handleSaveEdit = () => {
    toast({
      title: "Template updated!",
      description: `Template "${newTemplate.name}" has been updated.`
    });
    setEditingTemplate(null);
    setNewTemplate({ name: "", subject: "", body: "" });
  };

  const handleDuplicateTemplate = (template: TemplateData) => {
    toast({
      title: "Template duplicated!",
      description: `Created a copy of "${template.name}".`
    });
  };

  const handleDeleteTemplate = (template: TemplateData) => {
    toast({
      title: "Template deleted",
      description: `Template "${template.name}" has been removed.`
    });
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Onboarding": "bg-blue-100 text-blue-800",
      "Marketing": "bg-green-100 text-green-800",
      "Newsletter": "bg-purple-100 text-purple-800",
      "Sales": "bg-orange-100 text-orange-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Email Templates</h1>
            <p className="text-muted-foreground">Create and manage reusable email templates</p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary-glow">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Design a reusable email template for your campaigns
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateSubject">Subject Line</Label>
                  <Input
                    id="templateSubject"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter email subject..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateBody">Email Body</Label>
                  <Textarea
                    id="templateBody"
                    value={newTemplate.body}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Write your email template... Use {{variable}} for dynamic content."
                    className="min-h-[300px]"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2"><strong>Available Variables:</strong></p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">{"{{name}}"}</Badge>
                    <Badge variant="outline">{"{{email}}"}</Badge>
                    <Badge variant="outline">{"{{company}}"}</Badge>
                    <Badge variant="outline">{"{{sender_name}}"}</Badge>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates by name, subject, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Subject:</h4>
                  <p className="text-sm">{template.subject}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Preview:</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {template.body.substring(0, 120)}...
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Last modified: {template.lastModified}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditTemplate(template)}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Template</DialogTitle>
                        <DialogDescription>
                          Update your email template
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="editTemplateName">Template Name</Label>
                          <Input
                            id="editTemplateName"
                            value={newTemplate.name}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter template name..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="editTemplateSubject">Subject Line</Label>
                          <Input
                            id="editTemplateSubject"
                            value={newTemplate.subject}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Enter email subject..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="editTemplateBody">Email Body</Label>
                          <Textarea
                            id="editTemplateBody"
                            value={newTemplate.body}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, body: e.target.value }))}
                            placeholder="Write your email template..."
                            className="min-h-[300px]"
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Create your first email template to get started."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Start Guide */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Template Variables Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Common Variables:</h4>
                <div className="space-y-2 text-sm">
                  <div><Badge variant="outline" className="mr-2">{"{{name}}"}</Badge> Recipient's name</div>
                  <div><Badge variant="outline" className="mr-2">{"{{email}}"}</Badge> Recipient's email</div>
                  <div><Badge variant="outline" className="mr-2">{"{{company}}"}</Badge> Your company name</div>
                  <div><Badge variant="outline" className="mr-2">{"{{sender_name}}"}</Badge> Sender's name</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use variables to personalize your emails</li>
                  <li>• Test your templates before sending campaigns</li>
                  <li>• Keep subject lines under 50 characters</li>
                  <li>• Include a clear call-to-action</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}