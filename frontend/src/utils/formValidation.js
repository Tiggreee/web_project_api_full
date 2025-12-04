export const validateField = (value, minLength, maxLength) => {
  if (!value.trim()) return "Por favor llena este campo.";
  if (value.length < minLength) 
    return `El texto debe tener al menos ${minLength} caracteres (actualmente tienes ${value.length}).`;
  if (value.length > maxLength) 
    return `El texto no debe exceder ${maxLength} caracteres (actualmente tienes ${value.length}).`;
  return "";
};

export const validateUrl = (value) => {
  if (!value.trim()) return "Por favor llena este campo.";
  try {
    new URL(value);
    return "";
  } catch {
    return "Por favor ingresa una URL válida.";
  }
};
