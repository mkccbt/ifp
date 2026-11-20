import { QuizQuestion, Semester, SubjectId } from '../../types';

export interface CompactQuestionSeed {
  p: string; // prompt
  c: string; // correct answer
  w: [string, string, string]; // 3 distractors
  e: string; // explanation
  v?: QuizQuestion['visual'];
}

export function buildTopicQuestions(
  subjectId: SubjectId,
  semester: Semester,
  topic: string,
  prefix: string,
  seeds: CompactQuestionSeed[]
): QuizQuestion[] {
  return seeds.map((seed, index) => {
    const id = `${prefix}-${index + 1}`;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) % 997;
    }
    const correctIndex = (hash % 4) as 0 | 1 | 2 | 3;
    const options: [string, string, string, string] = ['', '', '', ''];
    let dIdx = 0;
    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        options[i] = seed.c;
      } else {
        options[i] = seed.w[dIdx++];
      }
    }
    return {
      id,
      subjectId,
      semester,
      topic,
      prompt: seed.p,
      options,
      correctIndex,
      explanation: seed.e,
      ...(seed.v ? { visual: seed.v } : {}),
    };
  });
}
