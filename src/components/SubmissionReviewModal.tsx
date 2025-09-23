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
import { computeTextRelevance, scoreToLabel } from "@/lib/utils";

interface SubmissionReviewModalProps {
  task: EcoTask | null;
  isOpen: boolean;
  onClose: () => void;
  onReview: (taskId: string, action: "approve" | "reject", feedback?: string) => void;
  submissions?: any[];
}

// Deprecated mock submissions removed; real submissions are passed in via props

export const SubmissionReviewModal = ({ task, isOpen, onClose, onReview, submissions = [] }: SubmissionReviewModalProps) => {
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
            <h3 className="text-lg font-semibold">Pending Submissions ({submissions.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {submissions.map((submission) => (
                <Card 
                  key={submission.id || submission.timestamp}
                  className={`cursor-pointer transition-all ${
                    selectedSubmission === (submission.id || submission.timestamp)
                      ? "ring-2 ring-primary border-primary" 
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedSubmission(submission.id || submission.timestamp)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{submission.studentName || "Student"}</CardTitle>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getMediaIcon(submission.mediaType || (submission.file?.type?.startsWith("image") ? "image" : (submission.file?.type?.startsWith("video") ? "video" : "file")))}
                        {submission.mediaType || (submission.file?.type?.startsWith("image") ? "image" : (submission.file?.type?.startsWith("video") ? "video" : "file"))}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(submission.submittedAt || submission.timestamp).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {submission.location || "Unknown"}
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
                  const submission = submissions.find(s => (s.id || s.timestamp) === selectedSubmission);
                  if (!submission) return null;
                  const taskText = `${task.title} ${task.description ?? ""}`;
                  const { score, reasons } = computeTextRelevance(taskText, submission.note || "");
                  const relLabel = scoreToLabel(score);
                  
                  return (
                    <>
                      <h3 className="text-lg font-semibold">Review: {submission.studentName || "Student"}</h3>
                      
                      <Card>
                        <CardContent className="pt-6">
                          {(submission.mediaType || (submission.file?.type?.startsWith("image") ? "image" : "")) === "image" ? (
                            <img 
                              src={submission.mediaUrl || (typeof submission.file === 'string' ? submission.file : undefined) || (submission.file ? URL.createObjectURL(submission.file) : undefined)} 
                              alt="Student submission"
                              className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                          ) : (
                            <video 
                              src={submission.mediaUrl || (typeof submission.file === 'string' ? submission.file : undefined)}
                              controls
                              className="w-full h-64 rounded-lg mb-4"
                            />
                          )}
                          
                          <div className="space-y-3">
                            <div className={`text-sm ${relLabel === "high" ? "text-green-600" : relLabel === "medium" ? "text-amber-600" : "text-red-600"}`}>
                              Relevance: <span className="font-medium capitalize">{relLabel}</span> ({Math.round(score * 100)}%)
                              {reasons?.[0] ? <span className="ml-2 text-muted-foreground">• {reasons[0]}</span> : null}
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Student Notes</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {submission.note}
                              </p>
                            </div>
                            
                            <div className="flex gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(submission.submittedAt || submission.timestamp).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {submission.location || "Unknown"}
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