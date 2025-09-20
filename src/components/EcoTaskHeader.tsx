import { Leaf } from "lucide-react";
import { RoleToggle } from "./RoleToggle";
import heroImage from "@/assets/eco-hero.jpg";

interface EcoTaskHeaderProps {
  currentRole: "teacher" | "student";
  onRoleChange: (role: "teacher" | "student") => void;
}

export const EcoTaskHeader = ({ currentRole, onRoleChange }: EcoTaskHeaderProps) => {
  return (
    <div className="relative">
      {/* Hero Background */}
      <div 
        className="h-64 bg-cover bg-center rounded-xl mb-8 relative overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/60" />
        <div className="relative h-full flex flex-col justify-center items-center text-center p-6">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-12 h-12 text-white drop-shadow-lg" />
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              EcoTask Platform
            </h1>
          </div>
          <p className="text-xl text-white/90 drop-shadow-md max-w-2xl">
            Empowering students and teachers to create positive environmental impact through 
            collaborative eco-friendly tasks and real-world action
          </p>
        </div>
      </div>

      {/* Role Toggle */}
      <div className="flex justify-center mb-6">
        <RoleToggle currentRole={currentRole} onRoleChange={onRoleChange} />
      </div>
    </div>
  );
};