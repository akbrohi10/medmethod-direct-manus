import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const intakePath = resolve(import.meta.dirname, "../client/intake/index.html");
const stylesheetPath = resolve(import.meta.dirname, "../client/public/intake/weight-care-uploads.css");
const scalePhotoBaseline = "function MmdScalePhoto({uploadRef:e,onChange:t,onBusyChange:n,onSkip:v}){let r=(0,l.useRef)(null),i=(0,l.useRef)(null),[a,o]=(0,l.useState)(null),[s,c]=(0,l.useState)(``),[u,d]=(0,l.useState)(!1),f=(0,l.useRef)(!0);(0,l.useEffect)(()=>{f.current=!0;return()=>{f.current=!1,i.current?.abort(),n(!1)}},[n]);let p=async h=>{let g=h?.[0];if(u||!g)return;if(!MmdUploadAllowed(g,`scale`))return void c(`Choose a JPG, PNG, or HEIC image.`);if(g.size>10485760)return void c(`The photo must be 10 MB or smaller.`);c(``),o(null),d(!0),n(!0);let _=new AbortController;i.current=_;try{e&&(await MmdDeletePrivateUpload(e,!0),t(null));let n=await MmdUploadPrivateFile(g,`scale`,_.signal);if(!_.signal.aborted&&f.current)t(n)}catch(e){_.signal.aborted||f.current&&(o(g),c(MmdUploadError(e,`We couldn't upload that photo.`)))}finally{f.current&&(i.current=null,d(!1),n(!1))}},m=e=>{let t=Array.from(e.target.files??[]);e.target.value=``,p(t)},h=()=>{i.current?.abort(),a&&o(null),e&&(t(null),void MmdDeletePrivateUpload(e)),c(``)};return(0,M.jsxs)(`section`,{className:`scale-photo`,'data-hj-suppress':!0,\"aria-label\":`Scale photo upload`,children:[(0,M.jsx)(`p`,{children:`Please upload a photo of yourself standing on a digital scale showing your current weight. Make sure both feet and the weight displayed on the scale are clearly visible in the photo.`}),(0,M.jsxs)(`figure`,{className:`scale-example`,'data-hj-suppress':!0,children:[(0,M.jsx)(`figcaption`,{children:`Example`}),(0,M.jsx)(`img`,{src:`/manus-storage/intake-scale-example-original_dffe4759.png`,alt:`Example of both feet on a digital scale with the weight visible`})]}),(0,M.jsx)(`input`,{ref:r,type:`file`,accept:MmdUploadAccept(`scale`),tabIndex:-1,\"aria-hidden\":!0,style:{display:`none`},onChange:m}),e?(0,M.jsxs)(`div`,{className:`scale-photo-preview`,'data-hj-suppress':!0,children:[(0,M.jsx)(`img`,{src:`/api/intake/uploads/${encodeURIComponent(e.upload_id)}/preview`,alt:`Uploaded scale photo`,loading:`eager`,decoding:`async`}),(0,M.jsx)(`span`,{className:`upload-file-name`,children:e.file_name}),(0,M.jsxs)(`div`,{className:`scale-preview-actions`,children:[(0,M.jsx)(`button`,{type:`button`,className:`secondary`,disabled:u,onClick:()=>r.current?.click(),children:`Retake`}),(0,M.jsx)(`button`,{type:`button`,className:`remove`,disabled:u,onClick:h,children:`Remove`})]})]}):(0,M.jsxs)(`div`,{className:`upload-actions`,children:[(0,M.jsx)(`button`,{type:`button`,className:`secondary`,disabled:u,onClick:()=>r.current?.click(),children:u?`Uploading\u2026`:`Take or upload a photo`}),(0,M.jsx)(`button`,{type:`button`,className:`remove`,disabled:u,onClick:()=>{if(!u){h();v?.()}},children:`Skip for now`})]}),u&&(0,M.jsx)(`p`,{className:`upload-status`,role:`status`,children:`Uploading securely\u2026`}),s&&(0,M.jsxs)(`div`,{className:`upload-file-row`,'data-hj-suppress':!0,children:[(0,M.jsxs)(`div`,{children:[a&&(0,M.jsx)(`span`,{className:`upload-file-name`,children:a.name}),(0,M.jsx)(`p`,{className:`upload-error`,role:`alert`,children:s})]}),a&&(0,M.jsx)(`button`,{type:`button`,className:`secondary`,disabled:u,onClick:()=>p([a]),children:`Retry`})]})]})}";
const existingUploadStylesLength = 2670;

function component(source: string, name: string) {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf("function ", start + 10);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return source.slice(start, end);
}

function selectors(css: string) {
  return [...css.matchAll(/(?:^|[{}])\s*([^@{}][^{}]*)\{/g)].flatMap((match) =>
    match[1].split(",").map((selector) => selector.trim()).filter((selector) => selector && !selector.startsWith("@")),
  );
}

describe("intake scale-photo layout", () => {
  it("changes only the approved image path and button classes while preserving the upload component", () => {
    const scalePhoto = component(readFileSync(intakePath, "utf8"), "MmdScalePhoto");
    const examplePath = 'src:`/api/intake/assets/scale-example.jpg`,alt:`Example of both feet on a digital scale with the weight visible`,onError:e=>{let t=e.currentTarget;t.getAttribute(`src`)!==`https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/CkjwARGtcsaSNmuw.jpg`&&(t.src=`https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/CkjwARGtcsaSNmuw.jpg`)}';
    const primaryUpload = "className:`primary`,disabled:u,onClick:()=>r.current?.click(),children:u?`Uploading…`:`Take or upload a photo`";
    const scaleSkip = "className:`scale-skip-link`,disabled:u,onClick:()=>{if(!u){h();v?.()}},children:`Skip for now`";

    expect(scalePhoto).toContain(examplePath);
    expect(scalePhoto).toContain(primaryUpload);
    expect(scalePhoto).toContain(scaleSkip);

    const inverseNormalized = scalePhoto
      .replace(examplePath, "src:`/manus-storage/intake-scale-example-original_dffe4759.png`,alt:`Example of both feet on a digital scale with the weight visible`")
      .replace(primaryUpload, "className:`secondary`,disabled:u,onClick:()=>r.current?.click(),children:u?`Uploading…`:`Take or upload a photo`")
      .replace(scaleSkip, "className:`remove`,disabled:u,onClick:()=>{if(!u){h();v?.()}},children:`Skip for now`");

    expect(inverseNormalized).toBe(scalePhotoBaseline);
  });

  it("activates scoped scale styling only for wScalePhoto", () => {
    const intake = readFileSync(intakePath, "utf8");
    const shell = intake.slice(intake.lastIndexOf('className:"app"'));
    const stylesheet = readFileSync(stylesheetPath, "utf8");
    const addedStyles = stylesheet.slice(existingUploadStylesLength).trim();
    const addedSelectors = selectors(addedStyles.replace(/^\/\*.*?\*\/\s*/s, ""));

    const scaleScreen = intake.slice(intake.indexOf('"id":"wScalePhoto"'), intake.indexOf('"id":"w38"'));
    expect(scaleScreen).toContain('"type":"scalePhoto"');
    expect(intake.match(/"type":"scalePhoto"/g)).toHaveLength(1);
    expect(shell).toContain('screen?.type==="scalePhoto"?"stage scale-photo-stage":"stage"');
    expect(addedStyles).not.toBe("");
    expect(addedSelectors.length).toBeGreaterThan(0);
    for (const selector of addedSelectors) {
      expect(selector).toContain("scale-photo");
    }
  });
});
