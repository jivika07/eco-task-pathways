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
    },
    {
      id: "4",
      title: "Solar Energy Experiment",
      description: "Build a simple solar-powered device using recycled materials. Document the construction process and test its effectiveness.",
      taskType: "individual",
      submissionType: "video",
      points: 30,
      deadline: "2025-10-25",
      status: "pending",
      submissions: 3,
      totalAssigned: 25
    },
    {
      id: "5",
      title: "Beach/River Cleanup Drive",
      description: "Organize or participate in a cleanup drive at a local beach, river, or park. Collect and sort trash, document the impact.",
      taskType: "group",
      submissionType: "photo",
      points: 40,
      deadline: "2025-11-10",
      status: "pending",
      submissions: 15,
      totalAssigned: 25
    },
    {
      id: "6",
      title: "Upcycling Art Project",
      description: "Create artwork or useful items from recycled materials. Show the before and after transformation.",
      taskType: "individual",
      submissionType: "photo",
      points: 15,
      deadline: "2025-10-30",
      status: "submitted",
      submissions: 7,
      totalAssigned: 25
    },
    {
      id: "7",
      title: "Water Conservation Challenge",
      description: "Implement water-saving techniques at home for one month. Track and document your water usage reduction.",
      taskType: "individual",
      submissionType: "text",
      points: 25,
      deadline: "2025-11-15",
      status: "pending",
      submissions: 6,
      totalAssigned: 25
    },
    {
      id: "8",
      title: "Green Transport Week",
      description: "Use only eco-friendly transportation (walking, cycling, public transport) for one week. Log your journey and carbon savings.",
      taskType: "individual",
      submissionType: "text",
      points: 20,
      deadline: "2025-10-28",
      status: "verified",
      submissions: 11,
      totalAssigned: 25
    },
    {
      id: "9",
      title: "Pollinator Garden Creation",
      description: "Design and plant a garden specifically to attract bees, butterflies, and other pollinators. Document the wildlife that visits.",
      taskType: "group",
      submissionType: "photo",
      points: 45,
      deadline: "2025-11-20",
      status: "pending",
      submissions: 2,
      totalAssigned: 25
    },
    {
      id: "10",
      title: "Energy Audit & Efficiency Plan",
      description: "Conduct an energy audit of your home or school. Create and implement an energy efficiency improvement plan.",
      taskType: "individual",
      submissionType: "text",
      points: 35,
      deadline: "2025-11-05",
      status: "pending",
      submissions: 4,
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
    <div className="min-h-screen bg-transparent">
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
