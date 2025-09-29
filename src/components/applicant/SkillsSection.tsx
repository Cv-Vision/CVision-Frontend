import { FC, useState } from "react";
import { X } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

const SkillsSection: FC<SkillsSectionProps> = ({ skills, onSkillsChange }) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      onSkillsChange([...skills, skill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(newSkill);
    }
  };

  if (skills.length === 0 && !newSkill) {
    return null;
  }

  return (
    <div className="border-teal-100 border rounded-lg w-full mb-6">
      <div className="p-6">
        <h2 className="text-lg text-teal-600 font-semibold mb-4">Habilidades</h2>
        
        {/* Input para agregar nueva habilidad */}
        <div className="mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Agregar habilidad..."
            className="h-10 w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          <button
            type="button"
            onClick={() => addSkill(newSkill)}
            className="mt-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm font-medium"
          >
            Agregar
          </button>
        </div>

        {/* Lista de habilidades */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;
