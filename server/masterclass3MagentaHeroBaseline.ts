const PATH = "client/src/pages/Masterclass3.tsx";
export const OLD_BANNER = '        <div data-masterclass-video-first-banner className="bg-gradient-to-r from-[#e72e91] via-[#b92b92] to-[#5d237b] px-5 py-4 text-center text-[11px] font-black uppercase tracking-[0.14em] text-white sm:px-10 sm:py-5 sm:text-sm">\n          FREE ON-DEMAND MASTERCLASS\n        </div>\n';
const HERO = '        <section data-masterclass-video-first-hero className="relative isolate overflow-hidden bg-[#fff9fb] px-5 pt-4 pb-3 text-center sm:px-10 sm:pt-8 sm:pb-4 lg:px-16">\n';
export const OLD_COLOR = 'text-[#24102d] sm:text-[2.8rem] lg:text-[3.35rem]';
export const NEW_COLOR = 'text-[#9d1768] sm:text-[2.8rem] lg:text-[3.35rem]';
export const OLD_SUB = "Understand why it's happening — how your estrogen levels have everything to do with it — and what actually helps. Watch the video now.";
export const NEW_SUB = "Understand why it's happening — how your estrogen levels have everything to do with it — and what actually helps. Watch the free video now.";
export function beforeMasterclass3MagentaHero(path: string, source: string): string {
  if (path !== PATH || !source.includes(NEW_COLOR)) return source;
  for (const text of [NEW_COLOR, NEW_SUB, HERO]) {
    if (source.split(text).length !== 2) throw new Error("V3 magenta hero inverse requires all three exact approved changes");
  }
  if (source.includes("data-masterclass-video-first-banner")) throw new Error("V3 magenta hero inverse requires the banner removed");
  return source.replace(NEW_COLOR, OLD_COLOR).replace(NEW_SUB, OLD_SUB).replace(HERO, OLD_BANNER + HERO);
}
