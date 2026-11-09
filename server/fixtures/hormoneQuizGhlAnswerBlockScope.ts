/** Pure latest-scope inverse: no I/O, imports, production dependencies or test registration. */
const fragments = [{"old": "import { computeQuizScore, createTestQuizAnswers, quizAnswerTexts, validateQuizAnswers, type QuizAnswers, type QuizAnswerText } from \"./hormoneQuizModel\";", "new": "import { QUIZ_QUESTIONS, computeQuizScore, createTestQuizAnswers, quizAnswerTexts, validateQuizAnswers, type QuizAnswers, type QuizAnswerText } from \"./hormoneQuizModel\";"}, {"old": "export function buildGhlQuizPayload(record:StoredQuizRecord){return {first_name:record.first_name,last_name:record.last_name,email:record.email,phone:record.phone,tags:\"quiz-completed\",source:\"hormone-symptom-quiz\",submitted_at:record.submitted_at};}", "new": "export function formatGhlQuizAnswers(record:StoredQuizRecord):string{\n  const [year,month,day]=record.submitted_at.slice(0,10).split(\"-\");\n  const questions=QUIZ_QUESTIONS.filter(q=>q.id!==\"recognize\"&&!q.conditional);\n  const blocks=questions.map((q,i)=>{\n    const value=record.selections[q.id];\n    const answer=Array.isArray(value)?value.map(n=>q.opts[n]?.[0]).filter((label):label is string=>typeof label===\"string\").join(\", \")\n      :typeof value===\"number\"?String(q.opts[value]?.[0]??\"\"):\"\";\n    return `${i+1}. ${q.text}<br>Answer: ${answer||\"No answer\"}`;\n  });\n  const index=record.balance_index===null?\"No answer\":`${record.balance_index}/100`;\n  return [`Hormone Symptom Quiz – completed ${month}/${day}/${year}`,`Balance Index: ${index} (${record.score_band})`,\"\",blocks.join(\"<br><br>\")].join(\"<br>\");\n}\nexport function buildGhlQuizPayload(record:StoredQuizRecord){return {first_name:record.first_name,last_name:record.last_name,email:record.email,phone:record.phone,tags:\"quiz-completed\",source:\"hormone-symptom-quiz\",submitted_at:record.submitted_at,quiz_answers:formatGhlQuizAnswers(record)};}"}];
export function inverseHormoneQuizGhlAnswerBlock(path: string, source: string): string {
  path = String(path).replaceAll("\\", "/");
  const authorized = "server/hormoneQuizService.ts";
  if (path !== authorized && !path.endsWith("/" + authorized)) return source;
  const count = (text: string, fragment: string) => text.split(fragment).length - 1;
  const latest = fragments.map(f => count(source, f.new));
  if (latest.every(n => n === 0)) {
    if (fragments.every(f => count(source, f.old) === 1)) return source;
    throw Error("GHL quiz answer block scope mismatch");
  }
  if (!latest.every(n => n === 1)) throw Error("GHL quiz answer block scope mismatch");
  let result = source;
  for (const f of [...fragments].reverse()) result = result.replace(f.new, f.old);
  if (!fragments.every(f => count(result, f.old) === 1 && count(result, f.new) === 0)) throw Error("GHL quiz answer block scope mismatch");
  return result;
}
