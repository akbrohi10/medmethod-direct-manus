import { createHash } from "node:crypto"; import { inverseHormoneQuizCtaPlacement } from "./fixtures/hormoneQuizCtaPlacementScope"; import { inverseHormoneQuizLetterRemoval } from "./fixtures/hormoneQuizLetterRemovalScope"; import { gunzipSync as letterRemovalGunzipSync } from "node:zlib"; import { inverseHormoneQuizDoctorIntro } from "./fixtures/hormoneQuizDoctorIntroScope"; import { gunzipSync as doctorIntroGunzipSync } from "node:zlib"; import { inverseHormoneQuizMobileTop } from "./fixtures/hormoneQuizMobileTopScope"; import { gunzipSync as mobileTopGunzipSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext, Script } from "node:vm";
import { describe, expect, it } from "vitest";
import { inverseHormoneQuizPrivacy } from "./fixtures/hormoneQuizPrivacyScope";

const root = resolve(import.meta.dirname, "..");
const baseline = "ed12f8af";
const page = "client/public/hormone-symptom-quiz.html";
const server = "server/_core/index.ts";
const helper = "server/fixtures/hormoneQuizPrivacyScope.ts";
const direct = "server/hormoneQuizPrivacy.test.ts";
const helperSHA = "589a41f28d49b6bdc2dec9149f7dbfe996bdd0f0a5389fcf1d4ee501b04fb156";
const pins: Record<string, { before: string; after: string }> = {
  [page]: { before: "24c45b7c284477614037c7a3fe305d57aeca022eba889103770a0d26c3b16f50", after: "725c507f5e87708401e0bfd133a3b3bc55060c06211f3d88a31ab4861114003f" },
  [server]: { before: "58b888efb532a6dc0165b784753cbfec632fa29f257376e96f7f03155da76bff", after: "ba14498f9ce69aa0cbd267903e9dc0325c71c8e043a031c0cdc82a705ccb5218" },
};
const policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; frame-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'";
const ancestors = "frame-ancestors https://manus.im https://*.manus.im https://manus.ai https://*.manus.ai";
const read = (p: string) => inverseHormoneQuizCtaPlacement(p, ((source: string) => { const entry = (JSON.parse(letterRemovalGunzipSync(Buffer.from("H4sIAAAAAAACA7VUS4/TMBD+K96cUqlk8350VRAg0B44AD02PTj2uA1K42A73V2q/nfG6fbBrliKBDnkkMx8j/F83joa1AbU9UqqtWzhS1//eG/o54YyWENrPAMaX9qZbB29os7EEeBXQRZGcRqEwOKg8nmRRIJWtAiiFPIk5EEVMRFFgRAs5pDxnEUVowErqsLnztgBXlvE+daRDUfIet1JZciWMAXUwC3VK7IjQsk1KZ1Wcpgw9dAZWTo32N3C3d/1kGNt3aJVDbcnr5/AGFBfYS03tDkBeNeivje9An0+mF+KZ0x2YBXtxgcfTLbaENTDyZS43YRoo+p2OSLT18PXj3UDs4eWuYgrmw24SkozJt1ojJS9EXnpjE4OX0L7gxG3G19MOHruYFkbS+l5HlVLfSCeLwZquAd2xC0drC2dMbGFY3sad3xC9izQMsmxb3LkIrtn9v4jlae7pjbYV5Yt+vRE3eCE3M4i4yoI4l7NS4fXQljU0mn0KywBXToLr25Z03PQriWb+4vRCOeJ+9ASo3q4IXvxXd2ieAScTrH/MUiXLQ5GCkW+wbYiLaIcKhrlGYi8isO4YNwPIaVplkVV4GcRy7MMqqLIMXFxlRW+z8MK0pQHPOMIM3mq4XfUhzQ/UvMsDlIuaMyKMAwTQfOkgCgUKc9TQdPYr1ImWBImRZWGSZwFYRZTP/GDoEp5kVcDdds3zc1+nDiPJ3Oyn1cYTdduo9vhGK9Q51BnVkrekQ9KSYVnZKWSZtCKCPs02iVvjVQPZHb7lqxrvaaGrWxGDiSCNhpZ8Ky/ybo9HvX5RpPhgfsOmHH3Y+roEtD/u14IUJ5NvPs8T+eXoI0T65Ua7kM5G1bUPQVohFN4/G2zhSUfvvc2hAo2tez12dL/KzUX5P8lwRco3i12u58aqXWoHQYAAA==", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz letter removal test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz letter removal test SHA mismatch"); return source; })(inverseHormoneQuizLetterRemoval(p, ((source: string) => { const entry = (JSON.parse(doctorIntroGunzipSync(Buffer.from("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", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz doctor introduction test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz doctor introduction test SHA mismatch"); return source; })(inverseHormoneQuizDoctorIntro(p, ((source: string) => { const entry = (JSON.parse(mobileTopGunzipSync(Buffer.from("H4sIAAAAAAACA+1bWXfbVpL+K2o9yYcZYd+cSc8hAYIk9h0g4jxgB4iV2Aggx/99IDmOncTdTmKnu8+MqKMHgfdW1a1b9dWC0o/3XdSOUQukdVvWVaQO2cLUQV+3p6pv68c+6vrHvrt//eN9l3r3r+8Dj4IJNAxhCicoMPQRNPAINEAgxCe9CIIiH4uIGEdDiiDQyCciEkQ8IkDxyMNDH/buv7mPwuyJ4vc/3tdFuJLMyqZu+7sf74I28vro6HXp3du7uK3Luzf3VR1Gr4N2bvr6zf236+4quv2xPXc/r82q9aRddPxwVLH2syIy6ubD5kcgzqZ+aKPuY538vFAP6iZ6kuTtN+/lD+qq6+9WOcK77+4emtd3Xd9mVfLq7ru/Pz9l1536XAUPK826GKOHtq77b+6aV9+s7IY+Jt/cv/pwsn9G7Z8c4KH55ncze/Vb6ZOsf2L3+PjotUn3nun3PzyzjaYo+Jnum/t17Zv7b+6eFn7zdAO38PXdOy5RFdThuu/1z7zu3v7maH8hq8euKbJ+3ffmTbWe8zHOij5qH5onyuv1x3cPf/v+zX2YxfET1Tf3Rfdf65Koe3P/w2NWBcUQRt3DE7PvwR9evVr1udpBdde3Q/Tt3Tvhm6xahV8Jfvfduv8n3/m8wawutAr4P+uWAEXjkIoCKiZ8MoZwEIZwL8BRkEACEAc9CvdgHyHJgISD1bXAGA9QwidCDIrxyA/ClczrX/P/FNv3nvsTWwyDiJVwHMQQSpCkF4cejscYHEF+DCERCMarQyMoThJkAHkgDMIBHEI4BcOID6EI9sy2Gori23dqXPXwK/08PU5XN3x4ssKHZlXf31YZn9f1aVvf7vZtW7fr3TyJeVc+y3nXr573ZNTVCjjznX7c3pVZV3p9kD75xHsGsVd0K4f1fi91Vv18vR9b8d3zJ5qaKOgf3qmn8ZJoPftuiOOofXzy7off+s9HWPfkQcHQtqswj32tP1vlwwefebUq4Kevn9xpXbK/Dl7x0LTRmNVD95GdfyVhPuPt/0zW3yHs2x/efvMJAxKifnUZLSrr0St+C/8rjHsrwvt4iOBoFEFwQHhESOJEEKzW5EEYiYMgRWIhGcEoAUUICAakHxERjEEggoRfBv//DMo/Ut7nwPyjpT/D+VcOLF8mzV8Tsj5QTYZqyZonjL3zup98cV14+PD4l0deisz//THvs4b9B+LUn4uKv+L38NDVQxtEv9j140+IvrrICj0rUU6XpcfGWyk9fEIjDx+77pv7I9qdtu8+9JawzBkmfHHHkOz5XB2crTXqC8f0c6ZZcp5OKE/BPqZyrFCiZnfNdEu7IUCEhTCw3+kNXal4dumXbpGJMmUEN/VFLmj9FaNTb0NtxkIL8FjCqLN7NK43odJt4+KbbZqFpkgcdHfP5edlOaczJ3cgyi98NJVFKNbp5boP1Zm5GSgunGoaTy4sZ5P07VjUHX52tJOqZ4osUSqiZntL7uUDGMDprk+Ycv3a3fe56Y26afmCzdCLqVTh3h47YWAHAmhPQehBEZ+zJSbXCKH1dpuUG0xeokNhKdEgwYyiGLm9tJfhRo8ukwD4YOP9CU+ZnM65ISmn5ZrCss4YPTEgFbFbqJ6ZtwwLBbdhB4a1pBvB+VQgo8tW2s0u54LaRQeaqdMrWR6WyRkhQwZRK53FRT/mlyqbwB7ZigBanE1v7nBOwG44E9642c2X26mHbgLB5cHQVSAMV5ucLhGHP4WUFTpZxbPmRRWNcIe60ExxAXMYr+xOj3qdl8azVNR0j9OcKdgUvjX8m6tItahlSYUkR8E5lOk8zCy1adjOvKBHnQfOgLuJld35pKko03eolZeTdkHtnQvxkUjqAx+QxixkjXaMAuMgm+O1pyesdGjRyrSlSi3oZHrTwh/LbbkvDaAANKQ/EZnSezvVoekZuwhyJnC5KYhAwZ8OaFHteVNXJ/BQ2gXocOfpXJjBydhH8YXbV628748ydV2t8dqOZ6S+TRIAyJ01XZibNaWgJ5Gs1y/W4DpauDG8wwG6SRBa2hEF7uuYI8E4RBOgSoJpQBoZ6sqx3IhNhebbxLZlbRvHhOON8CARCz97xG6DEihNnGFKnriI6Y5I3dzO6gYJjgvALWvOMdPRgRSzpAyrAR7ES1q49fagHAk4CHgdn0jKQwX5xiP6aMAEiZA5llBNDFYtT2oDS429MNF0ggmbnbrdvsvrfK+LcPQJQT4VHZ8wT4uCug3/+x0erKnlGt3eo8O3d88R6vXdjyvUfXi44tD7P95+/8Pbv7/6vvnhp2ToGUJ+TofeYc23d3Hd3j38hDF3dXz3/ZrxPq98fKb/w+Mai59w62GV6D0YFVkVdSsYvaPxq3T2HbfnJe8z2+IJyYrnDCN6XCV89VhEVdKnz7kX9LnM6ym6v0fPXyZe7/ivgrzjVnrNb1it2Uz0uGpozTSKXydma/j4OR18R+pdNvju+Kuuf5dk/ygdfK/gt68evlZB9C8uif6D6pRfZx8fSgY8QmEqBgM8hD2MDGKUjCMKRTHPx7G1UIgQDMcIaq311/QvDNb8LgBhAl1dFI3JiCCCz1Qqn+gyvC+RvrDF8LVrlfBZ0tVRVlHDIeizuvqSouWlGn6phr9ONfwCG/+PYOPLex2/KO0/3WD4A+2Qf0E/5I8L/CUtkz/fM6F7Tym8ICqfaf+6ZQKGa/EHI5BHRDgckjAag089FCyEQi9+Mk48pggYR0AUIYjQW1FpTbIRKghJFENClPzrWia/0O/n2gm/WPx7GhVfqwXyy2ZF+GHpZ9sVX7mn839cXf/Xmk6/QY8/3Ab6pPI+0wiCUcIQdwzF2pvIvBZ5vhhOm9T01qpz50orhkYGEXXzGse7VT6kUuHGbaROGODU5cTsIiKKXMZ7DKlqe9nC55kw4QOOJPocAvHWr27Hmb34eGpEzHbodq5PtBDBNbiJApXuapOqSfZUHQK6uOacOWV5vM/2iybcLs0luVqT3btuRbsYKwccE4q3bLiKBej0FwNJujwMfAYJg5NultDZ1whvf/C2cnstwnwCNa2kTpheSeegFeOoBzELSntU8MdNl07QtQnYswDhYYrAY9krZV5Jh4oadvrMjM7BZ6poydvKUEL1SpXSQog3QZ8v161tlP7ex+O9nCmWl2tli8bGheB3Gx/KlKtwxRKXrAnTz5EzqHWCnHnCrF3jpsolIkwy4Ohvzv6omQB4xavL9rQtG5vKacLeEvtgG3cZ22P2+numTs5l7IlBtoyuDHaTYRzHodSyzRwxShBfVcGXei51ILOpGFHtcva4gWHlQp/VSaDO1g531FFfjTE+W1BC9yNvJ5be4UZ6HufQT8VRo5WIcwpmX6r4MLMYyU82r5GMyyhdLI6qDsK0acon3xfrJDM7rauXo0TDZ31b71yXz3uR0Dm6T/LSbZzBZdpLJoBoxpa8igoTp6kcuqRcvrHGHYHm8uGIJq6gHU4kcRHJi5BTupZKe+DMca25O5t1cqnZZg+hZRRwEJOb6NkoBbHcuu0s4ybdDVcPg6+kHgJsrQHIdEiUhgIJ0IaWdOfVAd4vHs6O801Le/KI4fVZVfT+aPOchSz7st/VZKsIYEVuBsSllT69XGEik+bzjgc7M2MLAJJ0xCZxRBLyzYEZJu9MApHvDTkfbKtRzo7b3REJAC+cNoO5I7YKK5eSagwMGDN0E6OtSh/jiRR6hcVcciMRkKO6QyMTXRkhQOneACVhFNyBd6gEzT3QcXDJT12aH1af/O6lIfS5htCn8tT/sM7QPxTxT7WI/uzbiD//PuIlFL2EopdQ9BKKXkLRSyj6d76o3kBn2BEyPRUo1oKjQN7uiHNHxXp8Dhf6hMRZatF1mni63mi8cFQIhD8fJsTGlAEZA4p094YiHwrOwvjCwshSpVz6ZPoFe+6Ox/qskdI5i5rzPr3BisZlirjXdE2pu8VSZ29Wo/N1ix4PPM41ZHPtPH5qaPq0z5KENS47M2ES+aBxusDmoGSaWu7tk0Kzt9vcdLdhDkYcjS00Y+gGEimlfvMg3rmkcZIzW4XZ3rQTn+xOTY+5/E2NyNuMwqLhBMfbfkeTC7sYkEF4QHjzsL6yyaiQT5SGwnbtHFBc0C4paru30RbxaKIPvDPEOWzRR3m/bfIuFkQEPwHn5MaeYi4+HFYQMo08ZCZrisVi2SgG3IONQ9zOro9P8krKlMVZNw2HXfSAOUzQwSnR0qoQQIErFcoTsouZyp+E+GqpFHfbOLco5cf6uFIi0sQmNJak2lE0pb7AGo5jdMAQiO3SYqnByhrjSxxkkZupFMOxH89O2jXHJOrUocQxSs43JOZf9qlWJpS6APHNzgHkEjb5dAx6ftTRxR9Vxav5zI3OAwFc1IsJmm4oJf1mCSfVkbgFPCq5Qh9YcOEAeodCyg2SD46AGJS5gcj4sKtp67AFcE6o6dRrai9xs/LgVft5RsQ5EYT1Orjc1dxaHLaSatnpnEuefb0VKrSfWFbJhF3ugrw2tD1xiGegGxw+vuW13kDMkW1V1LRY68wV2yKDOQ2b0kDlMvvc2T3N8NcrRzPtlpxBJcIOuoTdbGZ/c5qD5ClOHOPF3vPSJcZ0DfD77bzgeiXuLhoVQ7SoLX2WIpejJYpqChh+w2xdAs2Mk2/MYK70JnnCxOP1Mh9TGdvuacJXyyXZd+j+DG5HeONtFnTBAITSi/Jy2YDMtF1tRcK37Y4O5U0BC5xa7jetDPQ94C/Z0Or0eTcf2P0cnRUI5VtxlBxptwcYUM7Ayit46oKuaYnJg6GzDUajrcbbRdxRzkbxbsBW8SdiPM6VqpjqWbeX3Q6LtmPgb8oYvGQJcwBOTUYL9HFPWqdddm1P9MmApISTzNI2IcvgrOnU8elNt1PvumNFTTjS3Qkb4hpAehPIGuy4/vCUVMkjwF4ia/EU3CtGJws1h8g0OT+ul4jzuX21jxQWHx0bxIIJuEzVGKe3GOeU0YnDwERIX3BpMUg1dtNHVZqFbJ0Vx2sNYn5EbExGZaACIYsTVTmNcBEl0a5tg6Bm0y1FhpiycN9ZveHFG8ByA1+wcshjj9ySNsJmomDOR29QA/INpBz3AWKMuCskBp0n88bkoWYbFvG8JTyM2+sWMBH7pjprY8gmN2nu9/B8KLHWGPZdbxtrUpiJfhuHzkTJRe2j1A5ejqxzjQbBK7vFwHgsti/QCXLXKA6DFDQv2QaB4tAMjvSVyPUUKdukaykPggq1J6Z6uAwG5ktJgIuYNOKBlJ5Yo4o1biQxGslwzQrsSzuFVpeWTGvg0YGDmsadRR+ZF7mHDpWf2Dxq32gT2daxV2J5QQl0yogJ5Dg5ceXwlUOJqYgsttISXRZD5SDgMIwsZFqJiVXdNefDwTKcysiKOFLaEtn4WHTQ9gVbzUVxyPIgS+3VMYJJd+yJgaidHEoWlQzeiN0kwJTbwqUp58TCQHS1QADuZhDBWyWbGAzcE/Bkx6NcZRbdWZ2KxPn5SPMY5LJw0DlBr+KC4XPtviQc06r9wz7YzIC08QsFTtmS8OzaCDY+SoQNqkSZvHA8im4xj4b8Kwz0nm6Gex+IYBLDhRlUh570wqt+djTSHYJQYRDvsJC1ZdWL3EbAOVV6HXRYWpjKYar9QCDJU+ZSsIl1SKrys6pzUzcq0E0wMYHGcWm41lGP73G50oOzlG4D1hgvRIw0wuyMT1NMyOGQ2ZQyyOczwUnwbe5xy6bMYNsziaFaGOptwXJnC+kmD714NayrH3ihH0ijNAwXHIrd83GzuMMlhGCraMdmQ5ypJLDcA+QXDtWxZHHxMdgAgUvsZ+FqFAgxmTxgZ7MDhXBOIFLSYN521t3pNLqgOEuqgMiEcw3wPaxNhTdBFufOk+bsHJKliL1KCdUJRq6YP9BCueGu8gAqGeYVi0jbF6TnwQu6bVzVYP1DtxzLfoWvVO9VNRDotb460T6ts1Z+gib8IOJl69hOWR4BaQphmKChuUMW1Tx2PCwMlMWcsxC4oj0udVqLZ/TQsLZd0lPcp3aKsBKMCfJYTJHuQoFnbbuq0sOtfsqzuWRGKQhNEvVPdcqQGFkpV0bPKw8Rlz4QyUBesYM0+YaIzBTDlaUiY38gg40Ab5hBV28hH2ku08Ao1lynQEzzNd053DR30SdnBA0OoI4bpyFAFPPATnPU8kTFk2kaHC4bl4t7ozRj8CrO7suFdyNIPfN7UnMGLcT4zSkOtQjZxzy/QQYX8Em7ykK0EJMGTiJaQDktNMW5F0XTc9Ixtcr+CJIzeTCumOgpBzjGxusxV8BKdlKZlCWWKgJJOwKLrqiAxEekpZHjCZVFjcUXm858hduZ3qm8poamFadtqiOaqp5OuY42BxcBrwA4rakJlEemnXN64/HFydyIh5zs0P6GFPvNoFo3fBNZwe1iFnXN8rWrbrgEWCRm3lDNRgnAFRZKNNyApEPtD9gGwIH02h8BIBn2VZsrm3Qc1OoWk6U+GEeiW6L4hiTjbiSNk/NSrLwMUv3pQaqXUaqXmYi/bCbi33i7v32h+0HNFE4hZOR7CElEMemjMEoFIQhHuIcTBOJDT+NMJEFEPkWREByh/noZYAj7EY6HUEh8bozpk/+T8RPrkEAhPIw9NKBgGMZij8SoCIGfTSn2cBT08SAOMBijfBzGUAJa7cEDMRCCfDykSP9r33DxLOtK4d1b8pc5uZc5uZc5uZeY8BITXmLCV4gJXz4E+fGs3qcnBr/ymOS/YE7yrzjTF01S/r5Ryrf/CwuaKM99QAAA", "base64")).toString("utf8")) as Record<string, {sha: string; edits: {old: string; new: string}[]}>)[p]; if (!entry) return source; for (const e of [...entry.edits].reverse()) { const lines = source.split("\n"); if (lines.filter(l => l === e.new).length !== 1) throw Error("Quiz mobile top test inverse mismatch"); source = lines.map(l => l === e.new ? e.old : l).join("\n"); } if (hash(source) !== entry.sha) throw Error("Quiz mobile top test SHA mismatch"); return source; })(inverseHormoneQuizMobileTop(p, readFileSync(resolve(root, p), "utf8"))))))));
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).split("\n").filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizMobileTopScope.ts" ? "c44fd9ec9f7b8f160216ac64073c060a96a2b388c82c4ca0f6c47b7d51f6ebcd" : p === "server/hormoneQuizMobileTop.test.ts" ? "5517a2bfcf14788afda66f52e1bf13e00f296346878c1a0202c2d169223b1435" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz mobile top inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizDoctorIntroScope.ts" ? "6e429f0c6d2a58cf48fe9445ab65468e3565797f6d86dc251c02742784f8e77c" : p === "server/hormoneQuizDoctorIntro.test.ts" ? "ca9274dd296790db34ca74c313b8ae11eb5e7f64d9774eb7e803a7c46ea6db2a" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz doctor introduction inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizCtaPlacementScope.ts" ? "045fb37fbf5cbcd1c0cf07f8e3ca0d84a18512b5151fd4d835835546bc26dcf8" : p === "server/hormoneQuizCtaPlacement.test.ts" ? "fe0b17234612ec41b0d953faba9136e852d1b3cf331ffc4de7d8c3bca1c9b90d" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz CTA placement inventory SHA mismatch"); return false; }).filter(p => { if (!["diff", "ls-files"].includes(args[0])) return true; const pin = p === "server/fixtures/hormoneQuizLetterRemovalScope.ts" ? "96938eba387ef8b4249cd02e6a6773b1073c877eb99812e4b7900d2be66d1d7d" : p === "server/hormoneQuizLetterRemoval.test.ts" ? "d7416dfa4c92225fa859e32f6d86fa640b6cfc5259b625471274a05011b6d98b" : null; if (!pin) return true; if (hash(read(p)) !== pin) throw Error("Quiz letter removal inventory SHA mismatch"); return false; }).join("\n");
const before = (p: string) => git("show", baseline + ":" + p);
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const lines = (s: string) => s.split("\n").filter(Boolean);
const fragments = JSON.parse(read(helper).split("\n")[1].slice("const files = ".length, -1)) as Record<string, { old: string; new: string }[]>;
const html = read(page);
const scripts = (s: string) => [...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]);
const css = (s: string) => [...s.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(m => m[0]);
const aliases = (p: string) => [p, resolve(root, p), p.replaceAll("/", "\\"), "C:\\project\\" + p.replaceAll("/", "\\"), ...(p === page ? ["dist/public/hormone-symptom-quiz.html", resolve(root, "dist/public/hormone-symptom-quiz.html"), "dist\\public\\hormone-symptom-quiz.html"] : [])];
const masks = (tag: string) => /\bdata-hj-suppress(?:\s|>)/.test(tag) && /\bdata-cs-mask(?:\s|>)/.test(tag);
function syntheticDocument() {
  const nodes: Record<string, any> = {}, stack: any[] = [];
  let serial = 0, forbiddenCalls = 0;
  const make = (id: string, tag = "div", opening = "") => {
    const classes = new Set<string>();
    const n: any = { id, tag, opening, parent: null, children: [], value: "", textContent: "", style: {}, attrs: {}, handlers: {}, classList: { add(...c: string[]) { c.forEach(x => classes.add(x)); }, remove(...c: string[]) { c.forEach(x => classes.delete(x)); }, contains(c: string) { return classes.has(c); }, toggle(c: string, force?: boolean) { if (force === true || (force === undefined && !classes.has(c))) classes.add(c); else classes.delete(c); } }, addEventListener(k: string, fn: Function) { this.handlers[k] = fn; }, setAttribute(k: string, v: string) { this.attrs[k] = v; }, removeAttribute(k: string) { delete this.attrs[k]; }, appendChild(c: any) { c.parent = this; this.children.push(c); }, focus() {}, reset() {} };
    let inner = ""; Object.defineProperty(n, "innerHTML", { get: () => inner, set: (v: string) => { inner = v; n.children = []; for (const m of v.matchAll(/\bid="([^"]+)"/g)) n.appendChild(make(m[1])); } });
    nodes[id] = n; return n;
  };
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, "");
  for (const m of markup.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
    const tag = m[1].toLowerCase(), opening = m[0];
    if (opening.startsWith("</")) { while (stack.length) if (stack.pop().tag === tag) break; continue; }
    const id = /\bid="([^"]+)"/.exec(opening)?.[1] ?? "static-" + serial++;
    const n = make(id, tag, opening); if (stack.length) stack.at(-1).appendChild(n);
    if (!/^(?:meta|link|input|img|br|hr|source|area|base|embed|wbr)$/.test(tag) && !opening.endsWith("/>")) stack.push(n);
  }
  const node = (id: string) => { if (!nodes[id]) throw Error("Unknown synthetic quiz element: " + id); return nodes[id]; };
  const denied = () => { forbiddenCalls++; throw Error("Synthetic test forbids transport or tracker calls"); };
  const env: any = { URLSearchParams, window: { location: { search: "?prefill=demo" }, scrollTo() {}, mmdQuizComplete: denied, mmdQuizReset: denied, hj: denied, CS_CONF: {}, _uxa: { push: denied } }, document: { getElementById: node, createElement: (tag: string) => make("dynamic-" + serial++, tag), addEventListener() {} }, setTimeout: () => 1, clearTimeout() {}, fetch: denied, XMLHttpRequest: denied, navigator: { sendBeacon: denied } };
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) runInNewContext(m[1], env);
  const inherited = (n: any): boolean => { for (let p = n; p; p = p.parent) if (masks(p.opening)) return true; return false; };
  return { env, node, inherited, forbiddenCalls: () => forbiddenCalls };
}

