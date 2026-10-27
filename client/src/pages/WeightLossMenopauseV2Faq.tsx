import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import {
  V2_FAQ_CATEGORIES,
  V2_FAQ_CLOSING_TEXT,
  V2_FAQ_LEFT_TEXT,
} from "./WeightLossMenopauseV2FaqData";
import "./WeightLossMenopauseV2Faq.css";

const DEFAULT_OPEN_QUESTIONS = ["cost-0", "cost-2", "visits-0"];

export default function WeightLossMenopauseV2Faq({ intakeHref }: { intakeHref: string }) {
  const [selectedCategory, setSelectedCategory] = useState("cost");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DEFAULT_OPEN_QUESTIONS.map(id => [id, true])),
  );
  const sectionRef = useRef<HTMLElement>(null);
  const ctaSlotRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [pinnedCta, setPinnedCta] = useState<CSSProperties | undefined>();

  // The existing V2 shell clips horizontal overflow, which prevents native sticky
  // positioning. Pin only this CTA, bounded by this FAQ, without altering that shell.
  useEffect(() => {
    let frame: number | null = null;
    const desktop = window.matchMedia("(min-width: 901px)");
    const header = document.querySelector<HTMLElement>(".wlm-v2-page > header");
    const update = () => {
      frame = null;
      const section = sectionRef.current;
      const slot = ctaSlotRef.current;
      const questions = questionsRef.current;
      const cta = ctaRef.current;
      if (!desktop.matches || !section || !slot || !questions || !cta) {
        setPinnedCta(undefined);
        return;
      }
      const rect = slot.getBoundingClientRect();
      const bottom = questions.getBoundingClientRect().bottom;
      const top = Math.max(0, header?.getBoundingClientRect().bottom ?? 0) + 16;
      const shouldPin = rect.top < top && bottom > top;
      const next: CSSProperties | undefined = shouldPin
        ? { position: "fixed", left: rect.left, top: Math.min(top, bottom - cta.offsetHeight - 24), width: rect.width, zIndex: 30 }
        : undefined;
      setPinnedCta(previous =>
        previous?.left === next?.left && previous?.top === next?.top && previous?.width === next?.width && previous?.position === next?.position
          ? previous
          : next,
      );
    };
    const queueUpdate = () => { if (frame === null) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    desktop.addEventListener("change", queueUpdate);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(queueUpdate) : null;
    if (sectionRef.current) observer?.observe(sectionRef.current);
    if (ctaSlotRef.current) observer?.observe(ctaSlotRef.current);
    if (questionsRef.current) observer?.observe(questionsRef.current);
    if (header) observer?.observe(header);
    update();
    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      desktop.removeEventListener("change", queueUpdate);
      observer?.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

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
    tabRefs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  }

  return (
    <section className="section wave-top wave-surface" id="faq" ref={sectionRef} data-v2-final-faq="" aria-labelledby="v2-faq-title">
      <div className="container faq-layout">
        <div className="section-heading">
          <span className="section-kicker">Questions, answered</span>
          <h2 id="v2-faq-title">What to know before you begin.</h2>
          <p>{V2_FAQ_LEFT_TEXT}</p>
          <div className="v2-faq-cta-slot" ref={ctaSlotRef}>
            <a className="btn v2-faq-start" href={intakeHref} ref={ctaRef} style={pinnedCta}>Start your free visit</a>
          </div>
        </div>
        <div className="v2-faq-content" ref={questionsRef}>
          <div className="v2-faq-tabs" role="tablist" aria-label="FAQ categories">
            {V2_FAQ_CATEGORIES.map((category, index) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={`v2-faq-tab-${category.id}`}
                aria-selected={selectedCategory === category.id}
                aria-controls={`v2-faq-panel-${category.id}`}
                tabIndex={selectedCategory === category.id ? 0 : -1}
                ref={node => { tabRefs.current[index] = node; }}
                onClick={() => setSelectedCategory(category.id)}
                onKeyDown={event => moveTab(event, index)}
              >{category.label}</button>
            ))}
          </div>
          {V2_FAQ_CATEGORIES.map(category => {
            const expanded = Boolean(expandedCategories[category.id]);
            return (
              <div
                key={category.id}
                className="v2-faq-panel"
                id={`v2-faq-panel-${category.id}`}
                role="tabpanel"
                aria-labelledby={`v2-faq-tab-${category.id}`}
                hidden={selectedCategory !== category.id}
                data-faq-category={category.id}
                tabIndex={0}
              >
                <h3 className="v2-faq-category-title">{category.title}</h3>
                <div className="faq-list" id={`v2-faq-questions-${category.id}`}>
                  {category.items.map((item, index) => {
                    const id = `${category.id}-${index}`;
                    return (
                      <details
                        key={id}
                        data-faq-question={id}
                        hidden={index >= 3 && !expanded}
                        open={Boolean(openQuestions[id])}
                        onToggle={event => {
                          const open = event.currentTarget.open;
                          setOpenQuestions(previous => previous[id] === open ? previous : { ...previous, [id]: open });
                        }}
                      >
                        <summary>{item.question}</summary>
                        <p>{item.answer}</p>
                      </details>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="btn secondary v2-faq-show-all"
                  aria-expanded={expanded}
                  aria-controls={`v2-faq-questions-${category.id}`}
                  onClick={() => setExpandedCategories(previous => ({ ...previous, [category.id]: !expanded }))}
                >{expanded ? "Show fewer" : `Show all ${category.items.length} questions`}</button>
                <a className="v2-faq-category-cta" href={intakeHref}>Ready? Start your free visit →</a>
              </div>
            );
          })}
        </div>
        <div className="v2-faq-closing" aria-labelledby="v2-faq-closing-title">
          <h3 id="v2-faq-closing-title">Still have questions?</h3>
          <p>{V2_FAQ_CLOSING_TEXT}</p>
          <a className="btn v2-faq-closing-start" href={intakeHref}>Start your free visit</a>
          <a className="v2-faq-closing-phone" href="tel:+18883627011">(888) 362-7011</a>
        </div>
      </div>
    </section>
  );
}
