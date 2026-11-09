/** Frozen source definitions from quiz checkpoint 6fdc2970. Client quiz remains unchanged. */
export type QuizSelection = number | number[];
export type QuizAnswers = Record<string, QuizSelection>;
export type QuizQuestion = { id: string; sec: string; text: string; multi?: boolean; conditional?: boolean; opts: (string | number | null)[][] };
export type QuizAnswerText = { id: string; section: string; question: string; answer: string };
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    "id": "recognize",
    "sec": "Quick check",
    "text": "Which of these have you noticed?",
    "multi": true,
    "opts": [
      [
        "Hot flashes"
      ],
      [
        "Night sweats"
      ],
      [
        "Waking up around 3 a.m."
      ],
      [
        "Weight gain — especially at the waist"
      ],
      [
        "Anxiety that wasn't there before"
      ],
      [
        "Brain fog or lost words"
      ],
      [
        "Mood swings"
      ],
      [
        "Irritability"
      ],
      [
        "Exhaustion, even after a full night's sleep"
      ],
      [
        "Joint aches or stiffness"
      ],
      [
        "Trouble falling asleep"
      ],
      [
        "Cravings for sugar or snacks"
      ],
      [
        "None of these"
      ]
    ]
  },
  {
    "id": "age",
    "sec": "About you",
    "text": "How old are you?",
    "opts": [
      [
        "Under 40"
      ],
      [
        "40–44"
      ],
      [
        "45–49"
      ],
      [
        "50–54"
      ],
      [
        "55–59"
      ],
      [
        "60 or older"
      ]
    ]
  },
  {
    "id": "cycle",
    "sec": "About you",
    "text": "Where are you in the cycle picture?",
    "opts": [
      [
        "My periods are still regular"
      ],
      [
        "They're skipping or changing"
      ],
      [
        "No period for 12+ months"
      ],
      [
        "I've had a hysterectomy, or I'm not sure"
      ]
    ]
  },
  {
    "id": "wakeNights",
    "sec": "Sleep",
    "text": "How many nights a week do you wake up in the middle of the night?",
    "opts": [
      [
        "I sleep through",
        0
      ],
      [
        "1–2 nights",
        1
      ],
      [
        "3–4 nights",
        2
      ],
      [
        "5 or more nights",
        3
      ]
    ]
  },
  {
    "id": "wakeTime",
    "sec": "Sleep",
    "text": "When you wake up, what time is it usually?",
    "opts": [
      [
        "Before 1 a.m.",
        1
      ],
      [
        "Around 2–3 a.m.",
        3
      ],
      [
        "Around 4–5 a.m.",
        2
      ],
      [
        "I don't wake up",
        0
      ]
    ]
  },
  {
    "id": "wakeCause",
    "sec": "Sleep",
    "text": "What wakes you most often?",
    "opts": [
      [
        "I'm too hot or sweating",
        3
      ],
      [
        "My mind starts racing",
        2
      ],
      [
        "I need the bathroom",
        1
      ],
      [
        "Nothing — I just wake up",
        2
      ],
      [
        "I sleep through",
        0
      ]
    ]
  },
  {
    "id": "backAsleep",
    "sec": "Sleep",
    "text": "Once you're awake, how long until you're back asleep?",
    "opts": [
      [
        "Under 15 minutes",
        0
      ],
      [
        "15–30 minutes",
        1
      ],
      [
        "30–60 minutes",
        2
      ],
      [
        "Over an hour — sometimes I'm just up",
        3
      ],
      [
        "I don't wake up",
        0
      ]
    ]
  },
  {
    "id": "desire",
    "sec": "Intimacy & libido",
    "text": "Compared to two years ago, your libido — wanting sex and physical closeness — is…",
    "opts": [
      [
        "About the same or higher",
        0
      ],
      [
        "A little lower",
        1
      ],
      [
        "Much lower",
        3
      ],
      [
        "Prefer to say less",
        null,
        "skip"
      ]
    ]
  },
  {
    "id": "arousal",
    "sec": "Intimacy & libido",
    "text": "Once things start, how long does it take to feel fully aroused?",
    "opts": [
      [
        "A few minutes, like always",
        0
      ],
      [
        "About 10 minutes",
        1
      ],
      [
        "15–20 minutes",
        2
      ],
      [
        "Much longer than it used to",
        3
      ],
      [
        "Prefer to say less",
        null,
        "skip"
      ]
    ]
  },
  {
    "id": "orgasm",
    "sec": "Intimacy & libido",
    "text": "How long does it usually take to reach orgasm?",
    "opts": [
      [
        "A few minutes",
        0
      ],
      [
        "About 10 minutes",
        1
      ],
      [
        "15–20 minutes",
        2
      ],
      [
        "Much longer than it used to",
        3
      ],
      [
        "I usually don't get there",
        3
      ],
      [
        "Prefer to say less",
        null,
        "skip"
      ]
    ]
  },
  {
    "id": "orgasmChange",
    "sec": "Intimacy & libido",
    "text": "And compared to two years ago, how has reaching orgasm itself changed?",
    "opts": [
      [
        "About the same as two years ago",
        0
      ],
      [
        "A little harder to reach, or a little less intense",
        1
      ],
      [
        "Noticeably harder to reach, or weaker",
        2
      ],
      [
        "Much harder — or it just doesn't happen anymore",
        3
      ],
      [
        "Prefer to say less",
        null,
        "skip"
      ]
    ]
  },
  {
    "id": "dryness",
    "sec": "Intimacy & libido",
    "text": "Dryness or discomfort during intimacy?",
    "opts": [
      [
        "Never",
        0
      ],
      [
        "Sometimes",
        1
      ],
      [
        "Often",
        2
      ],
      [
        "It's the main reason I avoid intimacy",
        3
      ],
      [
        "Prefer to say less",
        null,
        "skip"
      ]
    ]
  },
  {
    "id": "wantFreq",
    "sec": "Intimacy & libido",
    "text": "How often do you find yourself wanting intimacy these days?",
    "opts": [
      [
        "A few times a week",
        0
      ],
      [
        "About once a week",
        1
      ],
      [
        "A few times a month",
        2
      ],
      [
        "Rarely — the want just isn't there",
        3
      ],
      [
        "Prefer to say less",
        null,
        "skip"
      ]
    ]
  },
  {
    "id": "weird",
    "sec": "The unusual ones",
    "text": "Tap any of these you've noticed lately.",
    "multi": true,
    "opts": [
      [
        "Itchy ears"
      ],
      [
        "A burning tongue or mouth"
      ],
      [
        "Skin that feels like it's crawling"
      ],
      [
        "Smells that aren't there"
      ],
      [
        "A fluttering heart while resting"
      ],
      [
        "New ringing in the ears"
      ],
      [
        "Brief electric-shock feelings"
      ],
      [
        "Dizziness"
      ],
      [
        "New or worsening allergies"
      ],
      [
        "Changed body odor"
      ],
      [
        "Bloating or digestive changes"
      ],
      [
        "Headaches or migraines (new or worse)"
      ],
      [
        "None of these"
      ]
    ]
  },
  {
    "id": "weirdWorst",
    "sec": "The unusual ones",
    "text": "Which one of those bothers you most?",
    "conditional": true,
    "opts": []
  },
  {
    "id": "flashes",
    "sec": "Temperature & flashes",
    "text": "How many hot flashes or sudden waves of heat do you get in a day?",
    "opts": [
      [
        "None",
        0
      ],
      [
        "1–2",
        1
      ],
      [
        "3–5",
        2
      ],
      [
        "6 or more",
        3
      ]
    ]
  },
  {
    "id": "sweats",
    "sec": "Temperature & flashes",
    "text": "How many nights a week do night sweats wake you or soak your sleep clothes?",
    "opts": [
      [
        "None",
        0
      ],
      [
        "1–2 nights",
        1
      ],
      [
        "3–4 nights",
        2
      ],
      [
        "5 or more nights",
        3
      ]
    ]
  },
  {
    "id": "words",
    "sec": "Brain & mood",
    "text": "Mid-sentence, the word just isn't there. How often does that happen?",
    "opts": [
      [
        "Rarely",
        0
      ],
      [
        "A few times a week",
        1
      ],
      [
        "Every day",
        2
      ],
      [
        "Many times a day",
        3
      ]
    ]
  },
  {
    "id": "fog",
    "sec": "Brain & mood",
    "text": "Compared to two years ago, your mental sharpness feels…",
    "opts": [
      [
        "Just as sharp",
        0
      ],
      [
        "A little slower",
        1
      ],
      [
        "Noticeably foggier",
        2
      ],
      [
        "Much foggier — it's hard to think",
        3
      ]
    ]
  },
  {
    "id": "anxietyLevel",
    "sec": "Brain & mood",
    "text": "How anxious do you feel day to day, compared to two years ago?",
    "opts": [
      [
        "About the same",
        0
      ],
      [
        "A little more anxious",
        1
      ],
      [
        "Noticeably more anxious",
        2
      ],
      [
        "Much more anxious — it's there most days",
        3
      ]
    ]
  },
  {
    "id": "anxiety",
    "sec": "Brain & mood",
    "text": "A wave of worry that arrives out of nowhere — how often?",
    "opts": [
      [
        "Never",
        0
      ],
      [
        "Sometimes",
        1
      ],
      [
        "Often",
        2
      ],
      [
        "Most days",
        3
      ]
    ]
  },
  {
    "id": "swings",
    "sec": "Brain & mood",
    "text": "How often do your moods swing — fine one moment, then tearful, snappy, or overwhelmed the next?",
    "opts": [
      [
        "Rarely",
        0
      ],
      [
        "Sometimes",
        1
      ],
      [
        "Often",
        2
      ],
      [
        "Most days",
        3
      ]
    ]
  },
  {
    "id": "weightChange",
    "sec": "Body & metabolism",
    "text": "How has your weight changed in the last two years?",
    "opts": [
      [
        "I lost weight",
        0
      ],
      [
        "It stayed about the same",
        0
      ],
      [
        "I gained about 5 lb",
        1
      ],
      [
        "I gained about 10 lb",
        2
      ],
      [
        "I gained 15 lb or more",
        3
      ]
    ]
  },
  {
    "id": "weightWhere",
    "sec": "Body & metabolism",
    "text": "Where is the weight going?",
    "opts": [
      [
        "Mostly my belly and waist",
        3
      ],
      [
        "Hips and thighs",
        1
      ],
      [
        "All over",
        1
      ],
      [
        "No real change",
        0
      ]
    ]
  },
  {
    "id": "triedToLose",
    "sec": "Body & metabolism",
    "text": "In the last two years, what happened when you tried to lose it?",
    "opts": [
      [
        "I haven't tried to lose it",
        0
      ],
      [
        "I tried briefly — I didn't really stick with it",
        1
      ],
      [
        "I made a real effort — it came off slowly, then stalled",
        2
      ],
      [
        "I made a real effort — and it barely moved, or came right back",
        3
      ]
    ]
  },
  {
    "id": "recovery",
    "sec": "Body & metabolism",
    "text": "After a workout, how long until you feel recovered?",
    "opts": [
      [
        "Same as always",
        0
      ],
      [
        "About a day",
        1
      ],
      [
        "Two days",
        2
      ],
      [
        "It wipes me out, and I dread the next one",
        3
      ],
      [
        "I don't work out",
        2
      ]
    ]
  },
  {
    "id": "activeDays",
    "sec": "Body & metabolism",
    "text": "How many days a week are you active for 30 minutes or more?",
    "opts": [
      [
        "4 or more days",
        0
      ],
      [
        "2–3 days",
        1
      ],
      [
        "1 day",
        2
      ],
      [
        "Rarely or never",
        3
      ]
    ]
  },
  {
    "id": "afternoon",
    "sec": "Body & metabolism",
    "text": "Compared to two years ago, your energy by mid-afternoon is…",
    "opts": [
      [
        "About the same",
        0
      ],
      [
        "A little lower",
        1
      ],
      [
        "Much lower — I hit a wall",
        2
      ],
      [
        "I'm running on empty",
        3
      ]
    ]
  },
  {
    "id": "cravings",
    "sec": "Body & metabolism",
    "text": "Cravings — for sugar, salt, or an evening snack — how strong are they lately?",
    "opts": [
      [
        "No different than before",
        0
      ],
      [
        "A bit stronger",
        1
      ],
      [
        "Much stronger",
        2
      ],
      [
        "Hard to resist most days",
        3
      ]
    ]
  },
  {
    "id": "joints",
    "sec": "Body & metabolism",
    "text": "New joint aches or stiffness?",
    "opts": [
      [
        "None",
        0
      ],
      [
        "Mild",
        1
      ],
      [
        "Noticeable most days",
        2
      ],
      [
        "They limit what I do",
        3
      ]
    ]
  },
  {
    "id": "bladder",
    "sec": "Body & metabolism",
    "text": "Bladder changes — leaking a little, or needing to go more often?",
    "opts": [
      [
        "No change",
        0
      ],
      [
        "A leak now and then — coughing, laughing, jumping",
        1
      ],
      [
        "Regular leaks, or urgency that plans my day around bathrooms",
        2
      ],
      [
        "It's a real problem — pads, planning, avoiding activities",
        3
      ]
    ]
  },
  {
    "id": "fixFirst",
    "sec": "The impact",
    "text": "Last one. If one thing could change first, what would you pick?",
    "opts": [
      [
        "Sleep through the night"
      ],
      [
        "My energy back"
      ],
      [
        "The weight"
      ],
      [
        "My mood"
      ],
      [
        "My libido"
      ],
      [
        "The flashes"
      ]
    ]
  }
];
export const QUIZ_ITEMS = [{"id":"wakeNights","d":"sleep","w":2},{"id":"wakeTime","d":"sleep","w":1},{"id":"backAsleep","d":"sleep","w":3},{"id":"wakeCause","d":"sleep","w":1},{"id":"sweats","d":"sleep","w":1},{"id":"flashes","d":"temp","w":3},{"id":"sweats","d":"temp","w":2},{"id":"wantFreq","d":"intimacy","w":3},{"id":"desire","d":"intimacy","w":2},{"id":"arousal","d":"intimacy","w":1},{"id":"orgasmChange","d":"intimacy","w":2},{"id":"dryness","d":"intimacy","w":2},{"id":"weirdCount","d":"mood","w":1,"count":true},{"id":"words","d":"mood","w":3},{"id":"fog","d":"mood","w":1},{"id":"swings","d":"mood","w":2},{"id":"anxietyLevel","d":"mood","w":2},{"id":"anxiety","d":"mood","w":1},{"id":"joints","d":"body","w":1},{"id":"bladder","d":"body","w":1},{"id":"weightChange","d":"body","w":3},{"id":"weightWhere","d":"body","w":2},{"id":"triedToLose","d":"body","w":2},{"id":"recovery","d":"body","w":1},{"id":"afternoon","d":"body","w":2},{"id":"activeDays","d":"body","w":1},{"id":"cravings","d":"body","w":1}];
const MINW: Record<string,number> = {"sleep":4,"temp":2.5,"intimacy":5,"mood":5,"body":7};
const INDEX_BANDS: [number,string][] = [[91,"In balance"],[82,"Mild"],[64,"Moderate"],[0,"Strong signal"]];

