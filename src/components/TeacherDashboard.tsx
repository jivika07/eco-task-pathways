import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard, EcoTask } from "./TaskCard";
import { TaskCreationForm } from "./TaskCreationForm";
import { TaskDetailsModal } from "./TaskDetailsModal";
import { SubmissionReviewModal } from "./SubmissionReviewModal";
import { Plus, BarChart3, Users, CheckSquare, AlertTriangle } from "lucide-react";

interface TeacherDashboardProps {
  tasks: EcoTask[];
  onTaskCreated: (task: EcoTask) => void;
  onTaskUpdate: (tasks: EcoTask[]) => void;
}

export const TeacherDashboard = ({ tasks, onTaskCreated, onTaskUpdate }: TeacherDashboardProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<EcoTask | null>(null);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState<EcoTask | null>(null);

  const stats = {
    totalTasks: tasks.length,
    activeTasks: tasks.filter(t => t.status === "pending").length,
    totalSubmissions: tasks.reduce((sum, t) => sum + (t.submissions || 0), 0),
    pendingReviews: tasks.filter(t => (t.submissions || 0) > 0).length
  };

  const handleTaskCreated = (task: EcoTask) => {
    onTaskCreated(task);
    setShowCreateForm(false);
  };

  const handleVerifySubmissions = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskForReview(task);
    }
  };

  const handleViewDetails = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskForDetails(task);
    }
  };

  const handleSubmissionReview = (taskId: string, action: "approve" | "reject", feedback?: string) => {
    // In a real app, this would update the submission status in the backend
    console.log("Review submission:", { taskId, action, feedback });
    setSelectedTaskForReview(null);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <TaskCreationForm
          onTaskCreated={handleTaskCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.totalSubmissions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.pendingReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-pixel text-foreground mb-2">Manage Eco-Tasks</h2>
          <p className="text-muted-foreground">Create, assign, and track environmental tasks for your students</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Task
        </Button>
      </div>

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl">🌱</div>
              <h3 className="text-lg font-semibold">No Tasks Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by creating your first eco-task to engage your students in environmental action
              </p>
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Task
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              userRole="teacher"
              onVerify={handleVerifySubmissions}
              onView={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TaskDetailsModal
        task={selectedTaskForDetails}
        isOpen={!!selectedTaskForDetails}
        onClose={() => setSelectedTaskForDetails(null)}
      />
      
      <SubmissionReviewModal
        task={selectedTaskForReview}
        isOpen={!!selectedTaskForReview}
        onClose={() => setSelectedTaskForReview(null)}
        onReview={handleSubmissionReview}
      />
    </div>
  );
};