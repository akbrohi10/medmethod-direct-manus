import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock3,
  DollarSign,
  ExternalLink,
  LockKeyhole,
  MapPinned,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import ComplianceDisclosures from "@/components/ComplianceDisclosures";
import "./Asynchronous.css";

const LOGO_URL = "/manus-storage/embedded-2_298f7a2c.png";
const DOCTOR_PORTRAIT_URL = "/manus-storage/embedded-4_715d8d54.png";

const COMPOUNDED_DISCLOSURE =
  "Compounded medications are not FDA-approved. They are prepared by licensed compounding pharmacies for an individual patient based on a prescription. FDA-approved alternatives are available and will be discussed with you by your physician. Results vary. Treatment requires ongoing medical monitoring.";

type CarePath = "hormone" | "weight" | "both";

type CareProfile = {
  symptomKicker: string;
  symptomTitle: string;
  symptomSub: string;
  symptoms: string[];
  followKicker: string;
  followTitle: string;
  followSub: string;
  followups: string[];
  safetyTitle: string;
  safetySub: string;
  safety: string[];
  baselineTitle: string;
  baselineSub: string;
};

type Treatment = {
  id: string;
  label: string;
  meta: string;
  price: string;
  visual: "vial" | "pill" | "patch" | "spray" | "tube";
};

type Details = {
  firstName: string;
  state: string;
  email: string;
};

type Baseline = {
  height: string;
  weight: string;
  goalWeight: string;
  bloodPressure: string;
  period: string;
  uterus: string;
  currentHormoneCare: string;
  notes: string;
};

const PROFILES: Record<CarePath, CareProfile> = {
  hormone: {
    symptomKicker: "HORMONE CARE · YOUR SYMPTOMS",
    symptomTitle: "Which changes are you noticing?",
    symptomSub:
      "Select anything that feels familiar. Dr. Al-Deek reviews your full symptom picture—not just one concern.",
    symptoms: [
      "Hot flashes or night sweats",
      "Waking during the night or around 3 a.m.",
      "Brain fog or trouble concentrating",
      "Fatigue or low energy",
      "Increased anxiety, irritability, or mood changes",
      "Irregular, skipped, or changing periods",
      "Weight gain or a change in body shape",
      "Vaginal dryness or discomfort",
      "Lower libido",
      "Joint aches or new headaches",
    ],
    followKicker: "HORMONE CARE · YOUR CYCLE",
    followTitle: "Where are you in your hormone journey?",
    followSub:
      "This helps your doctor understand whether your symptoms may fit perimenopause, menopause, or another pattern.",
    followups: [
      "Periods are still regular",
      "Periods have become irregular",
      "No period for less than 12 months",
      "No period for 12 months or longer",
      "I do not have periods for another reason",
      "I’m not sure",
    ],
    safetyTitle: "Hormone-care safety screening",
    safetySub:
      "Select anything that applies. Your answers can trigger a clinician follow-up before hormone treatment is considered.",
    safety: [
      "History of blood clots or clotting disorder",
      "Breast or endometrial cancer",
      "Unexplained vaginal bleeding",
      "Heart attack or stroke",
      "Liver condition",
      "None of these",
    ],
    baselineTitle: "Hormone-care baseline",
    baselineSub:
      "Cycle history, uterus status, and blood pressure help the clinician evaluate hormone options safely.",
  },
  weight: {
    symptomKicker: "WEIGHT CARE · WHAT YOU’RE EXPERIENCING",
    symptomTitle: "What has been making weight loss feel harder?",
    symptomSub:
      "Select anything that feels familiar. This helps Dr. Al-Deek review appetite, energy, sleep, weight history, and possible hormone context together.",
    symptoms: [
      "Weight gain despite diet or activity changes",
      "A weight-loss plateau",
      "Weight regained after previous loss",
      "Constant hunger or strong cravings",
      "Stress or emotional eating",
      "Fatigue or low energy",
      "Waking during the night or around 3 a.m.",
      "More weight around the middle",
      "Weight retained after pregnancy",
      "Cycle changes, hot flashes, or night sweats",
      "Prediabetes, insulin resistance, or other metabolic concerns",
      "I want clinician-guided medication support",
    ],
    followKicker: "WEIGHT CARE · MEDICATION HISTORY",
    followTitle: "Have you used prescription weight-loss medication before?",
    followSub:
      "Your answer helps the clinician plan for starting, switching, or continuing treatment.",
    followups: [
      "No, this would be my first time",
      "I currently use a GLP-1 medication",
      "I used a GLP-1 medication in the past",
      "I used another prescription weight-loss medication",
      "I explored medication but did not start",
      "I’m not sure",
    ],
    safetyTitle: "Weight-care safety screening",
    safetySub:
      "Select anything that applies. These questions are specific to medical weight-loss treatment.",
    safety: [
      "History of pancreatitis",
      "Personal or family history of medullary thyroid cancer or MEN2",
      "Severe stomach-emptying problems or gastroparesis",
      "Gallbladder condition",
      "Pregnant, breastfeeding, or trying to become pregnant",
      "None of these",
    ],
    baselineTitle: "Weight-care baseline",
    baselineSub:
      "Current measurements and treatment goals help the clinician assess eligibility and dosing.",
  },
  both: {
    symptomKicker: "INTEGRATED CARE · YOUR SYMPTOMS",
    symptomTitle: "What has felt different lately?",
    symptomSub:
      "Select anything that feels familiar. Dr. Al-Deek will review your weight, appetite, sleep, energy, cycle, and menopause symptoms together.",
    symptoms: [
      "Weight gain or harder weight loss",
      "A weight-loss plateau",
      "Constant hunger or strong cravings",
      "Stress or emotional eating",
      "Hot flashes or night sweats",
      "Waking during the night or around 3 a.m.",
      "Brain fog or trouble concentrating",
      "Fatigue or low energy",
      "Increased anxiety, irritability, or mood changes",
      "Irregular, skipped, or changing periods",
      "More weight around the middle",
      "Vaginal dryness or discomfort",
      "Lower libido",
    ],
    followKicker: "INTEGRATED CARE · YOUR PRIORITY",
    followTitle: "What would make care feel successful first?",
    followSub:
      "Your doctor still reviews the whole picture; this simply identifies the best place to start.",
    followups: [
      "Relieve hot flashes or night sweats",
      "Improve sleep, mood, or energy",
      "Lose weight with clinical support",
      "Understand how hormones may affect my weight",
      "Review or improve treatment I already use",
      "I’m not sure",
    ],
    safetyTitle: "Integrated safety screening",
    safetySub:
      "This combines key hormone and weight-treatment questions; relevant answers can open deeper follow-ups.",
    safety: [
      "History of blood clots or clotting disorder",
      "Breast or endometrial cancer",
      "Unexplained vaginal bleeding",
      "History of pancreatitis",
      "Personal or family history of medullary thyroid cancer or MEN2",
      "Pregnant, breastfeeding, or trying to become pregnant",
      "Liver or gallbladder condition",
      "None of these",
    ],
    baselineTitle: "Integrated care baseline",
    baselineSub:
      "These details give the clinician a starting point for both hormone and metabolic care.",
  },
};

