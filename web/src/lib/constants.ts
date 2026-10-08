// Constantes de negocio de la Academia de Idiomas San Pedro
// Ref: AcademiaSanPedro/01_Requirements/01.1_Business_Profile.md

export const IDIOMAS_OFERTADOS = [
  "Inglés",
  "Francés",
  "Alemán",
  "Italiano",
] as const;

export type IdiomaOfertado = typeof IDIOMAS_OFERTADOS[number];

export const NIVELES_CAMBRIDGE = [
  "Cambridge B1 (PET)",
  "Cambridge B2 (FIRST)",
  "Cambridge C1 (ADVANCED)",
  "Cambridge C2 (PROFICIENCY)",
] as const;

export type NivelCambridge = typeof NIVELES_CAMBRIDGE[number];

export const TIPOS_CURSO = [
  "Cursos extensivos (9 meses)",
  "Cursos intensivos (3 meses)",
  "Preparación de exámenes oficiales Cambridge",
  "Clases individuales / one-to-one",
  "Clases de conversación",
  "Preparación de entrevistas de trabajo",
  "Formación específica de inglés profesional",
  "Playschool (desde los 4 años)",
  "Grupos específicos (mayores de 65 años)",
] as const;

export type TipoCurso = typeof TIPOS_CURSO[number];
