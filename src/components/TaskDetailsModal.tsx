import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Trophy, Users, Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";
import { EcoTask } from "./TaskCard";

interface TaskDetailsModalProps {
  task: EcoTask | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
      return <CheckCircle className="w-5 h-5 text-success" />;
    case "rejected":
      return <XCircle className="w-5 h-5 text-destructive" />;
    case "submitted":
      return <AlertCircle className="w-5 h-5 text-warning" />;
    default:
      return <Clock className="w-5 h-5 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-success text-success-foreground";
    case "rejected":
      return "bg-destructive text-destructive-foreground";
    case "submitted":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

export const TaskDetailsModal = ({ task, isOpen, onClose }: TaskDetailsModalProps) => {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Task Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this eco-task
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Header */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-pixel text-primary">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{task.points}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">Deadline</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">Task Type</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {task.taskType}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="font-semibold">Submission</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {task.submissionType}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground">Description & Instructions</h4>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">{task.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Submission Progress (for teachers) */}
          {task.submissions !== undefined && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">Submission Progress</h4>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Students who submitted</span>
                      <span className="font-bold">{task.submissions}/{task.totalAssigned}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.round((task.submissions / (task.totalAssigned || 1)) * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.round((task.submissions / (task.totalAssigned || 1)) * 100)}% completion rate
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Tips */}
          <Card className="bg-accent/30">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Important Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Take clear photos or videos as evidence</li>
                <li>• Include location and timestamp information</li>
                <li>• Add detailed notes about your experience</li>
                <li>• Make sure your submission clearly shows the completed task</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};