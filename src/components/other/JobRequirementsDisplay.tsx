import React, { useState, useEffect } from 'react';

interface JobRequirementsDisplayProps {
  job: {
    additional_requirements?: string;
  };
  onUpdate?: (updates: any) => void;
  canEdit?: boolean;
}

const JobRequirementsDisplay: React.FC<JobRequirementsDisplayProps> = ({ job, onUpdate, canEdit = false }) => {
  const [formData, setFormData] = useState({
    additionalRequirements: job.additional_requirements || ''
  });

  useEffect(() => {
    setFormData({
      additionalRequirements: job.additional_requirements || ''
    });
  }, [job]);



  return (
    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
      {/* Additional Requirements */}
      <div className="mt-2">
          <textarea
            value={formData.additionalRequirements}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))
              if (onUpdate) {
                onUpdate({ additional_requirements: e.target.value })
              }
            }}
            className="w-full text-xs border-2 border-blue-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-blue-300 resize-none"
            rows={3}
            disabled={!canEdit}
            placeholder="Pídele al sistema qué quieres para analizar"
          />
        </div>
    </div>
  );
}

export default JobRequirementsDisplay;