const WEIGHT_TREATMENTS: Treatment[] = [
  {
    id: "compounded-semaglutide",
    label: "Semaglutide (compounded)",
    meta: "Weekly injection · personalized dosing",
    price: "from $70/month",
    visual: "vial",
  },
  {
    id: "compounded-tirzepatide",
    label: "Tirzepatide (compounded)",
    meta: "Weekly injection · personalized dosing",
    price: "from $100/month",
    visual: "vial",
  },
  {
    id: "compounded-liraglutide",
    label: "Liraglutide (compounded)",
    meta: "Daily injection · personalized dosing",
    price: "from $115/month",
    visual: "vial",
  },
  {
    id: "weight-option-a",
    label: "FDA-approved weekly option",
    meta: "Weekly injection · prescription required",
    price: "from $199/month",
    visual: "spray",
  },
  {
    id: "weight-option-b",
    label: "Another FDA-approved weekly option",
    meta: "Weekly injection · prescription required",
    price: "from $299/month",
    visual: "spray",
  },
];

const HORMONE_TREATMENTS: Treatment[] = [
  {
    id: "estradiol-pill",
    label: "Estradiol pill",
    meta: "FDA-approved · daily tablet",
    price: "from $39.99/month",
    visual: "pill",
  },
  {
    id: "estradiol-patch",
    label: "Estradiol patch",
    meta: "FDA-approved · transdermal patch",
    price: "$100/month",
    visual: "patch",
  },
  {
    id: "estradiol-spray",
    label: "Estradiol spray",
    meta: "FDA-approved · transdermal spray",
    price: "$69.99/month",
    visual: "spray",
  },
  {
    id: "progesterone",
    label: "Progesterone",
    meta: "FDA-approved · daily pill",
    price: "from $23/month",
    visual: "pill",
  },
  {
    id: "estradiol-cream",
    label: "Estradiol vaginal cream",
    meta: "FDA-approved · 3-month tube",
    price: "$39.99/month · billed quarterly",
    visual: "tube",
  },
];

const STATES = [
  "Florida",
  "Georgia",
  "Texas",
  "Virginia",
  "Other / check availability",
];

const INITIAL_DETAILS: Details = { firstName: "", state: "", email: "" };
const INITIAL_BASELINE: Baseline = {
  height: "",
  weight: "",
  goalWeight: "",
  bloodPressure: "",
  period: "",
  uterus: "",
  currentHormoneCare: "",
  notes: "",
};

