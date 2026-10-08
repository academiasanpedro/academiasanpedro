// Modelo del test de nivel almacenado en global_test.test_data (fila id = 1)
// Ref: AcademiaSanPedro/05_Database.md

export interface LevelTestQuestion {
  q: string;
  options: string[];
  answer: number;
}

/** Pregunta sin la respuesta correcta: lo único que llega al navegador del alumno. */
export interface PublicQuestion {
  q: string;
  options: string[];
}

export type LevelTestData = Record<string, LevelTestQuestion[]>;

function isQuestion(value: unknown): value is LevelTestQuestion {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LevelTestQuestion>;
  return (
    typeof candidate.q === "string" &&
    Array.isArray(candidate.options) &&
    candidate.options.every((option) => typeof option === "string") &&
    typeof candidate.answer === "number"
  );
}

/** Normaliza el JSON de BD (incluido el formato antiguo: array = Inglés). */
export function parseTestData(raw: unknown): LevelTestData {
  if (Array.isArray(raw)) return { "Inglés": raw.filter(isQuestion) };
  if (!raw || typeof raw !== "object") return {};

  const data: LevelTestData = {};
  for (const [language, questions] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(questions)) data[language] = questions.filter(isQuestion);
  }
  return data;
}

export function toPublicQuestions(questions: LevelTestQuestion[]): PublicQuestion[] {
  return questions.map(({ q, options }) => ({ q, options }));
}

export function gradeAnswers(questions: LevelTestQuestion[], answers: number[]) {
  return questions.reduce(
    (score, question, index) => (answers[index] === question.answer ? score + 1 : score),
    0
  );
}
