import { FC } from "react";
import { Briefcase } from "lucide-react";

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
        <Briefcase className="w-6 h-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-gray-800">CVision</span>
    </div>
  );
};

export default Logo;