export function validateQuizAnswers(input: unknown): QuizAnswers {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Incomplete quiz.");
  const values = input as Record<string,unknown>, result: QuizAnswers = {};
  if (Object.keys(values).some(id => !QUIZ_QUESTIONS.some(q=>q.id===id))) throw new Error("Invalid quiz answers.");
  for (const q of QUIZ_QUESTIONS.filter(q=>!q.conditional)) {
    const v=values[q.id];
    const validIndex=(i:unknown):i is number=>typeof i==="number"&&Number.isInteger(i)&&i>=0&&i<q.opts.length;
    if (q.multi) {
      if (!Array.isArray(v)||!v.length||v.length>q.opts.length||!v.every(validIndex)||new Set(v).size!==v.length) throw new Error("Incomplete quiz.");
      if (v.length>1&&v.some(i=>q.opts[i][0]==="None of these")) throw new Error("Invalid quiz answers.");
      result[q.id]=[...v];
    } else { if (!validIndex(v)) throw new Error("Incomplete quiz."); result[q.id]=v; }
  }
  const weird=QUIZ_QUESTIONS.find(q=>q.id==="weird")!;
  const picked=(result.weird as number[]).filter(i=>weird.opts[i][0]!=="None of these");
  if(picked.length) {
    const v=values.weirdWorst;
    if(typeof v!=="number"||!Number.isInteger(v)||v<0||v>=picked.length)throw new Error("Incomplete quiz.");
    result.weirdWorst=v;
  } else if(values.weirdWorst!==undefined) throw new Error("Invalid conditional answer.");
  return result;
}

