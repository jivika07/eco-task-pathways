import { Leaf } from "lucide-react";
import { RoleToggle } from "./RoleToggle";
import pixelLandscape from "@/assets/pixel-landscape.jpg";

interface EcoTaskHeaderProps {
  currentRole: "teacher" | "student";
  onRoleChange: (role: "teacher" | "student") => void;
}

export const EcoTaskHeader = ({ currentRole, onRoleChange }: EcoTaskHeaderProps) => {
  return (
    <div className="relative">
      {/* Hero Background */}
      <div 
        className="h-80 bg-cover bg-center rounded-xl mb-8 relative overflow-hidden border-4 border-primary/20"
        style={{ 
          backgroundImage: `url(${pixelLandscape})`,
          imageRendering: 'pixelated'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary-dark/50" />
        <div className="relative h-full flex flex-col justify-center items-center text-center p-6">
          <div className="flex items-center gap-4 mb-6">
            <Leaf className="w-16 h-16 text-white drop-shadow-lg animate-pulse" />
            <h1 className="text-5xl font-pixel text-white drop-shadow-lg tracking-wider">
              Green Actions
            </h1>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border-2 border-white/20">
            <p className="text-lg font-pixel text-white/95 drop-shadow-md max-w-3xl leading-relaxed">
              Level Up Your Environmental Impact!
            </p>
            <p className="text-sm text-white/80 mt-2 max-w-2xl">
              Complete eco-quests, earn points, and save the planet one task at a time
            </p>
          </div>
        </div>
      </div>

      {/* Role Toggle */}
      <div className="flex justify-center mb-6">
        <RoleToggle currentRole={currentRole} onRoleChange={onRoleChange} />
      </div>
    </div>
  );
};