describe("Hormone quiz privacy — exact checkpoint-only capture exclusion", () => {
  it("pins both whole sources and inverses exactly thirteen approved fragments to ed12f8af for every supported path alias", () => {
    expect(Object.keys(fragments)).toEqual([page, server]); expect(fragments[page]).toHaveLength(12); expect(fragments[server]).toHaveLength(1);
    for (const p of Object.keys(pins)) {
      const original = before(p), current = read(p); expect(hash(original)).toBe(pins[p].before); expect(hash(current)).toBe(pins[p].after);
      let expected = original;
      for (const f of fragments[p]) { expect(original.split(f.old).length - 1).toBe(1); expect(current.split(f.new).length - 1).toBe(1); expected = expected.replace(f.old, f.new); }
      expect(current).toBe(expected);
      for (const alias of aliases(p)) { expect(inverseHormoneQuizPrivacy(alias, current)).toBe(original); expect(inverseHormoneQuizPrivacy(alias, original)).toBe(original); expect(inverseHormoneQuizPrivacy(alias, inverseHormoneQuizPrivacy(alias, current))).toBe(original); }
      const outside = (s: string, side: "old" | "new") => fragments[p].reduce((text, f, i) => text.replace(f[side], "APPROVED_BOUNDARY_" + i), s);
      expect(outside(current, "new")).toBe(outside(original, "old"));
    }
  });

  it("rejects missing duplicate mixed and tampered privacy fragments while never swallowing unrelated bytes or nonquiz paths", () => {
    for (const p of Object.keys(pins)) {
      const current = read(p), original = before(p);
      for (const alias of aliases(p)) {
        expect(() => inverseHormoneQuizPrivacy(alias, "")).toThrow("Quiz privacy scope mismatch");
        for (const f of fragments[p]) {
          for (const bad of [current.replace(f.new, ""), current + f.new, original + f.old, original.replace(f.old, ""), current.replace(f.new, f.new.slice(0, 1) + "UNAPPROVED" + f.new.slice(1))]) expect(() => inverseHormoneQuizPrivacy(alias, bad)).toThrow("Quiz privacy scope mismatch");
          if (fragments[p].length > 1) expect(() => inverseHormoneQuizPrivacy(alias, current.replace(f.new, f.old))).toThrow("Quiz privacy scope mismatch");
        }
        expect(inverseHormoneQuizPrivacy(alias, "UNAPPROVED\n" + current)).toBe("UNAPPROVED\n" + original);
        expect(inverseHormoneQuizPrivacy(alias, current + "\nUNAPPROVED")).toBe(original + "\nUNAPPROVED");
        expect(hash(inverseHormoneQuizPrivacy(alias, current + "\nUNAPPROVED"))).not.toBe(pins[p].before);
      }
      for (const outside of [p + ".bak", "other/" + p + ".copy", "client/intake/index.html", "client/public/other.html", "server/unrelated.ts"]) { expect(inverseHormoneQuizPrivacy(outside, current)).toBe(current); expect(inverseHormoneQuizPrivacy(outside, "")).toBe(""); }
    }
  });

  it("has eleven initial paired masks on body main quiz options contact gate form three inputs report and hidden submission data with no unmask", () => {
    const tags = html.match(/<[a-z][^>]*>/gi) ?? [];
    const targets = [/<body\b/, /<main\b/, /\bid="quiz"/, /\bid="opts"/, /\bid="gate"/, /\bid="gateForm"/, /\bid="gateName"/, /\bid="gateEmail"/, /\bid="gatePhone"/, /\bid="report"/, /\bid="submissionData"/];
    expect(targets).toHaveLength(11);
    for (const target of targets) { const selected = tags.filter(t => target.test(t)); expect(selected).toHaveLength(1); expect(masks(selected[0])).toBe(true); }
    expect(tags.filter(masks)).toHaveLength(11);
    expect(html.match(/\bdata-hj-suppress\b/g)).toHaveLength(11); expect(html.match(/\bdata-cs-mask\b/g)).toHaveLength(11);
    expect(html).not.toMatch(/data-(?:hj-allow|cs-unmask)|hj-allow|cs-unmask|data-(?:hj-suppress|cs-mask)\s*=\s*["'](?:false|0)["']/i);
    expect(scripts(html).join("\n")).not.toMatch(/(?:removeAttribute|setAttribute)\s*\(\s*["']data-(?:hj-suppress|cs-mask)|\.dataset\.(?:hjSuppress|csMask)/);
  });

  it("keeps generated single and multiselect labels selected states rerenders and report output beneath initially masked ancestors without transport", () => {
    const { env, node, inherited, forbiddenCalls } = syntheticDocument();
    expect(env.QUESTIONS).toHaveLength(32);
    for (const id of ["qText", "qHint", "secLabel", "gateName", "gateEmail", "gatePhone", "submissionData", "reportBody"]) expect(inherited(node(id)), id).toBe(true);
    env.pos = env.order.indexOf("age"); env.render(); expect(node("opts").children.length).toBeGreaterThan(0);
    for (const button of node("opts").children) { expect(button.innerHTML).toContain("<span>"); expect(inherited(button)).toBe(true); }
    node("opts").children[0].handlers.click(); expect(node("opts").children[0].attrs["aria-pressed"]).toBe("true");
    env.pos = env.order.indexOf("weird"); env.render(); const selected = node("opts").children.find((b: any) => b.attrs["aria-pressed"] === "true"); expect(selected).toBeDefined(); expect(inherited(selected)).toBe(true);
    selected.handlers.click(); env.render(); for (const button of node("opts").children) expect(inherited(button)).toBe(true);
    env.renderReport(); expect(node("reportBody").innerHTML).toContain("Your five drivers"); expect(inherited(node("reportBody"))).toBe(true);
    node("submissionData").textContent = JSON.stringify({ name: "Synthetic local only", answers: { weird: [0] } }); expect(inherited(node("submissionData"))).toBe(true);
    expect(forbiddenCalls()).toBe(0);
  });

  it("pins identical CSP and no-referrer before script execution on GET and implicit HEAD for both original routes and the existing static html alias", () => {
    const source = read(server), fragment = fragments[server][0].new;
    expect(source.split(fragment).length - 1).toBe(1);
    expect(fragment).toContain('app.get(["/hormone-symptom-quiz", "/hormone-symptom-quiz/", "/hormone-symptom-quiz.html"], (_req, res) => {');
    expect(fragment).toContain('res.setHeader("Content-Security-Policy", "' + policy + "; " + ancestors + '");');
    expect(fragment).toContain('res.setHeader("Referrer-Policy", "no-referrer");');
    expect(fragment.indexOf('res.setHeader("Content-Security-Policy"')).toBeLessThan(fragment.indexOf("res.sendFile(hormoneSymptomQuizHtml)"));
    expect(source.indexOf(fragment)).toBeLessThan(source.indexOf("app.use(crawlerMiddleware)")); expect(source.indexOf(fragment)).toBeLessThan(source.indexOf("await setupVite(app, server)"));
    expect(html.split('<meta http-equiv="Content-Security-Policy" content="' + policy + '" />')).toHaveLength(2);
    expect(html.split('<meta name="referrer" content="no-referrer" />')).toHaveLength(2);
    expect(html.indexOf('http-equiv="Content-Security-Policy"')).toBeLessThan(html.indexOf("<script"));
    expect(html.indexOf('name="referrer"')).toBeLessThan(html.indexOf("<script"));
    expect(inverseHormoneQuizPrivacy(server, source)).toBe(before(server));
  });

  it("fails closed for known Hotjar and ContentSquare remote scripts connect beacons images frames workers and objects while preserving same-origin transport and fonts", () => {
    const directives = Object.fromEntries(policy.split("; ").map(d => { const [key, ...values] = d.split(" "); return [key, values]; }));
    expect(directives).toEqual({ "default-src": ["'self'"], "script-src": ["'self'", "'unsafe-inline'"], "connect-src": ["'self'"], "img-src": ["'self'", "data:", "blob:"], "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], "font-src": ["'self'", "https://fonts.gstatic.com", "data:"], "frame-src": ["'none'"], "worker-src": ["'none'"], "object-src": ["'none'"], "base-uri": ["'self'"], "form-action": ["'self'"] });
    const allowed = (directive: string, url: string) => (directives[directive] ?? directives["default-src"]).some(value => value === "'self'" ? new URL(url).origin === "https://medmethoddirect.com" : value === "'none'" || value === "'unsafe-inline'" ? false : value.endsWith(":") ? url.startsWith(value) : new URL(url).origin === value);
    for (const host of ["static.hotjar.com", "script.hotjar.com", "in.hotjar.com", "vc.hotjar.io", "ws.hotjar.com", "vars.hotjar.com", "t.contentsquare.net", "c.contentsquare.net", "cs.contentsquare.net", "b.contentsquare.net", "u.contentsquare.net", "cdn.contentsquare.net", "contentsquare.com"]) for (const directive of ["script-src", "connect-src", "img-src", "frame-src", "worker-src", "object-src"]) expect(allowed(directive, "https://" + host + "/capture"), directive + ":" + host).toBe(false);
    for (const directive of ["script-src", "connect-src", "img-src"]) expect(allowed(directive, "https://medmethoddirect.com/assets/hormone-quiz-transport.js")).toBe(true);
    expect(allowed("connect-src", "wss://ws.hotjar.com/capture")).toBe(false); expect(allowed("style-src", "https://fonts.googleapis.com/css2")).toBe(true); expect(allowed("font-src", "https://fonts.gstatic.com/font.woff2")).toBe(true);
    for (const directive of ["frame-src", "worker-src", "object-src"]) expect(allowed(directive, "https://medmethoddirect.com/local")).toBe(false);
  });

  it("adds no tracker loader identity call health event analytics bridge or capture transport and keeps every quiz script and stylesheet byte-identical", () => {
    const original = before(page), currentScripts = scripts(html);
    expect(currentScripts).toEqual(scripts(original)); expect(css(html)).toEqual(css(original)); expect(currentScripts).toHaveLength(3);
    for (const script of currentScripts.filter(s => !/\bsrc=/.test(s))) expect(() => new Script(script.slice(script.indexOf(">") + 1, script.lastIndexOf("</script>")))).not.toThrow();
    expect(html.match(/<script\b[^>]*\bsrc=[^>]*>/g)).toEqual(['<script defer src="/assets/hormone-quiz-transport.js">']);
    expect(html).not.toMatch(/hotjar|contentsquare|content-square|clarity\.ms|fullstory|mouseflow|smartlook|hj\s*\(|_hjSettings|_uxa\s*\.|CS_CONF|dataLayer\s*\.|gtag\s*\(|identify\s*\(|track\s*\(/i);
    expect(currentScripts.join("\n")).not.toMatch(/sendBeacon|XMLHttpRequest|\bfetch\s*\(|localStorage|sessionStorage/);
    expect(inverseHormoneQuizPrivacy(page, html)).toBe(original);
  });

  it("preserves all question wording scoring routing report downloads existing bridge and webhook provider sources and every other production page", () => {
    const unchanged = ["server/hormoneQuizModel.ts", "server/hormoneQuizService.ts", "server/hormoneQuizStore.ts", "server/hormoneQuizPdf.ts", "server/hormoneQuizPrivateReport.ts", "server/hormoneQuizSecurity.ts", "server/hormoneQuizRoutes.ts", "server/routers/hormoneQuiz.ts", "client/quiz-webhook-transport.ts", "client/src/components/AdminQuizWebhooks.tsx", "client/src/App.tsx", "server/_core/vite.ts", "package.json", "pnpm-lock.yaml"];
    for (const p of unchanged) expect(read(p), p).toBe(before(p));
    const paths = lines(git("ls-tree", "-r", "--name-only", baseline, "--", "client", "server", "shared", "drizzle"));
    for (const p of paths.filter(p => !/\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/.test(p))) { const current = read(p); expect(Object.hasOwn(pins, p) ? inverseHormoneQuizPrivacy(p, current) : current, p).toBe(before(p)); }
    const restored = inverseHormoneQuizPrivacy(page, html); expect(restored).toContain('if (window.mmdQuizComplete) window.mmdQuizComplete(submissionRecord);'); expect(restored).toContain('if (window.mmdQuizReset) window.mmdQuizReset();'); expect(restored).toContain('a.download = "my-hormone-report.txt"');
  });

  it("pins the pure helper all twenty-six prior fixture bytes and the exact two-production-path inventory without new unrelated files or test imports", () => {
    const source = read(helper); expect(hash(source)).toBe(helperSHA);
    expect(source.split("\n").slice(2).join("\n")).not.toMatch(/\b(?:describe|it|test)\s*\(|\bimport\s|\brequire\s*\(|readFile|writeFile|execFile|fetch\(|process\.|XMLHttpRequest|sendBeacon/);
    expect(read(direct)).not.toMatch(/from\s+["'][^"']*\.test["']/);
    const prior = lines(git("ls-tree", "-r", "--name-only", baseline, "--", "server/fixtures")); expect(prior).toHaveLength(26); for (const p of prior) expect(read(p), p).toBe(before(p));
    const scope = ["client", "server", "shared", "drizzle", ".gitignore", "vite.config.ts", "vitest.config.ts", "package.json", "pnpm-lock.yaml", "tsconfig.json"];
    const changed = lines(git("diff", "--name-only", baseline, "--", ...scope)); expect(changed.filter(p => !/^server\/[^/]+\.test\.ts$/.test(p))).toEqual([page, server]);
    const additions = lines(git("ls-files", "--others", "--exclude-standard", "--", ...scope)); expect(additions.sort()).toEqual([helper, direct].sort());
    for (const p of Object.keys(pins)) expect(read(p)).not.toContain("fixtures/hormoneQuizPrivacyScope");
    for (const p of changed.filter(p => /^server\/[^/]+\.test\.ts$/.test(p))) { const current = read(p), original = before(p); expect(current.split("\n").length, p).toBe(original.split("\n").length); expect([...current.matchAll(/\b(?:describe|it|test)\s*\(\s*(['"])(.*?)\1/g)].map(m => m[0]), p).toEqual([...original.matchAll(/\b(?:describe|it|test)\s*\(\s*(['"])(.*?)\1/g)].map(m => m[0])); expect((current.match(/\bexpect\s*\(/g) ?? []).length, p).toBe((original.match(/\bexpect\s*\(/g) ?? []).length); }
  });
});
