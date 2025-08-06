export const useCVValidation = () => {
  const isValidType = (type: string) => {
    return ['application/pdf', 'image/png', 'image/jpeg', 'application/zip'].includes(type);
  };

  const validateFile = (file: File): { valid: boolean; reason?: string } => {
    if (!isValidType(file.type)) {
      return { valid: false, reason: 'Tipo no permitido' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, reason: 'Tamaño > 5MB' };
    }
    return { valid: true };
  };

  return { validateFile };
};
