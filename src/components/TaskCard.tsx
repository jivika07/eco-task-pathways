import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Trophy, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export interface EcoTask {
  id: string;
  title: string;
  description: string;
  taskType: "individual" | "group";
  submissionType: "photo" | "video" | "text" | "checklist";
  points: number;
  deadline: string;
  status: "pending" | "submitted" | "verified" | "rejected";
  submissions?: number;
  totalAssigned?: number;
}

interface TaskCardProps {
  task: EcoTask;
  userRole: "teacher" | "student";
  onSubmit?: (taskId: string) => void;
  onVerify?: (taskId: string) => void;
  onView?: (taskId: string) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "rejected":
      return <XCircle className="w-4 h-4 text-destructive" />;
    case "submitted":
      return <AlertCircle className="w-4 h-4 text-warning" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
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

export const TaskCard = ({ task, userRole, onSubmit, onVerify, onView }: TaskCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary animate-fade-in-up animate-gentle-float">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {task.title}
            </CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <Badge className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(task.deadline).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            {task.points} points
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {task.taskType}
          </div>
        </div>

        {userRole === "teacher" && task.submissions !== undefined && (
          <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="font-medium">
              {task.submissions}/{task.totalAssigned} submitted
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {userRole === "student" && (
          <>
            {task.status === "pending" && (
              <Button onClick={() => onSubmit?.(task.id)} className="flex-1">
                Submit Evidence
              </Button>
            )}
            <Button variant="outline" onClick={() => onView?.(task.id)}>
              View Details
            </Button>
          </>
        )}

        {userRole === "teacher" && (
          <>
            <Button variant="outline" onClick={() => onView?.(task.id)}>
              View Details
            </Button>
            {task.submissions && task.submissions > 0 && (
              <Button onClick={() => onVerify?.(task.id)}>
                Review Submissions
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};