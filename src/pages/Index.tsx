import { useState } from "react";
import { EcoTaskHeader } from "@/components/EcoTaskHeader";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { StudentDashboard } from "@/components/StudentDashboard";
import { EcoTask } from "@/components/TaskCard";

const Index = () => {
  const [currentRole, setCurrentRole] = useState<"teacher" | "student">("teacher");
  const [tasks, setTasks] = useState<EcoTask[]>([
    {
      id: "1",
      title: "Plant a Native Tree",
      description: "Plant a native tree species in your community and document its growth over time. Research which trees are native to your area and best suited for the climate.",
      taskType: "individual",
      submissionType: "photo",
      points: 25,
      deadline: "2025-10-15",
      status: "pending",
      submissions: 12,
      totalAssigned: 25
    },
    {
      id: "2", 
      title: "One Week Plastic-Free Challenge",
      description: "Avoid single-use plastics for an entire week. Document your alternatives and track the amount of plastic waste you prevented.",
      taskType: "individual",
      submissionType: "photo",
      points: 20,
      deadline: "2025-10-20",
      status: "submitted",
      submissions: 8,
      totalAssigned: 25
    },
    {
      id: "3",
      title: "Community Garden Project",
      description: "Work as a group to create or maintain a community garden. Plant vegetables or herbs that can be shared with the community.",
      taskType: "group",
      submissionType: "video",
      points: 35,
      deadline: "2025-11-01",
      status: "verified",
      submissions: 5,
      totalAssigned: 25
    }
  ]);

  const handleTaskCreated = (newTask: EcoTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdate = (updatedTasks: EcoTask[]) => {
    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <EcoTaskHeader 
          currentRole={currentRole} 
          onRoleChange={setCurrentRole}
        />
        
        {currentRole === "teacher" ? (
          <TeacherDashboard 
            tasks={tasks}
            onTaskCreated={handleTaskCreated}
            onTaskUpdate={handleTaskUpdate}
          />
        ) : (
          <StudentDashboard
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
