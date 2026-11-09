/** Pure latest-scope inverse: no I/O, imports, production dependencies or test registration. */
const files = {"server/hormoneQuizPrivateReport.ts": [{"old": "export function quizReportOrigin(host:string){\n  const https=`https://${host.toLowerCase()}`;\n  if(SAFE_ORIGINS.has(https))return https;\n  if(process.env.NODE_ENV!==\"production\"&&/^(localhost|127\\.0\\.0\\.1)(:\\d{1,5})?$/.test(host))return \"https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer\";\n  throw new Error(\"Quiz origin unavailable.\");\n}", "new": "type QuizOriginHeaders={origin?:string|string[];\"x-forwarded-host\"?:string|string[];referer?:string|string[]};\nfunction trustedQuizOrigin(value:unknown,hostOnly=false):string|null{\n  if(typeof value!==\"string\"||!value||value.length>2048||/[\\u0000-\\u0020\\u007f,\\\\]/.test(value))return null;\n  try{\n    const parsed=new URL(hostOnly?`https://${value}`:value);\n    if(parsed.protocol!==\"https:\"||parsed.username||parsed.password||!SAFE_ORIGINS.has(parsed.origin))return null;\n    if(hostOnly&&(parsed.pathname!==\"/\"||parsed.search||parsed.hash))return null;\n    return parsed.origin;\n  }catch{return null;}\n}\nexport function quizReportOrigin(host:string,headers:QuizOriginHeaders={}){\n  // Browser Origin survives reverse proxies whose upstream Host is internal.\n  // Never trust an arbitrary forwarded host or manufacture a public PDF origin.\n  if(headers.origin!==undefined){\n    if(process.env.NODE_ENV!==\"production\"&&typeof headers.origin===\"string\"&&/^https?:\\/\\/(localhost|127\\.0\\.0\\.1)(:\\d{1,5})?$/.test(headers.origin)){\n      try{if(new URL(headers.origin).host===host)return \"https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer\";}catch{/* Fall through to strict validation. */}\n    }\n    const origin=trustedQuizOrigin(headers.origin);\n    if(!origin||typeof headers.origin!==\"string\"||new URL(headers.origin).origin!==headers.origin)throw new Error(\"Quiz origin unavailable.\");\n    return origin;\n  }\n  const direct=trustedQuizOrigin(host,true);if(direct)return direct;\n  const forwarded=trustedQuizOrigin(headers[\"x-forwarded-host\"],true);if(forwarded)return forwarded;\n  const referrer=trustedQuizOrigin(headers.referer);if(referrer)return referrer;\n  if(process.env.NODE_ENV!==\"production\"&&/^(localhost|127\\.0\\.0\\.1)(:\\d{1,5})?$/.test(host))return \"https://3000-i96796e94ozetw9qpb6zg-37388edb.us1.manus.computer\";\n  throw new Error(\"Quiz origin unavailable.\");\n}"}], "server/routers/hormoneQuiz.ts": [{"old": "quizReportOrigin(ctx.req.headers.host??\"\")", "new": "quizReportOrigin(ctx.req.headers.host??\"\",ctx.req.headers)", "count": 2}]};
export function inverseHormoneQuizSubmissionOrigin(path: string, source: string): string {
  path = String(path).replaceAll("\\", "/");
  const authorized = Object.keys(files).find(p => path === p || path.endsWith("/" + p)) as keyof typeof files | undefined;
  if (!authorized) return source;
  const fragments = files[authorized];
  const count = (text: string, fragment: string) => text.split(fragment).length - 1;
  const required = (f: typeof fragments[number]) => "count" in f ? f.count : 1;
  const latest = fragments.map(f => count(source, f.new));
  if (latest.every(n => n === 0)) {
    if (fragments.every(f => count(source, f.old) === required(f))) return source;
    throw Error("Quiz submission origin scope mismatch");
  }
  if (!fragments.every((f, i) => latest[i] === required(f) && count(source, f.old) === 0)) throw Error("Quiz submission origin scope mismatch");
  let result = source;
  for (const f of [...fragments].reverse()) result = result.split(f.new).join(f.old);
  if (!fragments.every(f => count(result, f.old) === required(f) && count(result, f.new) === 0)) throw Error("Quiz submission origin scope mismatch");
  return result;
}
