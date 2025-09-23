import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TaskCard, EcoTask } from "./TaskCard";
import { TaskDetailsModal } from "./TaskDetailsModal";
import { TaskSubmissionModal } from "./TaskSubmissionModal";
import { Trophy, Target, CheckCircle, Clock } from "lucide-react";

interface StudentDashboardProps {
  tasks: EcoTask[];
  onTaskUpdate: (tasks: EcoTask[]) => void;
}

export const StudentDashboard = ({ tasks, onTaskUpdate }: StudentDashboardProps) => {
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<EcoTask | null>(null);
  const [selectedTask, setSelectedTask] = useState<EcoTask | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Student progress calculation
  const completedTasks = tasks.filter(t => t.status === "verified").length;
  const totalPoints = tasks.filter(t => t.status === "verified").reduce((sum, t) => sum + t.points, 0);
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const handleSubmitTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowSubmissionModal(true);
    }
  };

  const handleViewDetails = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskForDetails(task);
    }
  };

  const handleSubmission = (taskId: string, submission: any) => {
    // Attach the new submission onto the task for teacher review
    const updatedTasks = tasks.map(task => {
      if (task.id !== taskId) return task;
      const existing = (task as any).submissionsList || [];
      const withStudent = { ...submission, studentName: "Student" };
      return { ...task, status: "submitted" as const, submissionsList: [withStudent, ...existing] } as any;
    });
    onTaskUpdate(updatedTasks);
    setShowSubmissionModal(false);
    setSelectedTask(null);
  };

  // Group tasks by status
  const pendingTasksList = tasks.filter(t => t.status === "pending");
  const submittedTasks = tasks.filter(t => t.status === "submitted");
  const verifiedTasks = tasks.filter(t => t.status === "verified");
  const rejectedTasks = tasks.filter(t => t.status === "rejected");

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eco-Points</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalPoints}</div>
            <p className="text-xs text-muted-foreground">Points earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks verified</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks to complete</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
        <CardHeader>
          <CardTitle className="text-xl">Your Environmental Journey</CardTitle>
          <CardDescription>
            Complete eco-tasks to earn points, make a positive impact, and help create a sustainable future! 🌍
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Pending Tasks */}
      {pendingTasksList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Available Tasks</h2>
            <Badge variant="secondary">{pendingTasksList.length} pending</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTasksList.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userRole="student"
                onSubmit={handleSubmitTask}
                onView={handleViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Submitted Tasks */}
      {submittedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Under Review</h2>
            <Badge variant="secondary">{submittedTasks.length} submitted</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submittedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userRole="student"
                onView={handleViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {verifiedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Completed Tasks</h2>
            <Badge className="bg-success text-success-foreground">{verifiedTasks.length} verified</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifiedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userRole="student"
                onView={handleViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl">🌱</div>
              <h3 className="text-lg font-semibold">No Tasks Available</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your teacher hasn't assigned any eco-tasks yet. Check back soon to start your environmental journey!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <TaskDetailsModal
        task={selectedTaskForDetails}
        isOpen={!!selectedTaskForDetails}
        onClose={() => setSelectedTaskForDetails(null)}
      />

      <TaskSubmissionModal
        task={selectedTask}
        isOpen={showSubmissionModal}
        onClose={() => {
          setShowSubmissionModal(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSubmission}
      />
    </div>
  );
};