function ChoiceButton({
  label,
  description,
  selected,
  multi = false,
  onClick,
  icon,
}: {
  label: string;
  description?: string;
  selected: boolean;
  multi?: boolean;
  onClick: () => void;
  icon?: string;
}) {
  return (
    <button
      type="button"
      className={`async-choice${selected ? " is-selected" : ""}${multi ? " is-multi" : ""}${icon ? " async-path-choice" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {multi && <span className="async-choice-mark" aria-hidden="true">{selected && <Check />}</span>}
      {icon && <span className="async-mini-art" aria-hidden="true">{icon}</span>}
      <span className="async-choice-copy">
        <strong>{label}</strong>
        {description && <span>{description}</span>}
      </span>
      {!multi && <span className="async-choice-mark" aria-hidden="true" />}
    </button>
  );
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="async-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="async-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TreatmentCard({
  treatment,
  selected,
  onClick,
}: {
  treatment: Treatment;
  selected: boolean;
  onClick: () => void;
}) {
  const [amount, cadence] = treatment.price.split("/");
  return (
    <button
      className={`async-treatment-card${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="async-treatment-art" aria-hidden="true">
        <span className="async-rx">RX</span>
        <span className={`async-drug-visual ${treatment.visual}`} />
      </span>
      <span className="async-treatment-copy">
        <strong>{treatment.label}</strong>
        <span className="async-meta">{treatment.meta}</span>
        <span className="async-med-price">
          {amount.includes("from") ? "Starts at " : ""}
          <b>{amount.replace("from ", "")}</b>{cadence ? `/${cadence}` : ""}
        </span>
      </span>
      <span className="async-radio-dot" aria-hidden="true" />
    </button>
  );
}

function SampleChat() {
  return (
    <div className="async-chat-window" aria-label="Illustrative sample conversation between a patient and Dr. Al-Deek">
      <div className="async-chat-window-top">
        <div className="async-chat-avatar" aria-hidden="true">JA</div>
        <div>
          <span className="async-chat-person">Dr. Jumana Al-Deek, DO</span>
          <span className="async-chat-status">Physician review</span>
        </div>
        <span className="async-sample-badge">SAMPLE CHAT</span>
      </div>
      <div className="async-chat-thread">
        <div className="async-message">
          <span className="async-message-label">Dr. Al-Deek</span>
          <div className="async-bubble">Hi — I’ve reviewed your assessment, including the weight changes, sleep disruption, and hot flashes you shared. Before I recommend a plan, I have two follow-up questions.</div>
        </div>
        <div className="async-message patient">
          <span className="async-message-label">Sample patient</span>
          <div className="async-bubble">My biggest concern is weight, but I also want to understand whether hormones could be part of it.</div>
        </div>
        <div className="async-message">
          <span className="async-message-label">Dr. Al-Deek</span>
          <div className="async-bubble">Absolutely. I’ll consider both together. First, can you confirm your recent blood pressure and whether you’ve ever taken a prescription weight-loss medication?</div>
        </div>
        <div className="async-message patient">
          <span className="async-message-label">Sample patient</span>
          <div className="async-bubble">My recent blood pressure was 118/76, and I haven’t used one before.</div>
        </div>
        <div className="async-message">
          <span className="async-message-label">Dr. Al-Deek</span>
          <div className="async-bubble">Thank you. I have what I need to prepare your recommendation. I’ll send the plan here with the medication options, exact cost, and why I recommend that path. Nothing moves forward until you review it.</div>
        </div>
      </div>
      <div className="async-chat-window-foot">Illustrative conversation only. Your questions and recommendation depend on your medical history.</div>
    </div>
  );
}

export default function Asynchronous() {
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<CarePath | "">("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [followup, setFollowup] = useState("");
  const [treatment, setTreatment] = useState("Not sure — doctor recommendation");
  const [treatmentPrice, setTreatmentPrice] = useState("Price confirmed after review");
  const [history, setHistory] = useState<string[]>([]);
  const [details, setDetails] = useState<Details>(INITIAL_DETAILS);
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [baseline, setBaseline] = useState<Baseline>(INITIAL_BASELINE);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const assessmentPanelRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const assessmentCloseRef = useRef<HTMLButtonElement>(null);
  const chatCloseRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const profile = PROFILES[path || "both"];

  useEffect(() => {
    if (!assessmentOpen && !chatOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const activePanel = assessmentOpen ? assessmentPanelRef.current : chatPanelRef.current;
    const initialFocus = assessmentOpen ? assessmentCloseRef.current : chatCloseRef.current;
    requestAnimationFrame(() => initialFocus?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAssessmentOpen(false);
        setChatOpen(false);
        requestAnimationFrame(() => restoreFocusRef.current?.focus());
        return;
      }
      if (event.key !== "Tab" || !activePanel) return;
      const focusable = Array.from(
        activePanel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [assessmentOpen, chatOpen]);

  const resetFlow = (initialPath: CarePath | "" = "") => {
    setStep(initialPath ? 1 : 0);
    setPath(initialPath);
    setSymptoms([]);
    setFollowup("");
    setTreatment("Not sure — doctor recommendation");
    setTreatmentPrice("Price confirmed after review");
    setHistory([]);
    setDetails(INITIAL_DETAILS);
    setMedications("");
    setAllergies("");
    setBaseline(INITIAL_BASELINE);
  };

  const openAssessment = (initialPath: CarePath | "" = "") => {
    if (!assessmentOpen && !chatOpen && document.activeElement instanceof HTMLElement) {
      restoreFocusRef.current = document.activeElement;
    }
    resetFlow(initialPath);
    setChatOpen(false);
    setAssessmentOpen(true);
  };

  const openChat = () => {
    if (!assessmentOpen && !chatOpen && document.activeElement instanceof HTMLElement) {
      restoreFocusRef.current = document.activeElement;
    }
    setAssessmentOpen(false);
    setChatOpen(true);
  };

  const closeAssessment = () => {
    setAssessmentOpen(false);
    requestAnimationFrame(() => restoreFocusRef.current?.focus());
  };

  const closeChat = () => {
    setChatOpen(false);
    requestAnimationFrame(() => restoreFocusRef.current?.focus());
  };

  const selectPath = (nextPath: CarePath) => {
    if (nextPath !== path) {
      setSymptoms([]);
      setFollowup("");
      setHistory([]);
      setTreatment("Not sure — doctor recommendation");
      setTreatmentPrice("Price confirmed after review");
    }
    setPath(nextPath);
  };

  const toggleSymptom = (value: string) => {
    setSymptoms((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const toggleHistory = (value: string) => {
    setHistory((current) => {
      if (value === "None of these") return current.includes(value) ? [] : [value];
      const withoutNone = current.filter((item) => item !== "None of these");
      return withoutNone.includes(value)
        ? withoutNone.filter((item) => item !== value)
        : [...withoutNone, value];
    });
  };

  const nextDisabled =
    (step === 0 && !path) ||
    (step === 1 && symptoms.length === 0) ||
    (step === 2 && !followup) ||
    (step === 3 && (!details.firstName.trim() || !details.state || !details.email.includes("@"))) ||
    (step === 6 && history.length === 0);

  const moveToStep = (nextStep: number) => {
    setStep(Math.max(0, Math.min(10, nextStep)));
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const selectTreatment = (item: Treatment) => {
    setTreatment(item.label);
    setTreatmentPrice(item.price);
  };

  const updateBaseline = (key: keyof Baseline, value: string) => {
    setBaseline((current) => ({ ...current, [key]: value }));
  };

  const selectedMatching = (terms: string[]) =>
    symptoms.filter((item) => terms.some((term) => item.toLowerCase().includes(term)));

  const renderBaselineFields = () => {
    if (path === "hormone") {
      return (
        <>
          <div className="async-two-col">
            <SelectField label="Do you have a uterus?" value={baseline.uterus} options={["Yes", "No", "Not sure"]} onChange={(value) => updateBaseline("uterus", value)} />
            <Field label="Recent blood pressure" value={baseline.bloodPressure} placeholder="e.g. 118/76" onChange={(value) => updateBaseline("bloodPressure", value)} />
          </div>
          <div className="async-two-col">
            <Field label="Last menstrual period" value={baseline.period} placeholder="Month / year or not applicable" onChange={(value) => updateBaseline("period", value)} />
            <SelectField label="Current hormone therapy" value={baseline.currentHormoneCare} options={["None", "Using hormone therapy now", "Used hormone therapy previously", "Not sure"]} onChange={(value) => updateBaseline("currentHormoneCare", value)} />
          </div>
        </>
      );
    }
    if (path === "weight") {
      return (
        <>
          <div className="async-two-col">
            <Field label="Height" value={baseline.height} placeholder="e.g. 5 ft 6 in" onChange={(value) => updateBaseline("height", value)} />
            <Field label="Current weight" value={baseline.weight} placeholder="e.g. 160 lb" onChange={(value) => updateBaseline("weight", value)} />
          </div>
          <div className="async-two-col">
            <Field label="Goal weight" value={baseline.goalWeight} placeholder="e.g. 140 lb" onChange={(value) => updateBaseline("goalWeight", value)} />
            <Field label="Recent blood pressure" value={baseline.bloodPressure} placeholder="e.g. 118/76" onChange={(value) => updateBaseline("bloodPressure", value)} />
          </div>
        </>
      );
    }
    return (
      <>
        <div className="async-two-col">
          <Field label="Height" value={baseline.height} placeholder="e.g. 5 ft 6 in" onChange={(value) => updateBaseline("height", value)} />
          <Field label="Current weight" value={baseline.weight} placeholder="e.g. 160 lb" onChange={(value) => updateBaseline("weight", value)} />
        </div>
        <div className="async-two-col">
          <Field label="Recent blood pressure" value={baseline.bloodPressure} placeholder="e.g. 118/76" onChange={(value) => updateBaseline("bloodPressure", value)} />
          <Field label="Last menstrual period" value={baseline.period} placeholder="Month / year or not applicable" onChange={(value) => updateBaseline("period", value)} />
        </div>
        <SelectField label="Do you have a uterus?" value={baseline.uterus} options={["Yes", "No", "Not sure"]} onChange={(value) => updateBaseline("uterus", value)} />
      </>
    );
  };

  const renderSnapshot = () => {
    const sleep = selectedMatching(["sleep", "waking"]);
    const weight = selectedMatching(["weight", "plateau", "hunger", "cravings", "eating", "prediabetes", "insulin resistance", "metabolic"]);
    const cycle = selectedMatching(["cycle", "period", "hot flashes", "night sweats", "vaginal", "libido"]);
    const rows = [
      { label: "WHAT YOU’RE NOTICING", value: symptoms.join(" · ") || "No symptoms selected.", note: "These are the changes you chose to discuss with Dr. Al-Deek." },
      { label: "WEIGHT & APPETITE", value: weight.join(" · ") || "No weight or appetite change selected.", note: baseline.weight ? `Current: ${baseline.weight}${baseline.goalWeight ? ` · Goal: ${baseline.goalWeight}` : ""}` : "No measurements were entered in this prototype." },
      { label: "SLEEP", value: sleep.join(" · ") || "You did not select a sleep change." },
      { label: "CYCLES & HORMONES", value: cycle.join(" · ") || "You did not select a cycle or menopause-related change.", note: "Dr. Al-Deek reviews these answers alongside the rest of your history." },
      { label: path === "both" ? "FIRST PRIORITY" : "CARE CONTEXT", value: followup || "No answer provided." },
      { label: "TREATMENT INTEREST", value: treatment, note: `${treatmentPrice} · Interest only; Dr. Al-Deek confirms what is appropriate.` },
    ];
    return (
      <div className="async-snapshot-list" aria-live="polite">
        {rows.map((row) => (
          <div className="async-snapshot-row" key={row.label}>
            <div className="async-snapshot-label">{row.label}</div>
            <div className="async-snapshot-value">{row.value}{row.note && <small>{row.note}</small>}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderAssessmentStep = () => {
    if (step === 0) {
      return (
        <section className="async-step-screen" data-asynchronous-step="0">
          <div className="async-flow-kicker">LET’S START WITH WHAT BROUGHT YOU HERE</div>
          <h2 className="async-flow-title">What kind of care are you looking for?</h2>
          <p className="async-flow-sub">Choose one. You can still tell us about every symptom on the next step.</p>
          <div className="async-choices">
            <ChoiceButton icon="⌁" label="Medical weight care" description="Metabolic support and GLP-1 options when clinically appropriate" selected={path === "weight"} onClick={() => selectPath("weight")} />
            <ChoiceButton icon="◯" label="Hormone care" description="Perimenopause, menopause, sleep, mood, energy, and vaginal symptoms" selected={path === "hormone"} onClick={() => selectPath("hormone")} />
            <ChoiceButton icon="∞" label="Both hormones + weight" description="One integrated review of symptoms, metabolism, and goals" selected={path === "both"} onClick={() => selectPath("both")} />
          </div>
        </section>
      );
    }
    if (step === 1) {
      return (
        <section className="async-step-screen" data-asynchronous-step="1">
          <div className="async-flow-kicker">{profile.symptomKicker}</div>
          <h2 className="async-flow-title">{profile.symptomTitle}</h2>
          <p className="async-flow-sub">{profile.symptomSub}</p>
          <div className="async-choices">
            {profile.symptoms.map((item) => <ChoiceButton key={item} label={item} selected={symptoms.includes(item)} multi onClick={() => toggleSymptom(item)} />)}
          </div>
        </section>
      );
    }
    if (step === 2) {
      return (
        <section className="async-step-screen" data-asynchronous-step="2">
          <div className="async-flow-kicker">{profile.followKicker}</div>
          <h2 className="async-flow-title">{profile.followTitle}</h2>
          <p className="async-flow-sub">{profile.followSub}</p>
          <div className="async-choices">
            {profile.followups.map((item) => <ChoiceButton key={item} label={item} selected={followup === item} onClick={() => setFollowup(item)} />)}
          </div>
        </section>
      );
    }
    if (step === 3) {
      return (
        <section className="async-step-screen" data-asynchronous-step="3">
          <div className="async-flow-kicker">YOUR DETAILS</div>
          <h2 className="async-flow-title">A few details before your treatment options</h2>
          <p className="async-flow-sub">Your state helps determine whether care is available where you live. Use sample details in this prototype.</p>
          <div className="async-fields">
            <div className="async-two-col">
              <Field label="First name" value={details.firstName} placeholder="Sample name" onChange={(value) => setDetails((current) => ({ ...current, firstName: value }))} />
              <SelectField label="State" value={details.state} options={STATES} onChange={(value) => setDetails((current) => ({ ...current, state: value }))} />
            </div>
            <Field label="Email" type="email" value={details.email} placeholder="sample@example.com" onChange={(value) => setDetails((current) => ({ ...current, email: value }))} />
            <div className="async-privacy-note"><LockKeyhole aria-hidden="true" /><span>Prototype only: use sample information. Nothing entered here is sent or saved.</span></div>
          </div>
        </section>
      );
    }
    if (step === 4) {
      return (
        <section className="async-step-screen" data-asynchronous-step="4">
          <div className="async-flow-kicker">TRANSPARENT MEDICATION PRICING</div>
          <h2 className="async-flow-title">Which option interests you most?</h2>
          <p className="async-flow-sub">Browse the prototype prices, choose one option you would like Dr. Al-Deek to consider, or select “I’m not sure.” This is not an order or a guarantee.</p>
          <div className="async-treatment-list">
            <button type="button" className={`async-treatment-card async-uncertain${treatment.startsWith("Not sure") ? " is-selected" : ""}`} aria-pressed={treatment.startsWith("Not sure")} onClick={() => { setTreatment("Not sure — doctor recommendation"); setTreatmentPrice("Price confirmed after review"); }}>
              <span className="async-treatment-copy"><strong>I’m not sure — recommend for me</strong><span className="async-meta">Dr. Al-Deek can explain the options and recommend a fit.</span></span><span className="async-radio-dot" aria-hidden="true" />
            </button>
          </div>
          {(path === "weight" || path === "both") && (
            <>
              <div className="async-section-label"><h3>Weight-care options</h3><span>PLACEHOLDER PRICES</span></div>
              <div className="async-treatment-list">{WEIGHT_TREATMENTS.map((item) => <TreatmentCard key={item.id} treatment={item} selected={treatment === item.label} onClick={() => selectTreatment(item)} />)}</div>
            </>
          )}
          {(path === "hormone" || path === "both") && (
            <>
              <div className="async-section-label"><h3>Hormone-care options</h3><span>PLACEHOLDER PRICES</span></div>
              <div className="async-treatment-list">{HORMONE_TREATMENTS.map((item) => <TreatmentCard key={item.id} treatment={item} selected={treatment === item.label} onClick={() => selectTreatment(item)} />)}</div>
            </>
          )}
          <p className="async-disclaimer">Placeholder prices are based on a public catalog, not MedMethod Direct pharmacy quotes. Medication interest is not a prescription or guarantee.</p>
          <p className="sr-only">{COMPOUNDED_DISCLOSURE}</p>
          <ComplianceDisclosures compact compounded />
        </section>
      );
    }
    if (step === 5) {
      return (
        <section className="async-step-screen" data-asynchronous-step="5">
          <div className="async-flow-kicker">CHECKOUT PREVIEW</div>
          <h2 className="async-flow-title">Review your $49 assessment fee.</h2>
          <p className="async-flow-sub">In the live flow, this is the single payment step. After the $49 payment, you continue to the clinical intake—there is no second $49 charge.</p>
          <div className="async-summary-box">
            <div className="async-summary-row"><div><strong>Assessment with Dr. Al-Deek</strong><small>Her review, direct chat, and first 30 days of care</small></div><strong>$49 today</strong></div>
            <div className="async-summary-row"><div><strong>Care after 30 days</strong><small>Choose a $49/month membership or $150 visits as needed</small></div><strong>Your choice</strong></div>
            <div className="async-summary-row"><div><strong>Medication interest</strong><small>{treatment}</small></div><strong>{treatmentPrice}</strong></div>
            <div className="async-summary-row async-summary-total"><span>Due today</span><strong>$49</strong></div>
          </div>
          <div className="async-assurance">
            <div><strong>Dr. Al-Deek decides first</strong>Your selection is a preference, not an order.</div>
            <div><strong>Exact price before shipping</strong>You approve your final plan before fulfillment.</div>
          </div>
          <p className="async-disclaimer">Proposed refund policy: if Dr. Al-Deek determines that no medication is appropriate, the $49 review fee is refunded. This prototype does not process payment.</p>
        </section>
      );
    }
    if (step === 6) {
      return (
        <section className="async-step-screen" data-asynchronous-step="6">
          <div className="async-flow-kicker">CLINICAL INTAKE · 1 OF 3</div>
          <h2 className="async-flow-title">{profile.safetyTitle}</h2>
          <p className="async-flow-sub">{profile.safetySub}</p>
          <div className="async-choices">{profile.safety.map((item) => <ChoiceButton key={item} label={item} selected={history.includes(item)} multi onClick={() => toggleHistory(item)} />)}</div>
        </section>
      );
    }
    if (step === 7) {
      return (
        <section className="async-step-screen" data-asynchronous-step="7">
          <div className="async-flow-kicker">CLINICAL INTAKE · 2 OF 3</div>
          <h2 className="async-flow-title">Current medications &amp; allergies</h2>
          <p className="async-flow-sub">This standardized section supports safe prescribing, separate from the marketing quiz.</p>
          <div className="async-fields">
            <label className="async-field"><span>Current medications</span><textarea value={medications} placeholder="Prototype: enter sample text only" onChange={(event) => setMedications(event.target.value)} /></label>
            <label className="async-field"><span>Medication allergies</span><textarea value={allergies} placeholder="Prototype: enter sample text only" onChange={(event) => setAllergies(event.target.value)} /></label>
          </div>
        </section>
      );
    }
    if (step === 8) {
      return (
        <section className="async-step-screen" data-asynchronous-step="8">
          <div className="async-flow-kicker">CLINICAL INTAKE · 3 OF 3</div>
          <h2 className="async-flow-title">{profile.baselineTitle}</h2>
          <p className="async-flow-sub">{profile.baselineSub}</p>
          <div className="async-fields">
            {renderBaselineFields()}
            <label className="async-field"><span>Anything else your doctor should know?</span><textarea value={baseline.notes} placeholder="Prototype: enter sample text only" onChange={(event) => updateBaseline("notes", event.target.value)} /></label>
          </div>
        </section>
      );
    }
    if (step === 9) {
      return (
        <section className="async-step-screen" data-asynchronous-step="9">
          <div className="async-flow-kicker">YOUR RESULTS</div>
          <h2 className="async-flow-title">Your assessment snapshot</h2>
          <p className="async-flow-sub">Here’s what you shared, organized for your doctor. This snapshot does not diagnose a condition or determine which treatment is right for you.</p>
          {renderSnapshot()}
          <div className="async-snapshot-doctor"><strong>Dr. Al-Deek personally reviews every assessment within 24 hours.</strong><span>Her $49 review includes your personalized clinical read, follow-up questions, and a direct chat about the next step.</span></div>
        </section>
      );
    }
    return (
      <section className="async-step-screen" data-asynchronous-step="10">
        <div className="async-done-card">
          <div className="async-done-mark"><Check aria-hidden="true" /></div>
          <h2 className="async-flow-title">Your review with Dr. Al-Deek would begin here.</h2>
          <p>After payment and intake, Dr. Al-Deek reads your answers herself and starts a private message thread for follow-up questions, your recommendation, and the exact medication price before anything moves forward.</p>
          <div className="async-done-actions">
            <button className="async-btn async-btn-primary" type="button" onClick={openChat}><MessageCircle aria-hidden="true" /> See a sample doctor chat</button>
            <button className="async-btn async-btn-secondary" type="button" onClick={() => resetFlow()}><RotateCcw aria-hidden="true" /> Start over</button>
          </div>
        </div>
      </section>
    );
  };

  const faqs = [
    ["Am I choosing my own medication?", "No. The medication screen records what interests you and makes pricing visible. Dr. Al-Deek reviews your medical history, chats with you directly, and may agree, recommend an alternative, or determine that treatment is not appropriate."],
    ["What happens if I’m not prescribed medication?", "Under the proposed pilot policy, the $49 review fee is refunded when Dr. Al-Deek determines that no medication should be prescribed. The refund does not apply when a prescription is offered and you decide not to fill it."],
    ["Are medication costs included?", "No. Care and medication are itemized separately. You see the exact medication cost and approve it before fulfillment."],
    ["Do I have to join a membership?", "No. Ongoing care is available at $49 per month, or you can choose $150 pay-as-you-go follow-up visits."],
    ["Are compounded medications FDA-approved?", COMPOUNDED_DISCLOSURE],
  ];

  return (
    <div className="asynchronous-page" data-asynchronous-landing-page>
      <Helmet>
        <title>Asynchronous Physician Care | MedMethod Direct</title>
        <meta name="description" content="Explore MedMethod Direct's asynchronous physician review experience for hormone and medical weight care." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://medmethoddirect.com/asynchronous" />
      </Helmet>

      <div className="async-topbar">Medical weight loss + hormone care, directly with Dr. Jumana Al-Deek.</div>
      <header className="async-wrap async-nav" aria-label="Page navigation">
        <a className="async-brand-lockup" href="/" aria-label="MedMethod Direct home">
          <img className="async-brand-logo" src={LOGO_URL} alt="MedMethod Direct" />
          <span>Your Path to Longevity</span>
        </a>
        <nav className="async-nav-links" aria-label="Primary navigation">
          <a href="#async-how">How it works</a>
          <a href="#async-pricing">Pricing</a>
          <a href="#async-faq">Questions</a>
          <button className="async-btn async-btn-primary async-btn-small" type="button" onClick={() => openAssessment()}>Start assessment</button>
        </nav>
      </header>

      <main>
        <section className="async-wrap async-hero">
          <div className="async-hero-copy">
            <div className="async-eyebrow">Direct care with Dr. Jumana Al-Deek, DO</div>
            <h1>Lose weight with a plan that accounts for your hormones.</h1>
            <p>Work directly with Dr. Al-Deek—a medical weight loss, perimenopause, menopause, and metabolic health specialist—for a personalized plan that may include compounded GLP-1 options when clinically appropriate.</p>
            <div className="async-hero-actions">
              <button className="async-btn async-btn-primary" type="button" onClick={() => openAssessment()}>Start my free assessment <ArrowRight aria-hidden="true" /></button>
              <span className="async-microproof">2-minute eligibility check · No appointment required</span>
            </div>
          </div>
          <div className="async-hero-card">
            <img src={DOCTOR_PORTRAIT_URL} alt="Dr. Jumana Al-Deek, a physician specializing in medical weight loss, menopause, and metabolic health" />
            <div className="async-doctor-note"><strong>Meet Dr. Jumana Al-Deek, DO</strong><span>Medical weight loss · Perimenopause · Menopause · Metabolic health</span></div>
          </div>
        </section>

        <div className="async-proofstrip">
          <div className="async-wrap async-proofgrid">
            <div className="async-proofitem"><CheckCircle2 aria-hidden="true" /> Direct care with Dr. Al-Deek</div>
            <button className="async-proofitem async-proof-link" type="button" onClick={openChat}><ExternalLink aria-hidden="true" /> See a sample doctor chat</button>
            <div className="async-proofitem"><Clock3 aria-hidden="true" /> Review within 24 hours</div>
            <div className="async-proofitem"><DollarSign aria-hidden="true" /> Prices before you pay</div>
          </div>
        </div>

        <section className="async-wrap async-credentials" aria-label="Physician and platform credentials">
          <div><BadgeCheck aria-hidden="true" /><span><strong>Board-Certified DO</strong>Dr. Jumana Al-Deek</span></div>
          <div><MapPinned aria-hidden="true" /><span><strong>Licensed in 12 states</strong>100% virtual care where available</span></div>
          <a href="https://www.legitscript.com/websites/?checker_keywords=medmethoddirect.com" target="_blank" rel="noreferrer"><ShieldCheck aria-hidden="true" /><span><strong>LegitScript Certified</strong>Verify MedMethod Direct approval</span></a>
        </section>

        <section className="async-wrap async-section">
          <div className="async-section-head"><h2>One front door.<br />Two connected paths.</h2><p>Start with the concern that feels most urgent. Your assessment still considers the full picture, because midlife symptoms rarely stay in one lane.</p></div>
          <div className="async-path-grid">
            <article className="async-path-card weight">
              <div className="async-path-art" aria-hidden="true">⌁</div>
              <div className="async-path-content"><div className="async-flow-kicker">WEIGHT CARE</div><h3>Medical weight support that accounts for hormones, too.</h3><p>Personalized options, including compounded GLP-1 medication when clinically appropriate.</p></div>
              <button className="async-text-link" type="button" onClick={() => openAssessment("weight")}>Explore weight care <ArrowRight aria-hidden="true" /></button>
            </article>
            <article className="async-path-card">
              <div className="async-path-art" aria-hidden="true">◯</div>
              <div className="async-path-content"><div className="async-flow-kicker">HORMONE CARE</div><h3>Relief that starts with understanding your symptoms.</h3><p>Hot flashes, sleep, mood, brain fog, cycles, vaginal symptoms, and more.</p></div>
              <button className="async-text-link" type="button" onClick={() => openAssessment("hormone")}>Explore hormone care <ArrowRight aria-hidden="true" /></button>
            </article>
          </div>
        </section>

        <section id="async-pricing" className="async-pricing-shell async-section">
          <div className="async-wrap">
            <div className="async-section-head"><h2>Clear care pricing.<br />Medication stays separate.</h2><p>You see every layer before you decide. Your exact medication and price are confirmed with you before anything is prescribed or shipped.</p></div>
            <div className="async-price-grid">
              <article className="async-price-card featured"><div className="async-price-label">START HERE</div><div className="async-price">$49 <small>today</small></div><h3>Dr. Al-Deek’s assessment</h3><p>Dr. Al-Deek personally reviews your answers and chats with you about the next step. If medication is not clinically appropriate, the proposed $49 review fee is refunded.</p><ul className="async-ticklist"><li>Personalized review by Dr. Al-Deek</li><li>Direct clinical chat with her</li><li>First 30 days of care</li></ul></article>
              <article className="async-price-card"><div className="async-price-label">ONGOING CARE</div><div className="async-price">$49 <small>/ month</small></div><h3>One doctor. One plan.</h3><p>Continue directly with Dr. Al-Deek as your hormone, weight, and metabolic-health plan evolves. Cancel anytime.</p><ul className="async-ticklist"><li>Direct messaging &amp; refills</li><li>Lab and dose review</li><li>$50 video visits if wanted</li></ul></article>
              <article className="async-price-card"><div className="async-price-label">NO MEMBERSHIP</div><div className="async-price">$150 <small>/ visit</small></div><h3>Pay as you go</h3><p>Prefer not to join? Schedule a stand-alone follow-up with Dr. Al-Deek whenever you need one.</p><ul className="async-ticklist"><li>No monthly commitment</li><li>Medication billed separately</li></ul></article>
            </div>
            <div className="async-visit-comparison"><strong>Follow-up video visits</strong><span>Members: <b>$50 per visit</b></span><span>Without membership: <b>$150 per visit</b></span></div>
            <p className="async-price-note">Medication prices shown inside the assessment are prototype placeholders. Replace them with MedMethod Direct’s contracted pharmacy rates before launch.</p>
          </div>
        </section>

        <section id="async-how" className="async-wrap async-section">
          <div className="async-section-head"><h2>Care that comes to you.</h2><p>No scheduling bottleneck. No wondering who is on the other side.</p></div>
          <div className="async-steps">
            {[['01', 'Tell us what’s changed', 'Take a short, adaptive assessment built around your symptoms and goals.'], ['02', 'See your options', 'Browse medication choices and monthly prices before you commit.'], ['03', 'Dr. Al-Deek reviews', 'She personally evaluates your history, then chats with you to confirm the right path.'], ['04', 'Continue with her', 'Review your prescription and exact cost, then stay connected as your plan evolves.']].map(([number, title, copy]) => (
              <article className="async-step" key={number}><div className="async-num">{number}</div><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
        </section>

        <section className="async-wrap async-chat-section async-section">
          <div className="async-chat-copy">
            <div className="async-eyebrow">Direct chat with Dr. Al-Deek</div>
            <h2>See what happens after you pay.</h2>
            <p>Your $49 starts a real clinical review with Dr. Al-Deek—not a generic report or a handoff to a faceless provider. She reads your intake, asks follow-up questions, and explains the recommendation in a private message thread.</p>
            <ol className="async-chat-steps">
              <li><span>01</span><span><strong>Finish your clinical intake</strong><small>Share the history and details your doctor needs for a safe review.</small></span></li>
              <li><span>02</span><span><strong>Hear directly from your doctor</strong><small>Answer follow-up questions and add context without scheduling a visit.</small></span></li>
              <li><span>03</span><span><strong>Review the plan before anything moves</strong><small>See the recommendation, medication price, and next steps in the same thread.</small></span></li>
            </ol>
          </div>
          <SampleChat />
        </section>

        <section className="async-wrap async-quote-section async-section">
          <blockquote>“The prescription is only the beginning. The right plan should evolve with your symptoms, response, health, and goals.”<footer>Dr. Jumana Al-Deek, DO · Medical Director</footer></blockquote>
        </section>

        <section id="async-faq" className="async-wrap async-section">
          <div className="async-section-head"><h2>Questions, answered.</h2></div>
          <div className="async-faq">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return (
                <div className="async-faq-item" key={question}>
                  <button className="async-faq-q" type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : index)}><span>{question}</span><span aria-hidden="true">{isOpen ? "−" : "+"}</span></button>
                  {isOpen && <div className="async-faq-a">{answer}</div>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="async-wrap async-section">
          <div className="async-final-cta"><div><h2>Start with your story.</h2><p>See the path and prices before deciding whether to continue.</p></div><button className="async-btn async-btn-primary" type="button" onClick={() => openAssessment()}>Start my assessment</button></div>
        </section>
      </main>

      <footer className="async-site-footer"><div className="async-wrap"><div><p><strong>Prototype treatment journey.</strong> This interactive demo does not collect, save, transmit, or charge anything. Do not enter real medical or payment information.</p><p>Treatment requires clinician review. Availability varies by state.</p></div><div className="async-source-links"><a href="/">Current site</a></div></div></footer>

      {chatOpen && (
        <div className="async-overlay" role="dialog" aria-modal="true" aria-labelledby="async-chat-title" onMouseDown={(event) => { if (event.target === event.currentTarget) closeChat(); }}>
          <div className="async-flow-panel async-chat-panel" ref={chatPanelRef}>
            <div className="async-flow-top"><span /><strong id="async-chat-title">A sample physician chat</strong><button ref={chatCloseRef} className="async-icon-btn" type="button" aria-label="Close sample chat" onClick={closeChat}><X /></button></div>
            <div className="async-flow-scroll"><div className="async-flow-inner"><SampleChat /></div></div>
          </div>
        </div>
      )}

      {assessmentOpen && (
        <div className="async-overlay" role="dialog" aria-modal="true" aria-labelledby="async-assessment-title" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAssessment(); }}>
          <div className="async-flow-panel" data-asynchronous-assessment ref={assessmentPanelRef}>
            <div className="async-demo-ribbon">Interactive prototype · no data or payment is submitted</div>
            <div className="async-flow-top">
              <button className="async-icon-btn" type="button" aria-label="Go back" style={{ visibility: step === 0 ? "hidden" : "visible" }} onClick={() => moveToStep(step - 1)}><ArrowLeft /></button>
              <strong id="async-assessment-title">Your assessment</strong>
              <button ref={assessmentCloseRef} className="async-icon-btn" type="button" aria-label="Close assessment" onClick={closeAssessment}><X /></button>
            </div>
            <div className="async-progress" aria-label={`Step ${step + 1} of 11`}><span style={{ width: `${((step + 1) / 11) * 100}%` }} /></div>
            <div className="async-flow-scroll" ref={scrollRef}><div className="async-flow-inner">{renderAssessmentStep()}</div></div>
            {step < 10 && (
              <div className="async-flow-footer">
                <button className="async-btn async-btn-secondary" type="button" style={{ visibility: step === 0 ? "hidden" : "visible" }} onClick={() => moveToStep(step - 1)}>Back</button>
                <button className="async-btn async-btn-primary" type="button" disabled={nextDisabled} onClick={() => moveToStep(step + 1)}>{step === 5 ? "Continue to clinical intake" : step === 9 ? "Finish assessment" : "Continue"}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
