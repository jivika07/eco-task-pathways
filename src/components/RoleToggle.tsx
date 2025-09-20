import { Button } from "@/components/ui/button";
import { Users, GraduationCap } from "lucide-react";

interface RoleToggleProps {
  currentRole: "teacher" | "student";
  onRoleChange: (role: "teacher" | "student") => void;
}

export const RoleToggle = ({ currentRole, onRoleChange }: RoleToggleProps) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
      <Button
        variant={currentRole === "teacher" ? "default" : "ghost"}
        size="sm"
        onClick={() => onRoleChange("teacher")}
        className="flex items-center gap-2 transition-all duration-200"
      >
        <GraduationCap className="w-4 h-4" />
        Teacher
      </Button>
      <Button
        variant={currentRole === "student" ? "default" : "ghost"}
        size="sm"
        onClick={() => onRoleChange("student")}
        className="flex items-center gap-2 transition-all duration-200"
      >
        <Users className="w-4 h-4" />
        Student
      </Button>
    </div>
  );
};