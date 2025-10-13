import { ArrowLeft } from "lucide-react";

interface JobListingHeaderProps {
  onBackClick: () => void;
}

export const JobListingHeader = ({ onBackClick }: JobListingHeaderProps) => {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            className="flex items-center px-4 py-2 border border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent rounded-lg transition-colors"
            onClick={onBackClick}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver 
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Encuentra tu próximo trabajo</span>
            <span className="text-gray-500">|</span>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CVision</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
