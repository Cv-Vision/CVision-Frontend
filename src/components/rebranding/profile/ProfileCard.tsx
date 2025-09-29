import { useState, useEffect } from "react";
import { Pencil, Save, X, Camera } from "lucide-react";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  position: string;
  bio: string;
  avatarUrl?: string;
};

type ProfileCardProps = {
  profile: ProfileData;
  onSave: (data: ProfileData) => void;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(profile);

  // Sincronizar formData con el prop profile cuando cambie
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold">Mi Perfil</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4" />
            Editar Perfil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-purple-500 text-white rounded-lg px-3 py-1 hover:bg-purple-600"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Avatar + Info */}
      <div className="flex gap-6 items-start">
        <div className="flex flex-col items-center">
          <img
            src={formData.avatarUrl || "https://via.placeholder.com/120"}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover"
          />
          {isEditing && (
            <button className="mt-2 flex items-center gap-2 border rounded-lg px-3 py-1 hover:bg-gray-100 text-sm">
              <Camera className="w-4 h-4" />
              Cambiar Foto
            </button>
          )}
        </div>

        {/* Datos */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nombre Completo</label>
            {isEditing ? (
              <input
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            ) : (
              <p>{formData.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            {isEditing ? (
              <input
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                readOnly
                title="El email no se puede cambiar"
              />
            ) : (
              <p className="text-gray-500">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Teléfono
              <span className="text-xs text-orange-500 ml-1">(Próximamente)</span>
            </label>
            {isEditing ? (
              <input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                disabled
                title="Esta funcionalidad estará disponible próximamente"
              />
            ) : (
              <p className="text-gray-400">{formData.phone || 'No disponible'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Ubicación
              <span className="text-xs text-orange-500 ml-1">(Próximamente)</span>
            </label>
            {isEditing ? (
              <input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                disabled
                title="Esta funcionalidad estará disponible próximamente"
              />
            ) : (
              <p className="text-gray-400">{formData.location || 'No disponible'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Empresa Actual</label>
            {isEditing ? (
              <input
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            ) : (
              <p>{formData.company}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Posición Actual</label>
            {isEditing ? (
              <input
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              />
            ) : (
              <p>{formData.position}</p>
            )}
          </div>
        </div>
      </div>

      {/* Biografía */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-600">
          Biografía Profesional
          <span className="text-xs text-orange-500 ml-1">(Próximamente)</span>
        </label>
        {isEditing ? (
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 min-h-[100px] bg-gray-50"
            disabled
            title="Esta funcionalidad estará disponible próximamente"
          />
        ) : (
          <p className="text-gray-400">{formData.bio || 'No disponible'}</p>
        )}
      </div>
    </div>
  );
};
