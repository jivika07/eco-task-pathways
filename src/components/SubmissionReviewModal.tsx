import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Calendar, MapPin, Clock, FileText, Image, Video } from "lucide-react";
import { EcoTask } from "./TaskCard";

interface SubmissionReviewModalProps {
  task: EcoTask | null;
  isOpen: boolean;
  onClose: () => void;
  onReview: (taskId: string, action: "approve" | "reject", feedback?: string) => void;
}

// Mock submission data - in real app this would come from backend
const mockSubmissions = [
  {
    id: "1",
    studentName: "Alice Johnson",
    submittedAt: "2024-01-15T10:30:00Z",
    mediaUrl: "/api/placeholder/400/300",
    mediaType: "image",
    note: "I planted this oak tree in the local park with help from my family. It was amazing to see how many people stopped to ask what we were doing!",
    location: "Central Park, NY"
  },
  {
    id: "2", 
    studentName: "Bob Smith",
    submittedAt: "2024-01-14T14:20:00Z",
    mediaUrl: "/api/placeholder/400/300",
    mediaType: "image",
    note: "Chose a native maple tree for my neighborhood. Had to research which species work best in our climate zone.",
    location: "Brooklyn, NY"
  },
  {
    id: "3",
    studentName: "Carol Williams",
    submittedAt: "2024-01-13T09:15:00Z", 
    mediaUrl: "/api/placeholder/400/300",
    mediaType: "video",
    note: "Video shows the entire planting process from digging to watering. Really excited to watch it grow!",
    location: "Queens, NY"
  }
];

export const SubmissionReviewModal = ({ task, isOpen, onClose, onReview }: SubmissionReviewModalProps) => {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  if (!task) return null;

  const handleReview = (action: "approve" | "reject") => {
    if (!selectedSubmission) return;
    
    onReview(task.id, action, feedback);
    
    toast({
      title: action === "approve" ? "Submission Approved" : "Submission Rejected",
      description: `Student has been notified of your decision`,
      variant: action === "approve" ? "default" : "destructive"
    });
    
    setFeedback("");
    setSelectedSubmission(null);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Review Submissions</DialogTitle>
          <DialogDescription>
            Review and verify student submissions for: {task.title}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pending Submissions ({mockSubmissions.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockSubmissions.map((submission) => (
                <Card 
                  key={submission.id}
                  className={`cursor-pointer transition-all ${
                    selectedSubmission === submission.id 
                      ? "ring-2 ring-primary border-primary" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedSubmission(submission.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{submission.studentName}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getMediaIcon(submission.mediaType)}
                        {submission.mediaType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {submission.location}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {submission.note}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Submission Detail */}
          <div className="space-y-4">
            {selectedSubmission ? (
              <>
                {(() => {
                  const submission = mockSubmissions.find(s => s.id === selectedSubmission);
                  if (!submission) return null;
                  
                  return (
                    <>
                      <h3 className="text-lg font-semibold">Review: {submission.studentName}</h3>
                      
                      <Card>
                        <CardContent className="pt-6">
                          {submission.mediaType === "image" ? (
                            <img 
                              src={submission.mediaUrl} 
                              alt="Student submission"
                              className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                          ) : (
                            <video 
                              src={submission.mediaUrl}
                              controls
                              className="w-full h-64 rounded-lg mb-4"
                            />
                          )}
                          
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium">Student Notes</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {submission.note}
                              </p>
                            </div>
                            
                            <div className="flex gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(submission.submittedAt).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {submission.location}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-3">
                        <Label htmlFor="feedback">Feedback (Optional)</Label>
                        <Textarea
                          id="feedback"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Provide feedback to the student..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleReview("approve")}
                          className="flex-1 bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Submission
                        </Button>
                        <Button 
                          onClick={() => handleReview("reject")}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject & Request Resubmission
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Select a Submission</h3>
                  <p className="text-muted-foreground">
                    Choose a student submission from the left to review and verify their work
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};