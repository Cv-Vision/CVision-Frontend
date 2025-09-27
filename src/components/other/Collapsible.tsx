import { FC, ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Collapsible: FC<CollapsibleProps> = ({ 
  title, 
  subtitle, 
  children, 
  defaultOpen = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer hover:bg-teal-50/50 transition-colors border-teal-100 border rounded-lg"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-teal-600">{title}</h3>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="mt-2 border-teal-100 border rounded-lg">
          <div className="p-4 space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collapsible;
