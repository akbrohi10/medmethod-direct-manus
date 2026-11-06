const fragments=[{"old": "    </style>", "new": "      /* Report closing highlight — approved panel-only styling */\n      .report .closing {\n        background: var(--rasp-soft);\n        border-top: 4px solid var(--plum);\n        margin-top: 48px;\n      }\n      .report .closing .report-utilities {\n        border-top: 1px solid var(--line);\n        margin-top: 24px;\n        padding-top: 8px;\n      }\n    </style>"}, {"old": "        + \"<p>Complete your medical intake, then receive a text to start chatting with her. Your first text visit includes 7 days of follow-up messaging, free.</p>\"", "new": "        + \"<p>Complete your medical intake, then receive a text to start chatting with her. Your first text visit includes <strong>7 days of follow-up messaging</strong>, free.</p>\""}, {"old": "        + '<button class=\"ghostbtn\" type=\"button\" id=\"dlBtn\">Download a copy of my report</button>'\n        + '<button class=\"ghostbtn\" type=\"button\" id=\"againBtn\">Take the check again</button></div>';", "new": "        + '<div class=\"report-utilities\">'\n        + '<button class=\"ghostbtn\" type=\"button\" id=\"dlBtn\">Download a copy of my report</button>'\n        + '<button class=\"ghostbtn\" type=\"button\" id=\"againBtn\">Take the check again</button></div></div>';"}];
export function inverseHormoneQuizPanel(path:string,source:string):string{
 path=String(path).replaceAll("\\","/");
 if(!["client/public/hormone-symptom-quiz.html","dist/public/hormone-symptom-quiz.html"].some(p=>path.endsWith(p)))return source;
 const newCounts=fragments.map(f=>source.split(f.new).length-1);
 if(newCounts.every(n=>n===0)){
  if(fragments.every(f=>source.split(f.old).length-1===1))return source;
  throw Error('Quiz panel scope mismatch');
 }
 if(!newCounts.every(n=>n===1))throw Error('Quiz panel scope mismatch');
 let result=source;
 for(const f of [...fragments].reverse())result=result.replace(f.new,f.old);
 if(!fragments.every(f=>result.split(f.old).length-1===1))throw Error('Quiz panel scope mismatch');
 return result;
}
