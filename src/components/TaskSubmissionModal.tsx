import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, MapPin, Clock } from "lucide-react";
import { EcoTask } from "./TaskCard";

interface TaskSubmissionModalProps {
  task: EcoTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, submission: any) => void;
}

export const TaskSubmissionModal = ({ task, isOpen, onClose, onSubmit }: TaskSubmissionModalProps) => {
  const { toast } = useToast();
  const [note, setNote] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!task) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - only allow images and PDFs
      const validTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload only images (JPG, PNG, GIF, WebP) or PDF files",
          variant: "destructive",
        });
        return;
      }

      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 20MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile && task.submissionType !== "text") {
      toast({
        title: "Missing Evidence",
        description: "Please upload the required evidence file",
        variant: "destructive",
      });
      return;
    }

    const submission = {
      taskId: task.id,
      note,
      file: selectedFile,
      timestamp: new Date().toISOString(),
      location: "Current Location" // Mock geolocation
    };

    onSubmit(task.id, submission);
    
    toast({
      title: "Submission Successful",
      description: "Your evidence has been submitted for review",
    });
    
    // Reset form
    setNote("");
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const getSubmissionTypeIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <Camera className="w-5 h-5" />;
      case "video":
        return <Upload className="w-5 h-5" />;
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Submit Evidence</DialogTitle>
          <DialogDescription>
            Complete your eco-task by providing evidence of your environmental action
          </DialogDescription>
        </DialogHeader>

        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">
                {getSubmissionTypeIcon(task.submissionType)}
                <span className="ml-1 capitalize">{task.submissionType} Required</span>
              </Badge>
              <Badge variant="secondary">
                <Clock className="w-4 h-4 mr-1" />
                Due: {new Date(task.deadline).toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {task.submissionType !== "text" && (
            <div className="space-y-3">
              <Label htmlFor="evidence">
                Upload {task.submissionType === "photo" ? "Photo" : "Video"} Evidence *
              </Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  id="evidence"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="evidence" className="cursor-pointer">
                  {previewUrl ? (
                    <div className="space-y-2">
                      {task.submissionType === "photo" ? (
                        <img 
                          src={previewUrl} 
                          alt="Evidence preview" 
                          className="max-h-32 mx-auto rounded-lg object-cover"
                        />
                      ) : (
                        <video 
                          src={previewUrl} 
                          className="max-h-32 mx-auto rounded-lg"
                          controls
                        />
                      )}
                      <p className="text-sm text-muted-foreground">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getSubmissionTypeIcon(task.submissionType)}
                      <p className="text-sm font-medium">
                        Click to upload {task.submissionType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag and drop or click to browse
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="note">Description (Optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe what you did, where you did it, or any challenges you faced..."
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/30 p-3 rounded-lg">
            <MapPin className="w-4 h-4" />
            <span>Location and timestamp will be automatically recorded</span>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Submit Evidence
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};