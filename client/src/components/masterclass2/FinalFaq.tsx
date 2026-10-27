import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import {
  V2_FAQ_CATEGORIES,
  V2_FAQ_CLOSING_TEXT,
  V2_FAQ_LEFT_TEXT,
} from "@/pages/WeightLossMenopauseV2FaqData";
import "./FinalFaq.css";

const DEFAULT_OPEN_QUESTIONS = ["cost-0", "cost-2", "visits-0"];

function headerBottom() {
  return Math.max(0, ...Array.from(document.querySelectorAll<HTMLElement>("header, [data-site-header]")).map(header => {
    const rect = header.getBoundingClientRect();
    const position = getComputedStyle(header).position;
    return header.getClientRects().length && rect.top <= 1 && (position === "fixed" || position === "sticky") ? rect.bottom : 0;
  }));
}

export default function FinalFaq({ intakeHref }: { intakeHref: string }) {
  const [selectedCategory, setSelectedCategory] = useState("cost");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DEFAULT_OPEN_QUESTIONS.map(id => [id, true])),
  );
  const sectionRef = useRef<HTMLElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  const chipSlotRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const ctaSlotRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const collapseTarget = useRef<string | null>(null);
  const [pinnedCta, setPinnedCta] = useState<CSSProperties>();
  const [pinnedChips, setPinnedChips] = useState<CSSProperties>();
  const [chipHeight, setChipHeight] = useState<number>();

  // The existing article clips overflow. Bounded fixed positioning provides
  // sticky controls without changing the article or any other page section.
  useEffect(() => {
    let frame: number | null = null;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const same = (a: CSSProperties | undefined, b: CSSProperties | undefined) =>
      a?.position === b?.position && a?.left === b?.left && a?.top === b?.top && a?.width === b?.width;
    const update = () => {
      frame = null;
      const questions = questionsRef.current;
      const slot = chipSlotRef.current;
      const chips = chipsRef.current;
      if (!questions || !slot || !chips) return;
      const top = headerBottom() + 12;
      const bottom = questions.getBoundingClientRect().bottom;
      const chipRect = slot.getBoundingClientRect();
      const height = chips.offsetHeight;
      setChipHeight(previous => previous === height ? previous : height);
      const chipStyle: CSSProperties | undefined = chipRect.top < top && bottom > top
        ? { position: "fixed", top: Math.min(top, bottom - height), left: chipRect.left, width: chipRect.width, zIndex: 35 }
        : undefined;
      setPinnedChips(previous => same(previous, chipStyle) ? previous : chipStyle);
      const ctaSlot = ctaSlotRef.current;
      const cta = ctaRef.current;
      const ctaRect = ctaSlot?.getBoundingClientRect();
      const ctaStyle: CSSProperties | undefined = desktop.matches && cta && ctaRect && ctaRect.top < top && bottom > top
        ? { position: "fixed", top: Math.min(top, bottom - cta.offsetHeight - 24), left: ctaRect.left, width: ctaRect.width, zIndex: 30 }
        : undefined;
      setPinnedCta(previous => same(previous, ctaStyle) ? previous : ctaStyle);
    };
    const queueUpdate = () => { if (frame === null) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    window.addEventListener("pageshow", queueUpdate);
    desktop.addEventListener("change", queueUpdate);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(queueUpdate) : null;
    [sectionRef.current, questionsRef.current, chipSlotRef.current, chipsRef.current, ctaSlotRef.current,
      ...Array.from(document.querySelectorAll<HTMLElement>("header, [data-site-header]"))].forEach(node => { if (node) observer?.observe(node); });
    update();
    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      window.removeEventListener("pageshow", queueUpdate);
      desktop.removeEventListener("change", queueUpdate);
      observer?.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const category = collapseTarget.current;
    if (!category) return;
    collapseTarget.current = null;
    const frame = requestAnimationFrame(() => {
      const title = document.getElementById(`mc-faq-category-${category}`);
      if (!title) return;
      const offset = headerBottom() + (chipsRef.current?.offsetHeight ?? 0) + 28;
      window.scrollTo({
        top: Math.max(0, title.getBoundingClientRect().top + window.scrollY - offset),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [expandedCategories]);

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % V2_FAQ_CATEGORIES.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + V2_FAQ_CATEGORIES.length) % V2_FAQ_CATEGORIES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = V2_FAQ_CATEGORIES.length - 1;
    else return;
    event.preventDefault();
    setSelectedCategory(V2_FAQ_CATEGORIES[next].id);
    tabRefs.current[next]?.focus({ preventScroll: true });
  }

  return (
    <section id="masterclass-faq" ref={sectionRef} data-masterclass-final-faq="" aria-labelledby="mc-faq-title">
      <div className="mc-faq-layout">
        <div className="mc-faq-intro">
          <span className="mc-faq-kicker">Questions, answered</span>
          <h2 id="mc-faq-title">What to know before you begin.</h2>
          <p>{V2_FAQ_LEFT_TEXT}</p>
          <div className="mc-faq-cta-slot" ref={ctaSlotRef}>
            <a className="mc-faq-button mc-faq-start" href={intakeHref} ref={ctaRef} style={pinnedCta}>Start your free visit</a>
          </div>
        </div>
        <div className="mc-faq-content" ref={questionsRef}>
          <div className="mc-faq-chip-slot" ref={chipSlotRef} style={{ height: chipHeight }}>
            <div className="mc-faq-tabs" ref={chipsRef} style={pinnedChips} role="tablist" aria-label="FAQ categories">
              {V2_FAQ_CATEGORIES.map((category, index) => (
                <button key={category.id} type="button" role="tab" id={`mc-faq-tab-${category.id}`}
                  aria-selected={selectedCategory === category.id} aria-controls={`mc-faq-panel-${category.id}`}
                  tabIndex={selectedCategory === category.id ? 0 : -1}
                  ref={node => { tabRefs.current[index] = node; }}
                  onClick={() => setSelectedCategory(category.id)} onKeyDown={event => moveTab(event, index)}
                >{category.label}</button>
              ))}
            </div>
          </div>
          {V2_FAQ_CATEGORIES.map(category => {
            const expanded = Boolean(expandedCategories[category.id]);
            return (
              <div key={category.id} className="mc-faq-panel" id={`mc-faq-panel-${category.id}`}
                role="tabpanel" aria-labelledby={`mc-faq-tab-${category.id}`} hidden={selectedCategory !== category.id}
                data-faq-category={category.id} tabIndex={0}>
                <h3 className="mc-faq-category-title" id={`mc-faq-category-${category.id}`}>{category.title}</h3>
                <div className="mc-faq-list" id={`mc-faq-questions-${category.id}`}>
                  {category.items.map((item, index) => {
                    const id = `${category.id}-${index}`;
                    return (
                      <details key={id} data-faq-question={id} hidden={index >= 3 && !expanded} open={Boolean(openQuestions[id])}
                        onToggle={event => {
                          const open = event.currentTarget.open;
                          setOpenQuestions(previous => previous[id] === open ? previous : { ...previous, [id]: open });
                        }}>
                        <summary>{item.question}</summary>
                        <p>{item.answer}</p>
                      </details>
                    );
                  })}
                </div>
                <button type="button" className="mc-faq-show-all" aria-expanded={expanded}
                  aria-controls={`mc-faq-questions-${category.id}`}
                  onClick={() => {
                    if (expanded) collapseTarget.current = category.id;
                    setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }));
                  }}>{expanded ? "Show fewer" : `Show all ${category.items.length} questions`}</button>
                <a className="mc-faq-category-cta" href={intakeHref}>Ready? Start your free visit →</a>
              </div>
            );
          })}
        </div>
        <div className="mc-faq-closing" aria-labelledby="mc-faq-closing-title">
          <h3 id="mc-faq-closing-title">Still have questions?</h3>
          <p>{V2_FAQ_CLOSING_TEXT}</p>
          <a className="mc-faq-button mc-faq-closing-start" href={intakeHref}>Start your free visit</a>
          <a className="mc-faq-closing-phone" href="tel:+18883627011">(888) 362-7011</a>
        </div>
      </div>
    </section>
  );
}