export function quizAnswerTexts(answers:QuizAnswers):QuizAnswerText[]{
  const weird=QUIZ_QUESTIONS.find(q=>q.id==="weird")!;
  const picked=(answers.weird as number[]).filter(i=>weird.opts[i][0]!=="None of these");
  return QUIZ_QUESTIONS.filter(q=>!q.conditional||picked.length>0).map(q=>{
    const v=answers[q.id];
    const answer=q.conditional?String(weird.opts[picked[v as number]][0]):Array.isArray(v)?v.map(i=>String(q.opts[i][0])).join("; "):String(q.opts[v as number][0]);
    return {id:q.id,section:q.sec,question:q.text,answer};
  });
}

export function computeQuizScore(answers:QuizAnswers){
  const domains=["sleep","temp","intimacy","mood","body"], S:Record<string,number>={},W:Record<string,number>={};
  domains.forEach(d=>{S[d]=0;W[d]=0});
  const weird=QUIZ_QUESTIONS.find(q=>q.id==="weird")!;
  const count=(answers.weird as number[]).filter(i=>weird.opts[i][0]!=="None of these").length;
  for(const def of QUIZ_ITEMS){
    let p:number|null;
    if("count" in def&&def.count)p=count===0?0:count===1?1:count===2?2:3;
    else{
      const q=QUIZ_QUESTIONS.find(q=>q.id===def.id)!,v=answers[def.id];
      const o=typeof v==="number"?q.opts[v]:undefined;
      p=o&&o[2]!=="skip"&&typeof o[1]==="number"?o[1]:null;
    }
    if(p===null)continue;
    S[def.d]+=def.w*p;W[def.d]+=def.w;
  }
  const scores:Record<string,number|null>={};let poolS=0,poolW=0,scoredCount=0;
  domains.forEach(d=>{if(W[d]<MINW[d]){scores[d]=null;return}scores[d]=Math.round(100*(1-S[d]/(3*W[d])));poolS+=S[d];poolW+=W[d];scoredCount++});
  const index=scoredCount>=3?Math.round(100*(1-poolS/(3*poolW))):null;
  return {balance_index:index,score_band:index===null?"Insufficient data":INDEX_BANDS.find(([min])=>index>=min)![1],domain_scores:scores};
}

export function createTestQuizAnswers():QuizAnswers{
  const answers:QuizAnswers={};
  QUIZ_QUESTIONS.filter(q=>!q.conditional).forEach(q=>answers[q.id]=q.multi?[0]:Math.min(1,q.opts.length-1));
  answers.recognize=[0,2,5];answers.weird=[0,1];answers.age=2;answers.weirdWorst=0;
  return validateQuizAnswers(answers);
}
