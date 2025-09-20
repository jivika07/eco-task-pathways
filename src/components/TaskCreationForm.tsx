import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

interface TaskCreationFormProps {
  onTaskCreated: (task: any) => void;
  onCancel: () => void;
}

export const TaskCreationForm = ({ onTaskCreated, onCancel }: TaskCreationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "",
    submissionType: "",
    points: "",
    deadline: "",
    resources: [] as string[]
  });
  const [newResource, setNewResource] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.taskType || !formData.submissionType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      taskType: formData.taskType as "individual" | "group",
      submissionType: formData.submissionType as "photo" | "video" | "text" | "checklist",
      points: parseInt(formData.points) || 10,
      deadline: formData.deadline,
      status: "pending" as const,
      submissions: 0,
      totalAssigned: 25, // Mock data
      resources: formData.resources
    };

    onTaskCreated(task);
    toast({
      title: "Task Created Successfully",
      description: `"${task.title}" has been assigned to your class`,
    });
  };

  const addResource = () => {
    if (newResource.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource("");
    }
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Create New Eco-Task</CardTitle>
        <CardDescription>
          Design an environmental task to inspire positive action in your students
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Plant a tree in your community"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points">Eco-Points</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                placeholder="10"
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description & Instructions *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed instructions for completing this eco-task..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Task Type *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, taskType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Task</SelectItem>
                  <SelectItem value="group">Group Task</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Submission Type *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, submissionType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="How will students submit?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo Evidence</SelectItem>
                  <SelectItem value="video">Video Evidence</SelectItem>
                  <SelectItem value="text">Text Report</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label>Learning Resources (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                placeholder="Add helpful links, videos, or documents..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
              />
              <Button type="button" onClick={addResource} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.resources.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.resources.map((resource, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {resource}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeResource(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create & Assign Task
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};