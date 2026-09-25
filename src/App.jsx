import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   THE FIVE ARCHETYPES — a 15-question profiler
   Design language: engineering paper. Cool grey ground, dot grid,
   condensed display type, mono labels, five ink-stamp colours.
   Signature element: the lifecycle rail — a line running from
   "nothing exists yet" to "everyone depends on it", with the five
   archetypes as stations. A marker drifts along it as you answer.
   ============================================================ */

const INK = "#171B21";
const PAPER = "#E9EBEC";
const HAIR = "#C6CBD0";
const MUTE = "#5E6771";

const DISPLAY = "'Archivo Narrow','Roboto Condensed','Arial Narrow',Impact,sans-serif";
const BODY = "ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

/* ---------- icons: single-stroke line art, 48x48 ---------- */
const Ico = ({ d, size = 48, color = INK, sw = 1.7 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">{d}</svg>
);

const IconPrototyper = (p) => (
  <Ico {...p} d={<>
    <path d="M11 14h18l7 7v20a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2z" />
    <path d="M29 14v7h7" />
    <path d="M16 34c3-9 6-9 8-3s5 4 8-5" />
    <path d="M24 8V4M15 10L13 7M33 10l2-3" />
  </>} />
);

const IconBuilder = (p) => (
  <Ico {...p} d={<>
    <path d="M8 42h32" />
    <path d="M12 42V16h24v26" />
    <path d="M12 16l24 18M36 16L12 34" />
    <path d="M9 16h30" />
    <circle cx="24" cy="10" r="3" />
    <path d="M24 13v3" />
  </>} />
);

const IconSweeper = (p) => (
  <Ico {...p} d={<>
    <path d="M38 8L24 22" />
    <path d="M18 20l8 8-9 9a6 6 0 0 1-8 0 6 6 0 0 1 0-8z" />
    <path d="M13 25l8 8M15 34l4 4" />
    <path d="M32 30h8M28 38h9M35 22h5" />
  </>} />
);

const IconGrower = (p) => (
  <Ico {...p} d={<>
    <path d="M8 40h34" />
    <path d="M8 34l8-6 7 5 8-11" />
    <path d="M31 22v-6" />
    <path d="M31 16c0-4 3-6 7-6 0 4-3 6-7 6z" />
    <path d="M31 20c-4 0-6-3-6-6 4 0 6 3 6 6z" />
    <path d="M38 10l4-4" />
  </>} />
);

const IconMaintainer = (p) => (
  <Ico {...p} d={<>
    <path d="M18 20h12l3 22H15z" />
    <path d="M19 14h10v6H19z" />
    <path d="M22 8h4l1 6h-6z" />
    <path d="M18 28h12" />
    <path d="M11 42h26" />
    <path d="M35 12c2 2 3 4 3 6M13 12c-2 2-3 4-3 6" />
  </>} />
);

/* ---------- the five archetypes ---------- */
const ARCH = {
  p: {
    key: "p", n: 1, name: "Prototyper", color: "#D08A0B", tint: "#F7EBD2",
    Icon: IconPrototyper,
    tag: "Makes the thing exist before anyone can argue about it",
    line: "You reduce arguments to artefacts.",
    room:
      "You are the person who turns a two-hour debate into a working demo nobody expected. Most of what you make is thrown away, and that is the point: you are buying information, not building product. Your output looks like waste to people who count shipped features, and looks like oxygen to anyone stuck.",
    strong: [
      "Turning an unclear problem into three concrete options",
      "Working fast enough that being wrong stays cheap",
      "Making the case for something that has no case yet",
    ],
    watch: [
      "Handing over things nobody can maintain, then moving on",
      "Confusing novelty with value when the boring option was right",
      "Losing interest at exactly the moment the work gets real",
    ],
    easy: [
      { k: "b", why: "You make raw material; they make it real. The cleanest handoff on any team." },
      { k: "g", why: "You both chase signal over polish and neither of you gets precious about a version." },
    ],
    hard: [
      { k: "m", why: "Every experiment you spin up is a system somebody has to be woken up for. You optimise for optionality, they optimise for nothing changing." },
      { k: "s", why: "They unship the experiments you have not finished arguing for, and they are usually right, which is worse." },
    ],
    stage: "Pre-product-market fit (pre-PMF). When there is nothing to defend yet, you are the highest-leverage person in the room.",
  },
  b: {
    key: "b", n: 2, name: "Builder", color: "#2F5FD0", tint: "#DDE5F8",
    Icon: IconBuilder,
    tag: "Turns \u201csort of works\u201d into something people can rely on",
    line: "You are the reason the demo became a product.",
    room:
      "You hold the standard. You know the difference between a thing that runs and a thing that holds, and you are willing to spend the extra week that nobody else wants to spend. Teams do not notice you until you are gone, at which point everything starts quietly falling over.",
    strong: [
      "Taking a fragile idea and giving it structure, edges and tests",
      "Estimating honestly and then hitting the estimate",
      "Making decisions that still look right two years later",
    ],
    watch: [
      "Building the well-made version of something that should not exist",
      "Treating scope cuts as a personal insult",
      "Gold-plating a v1 that needed to be embarrassing and early",
    ],
    easy: [
      { k: "p", why: "They generate more raw ideas than you could invent alone, and they are happy for you to take it from there." },
      { k: "m", why: "Same craft standards, different time horizon. You both think shortcuts are loans." },
    ],
    hard: [
      { k: "g", why: "They want ten scrappy experiments this month; you want one thing built properly. Both of you are defending real value and neither will fully concede." },
      { k: "s", why: "They delete what you carefully made. Their case is that you built the wrong thing well, and it will sting every time." },
    ],
    stage: "Every stage needs you, but pre-product-market fit (pre-PMF) and early growth need you most \u2014 that is where the foundations get poured.",
  },
  s: {
    key: "s", n: 3, name: "Sweeper", color: "#0E8F85", tint: "#D6EEEB",
    Icon: IconSweeper,
    tag: "Removes until what is left is obvious",
    line: "You defend the user by saying no on their behalf.",
    room:
      "You are the one asking whether the feature should exist. You leave products smaller, faster and more legible than you found them, and you are comfortable being the only person in the room advocating for subtraction. Your work is invisible by design: nobody thanks you for the complexity they never had to learn.",
    strong: [
      "Spotting the four features doing the job of one",
      "Killing things without drama or blame",
      "Making a system explainable to the next person who joins",
    ],
    watch: [
      "Cutting something before it had a fair run",
      "Mistaking simplicity for the goal rather than a means to it",
      "Being read as the person who blocks, not the person who clears",
    ],
    easy: [
      { k: "m", why: "You are both at war with entropy, just at different layers \u2014 you take away surface, they take away failure." },
      { k: "g", why: "Neither of you is sentimental. If it does not earn its place in the data, you both want it gone." },
    ],
    hard: [
      { k: "p", why: "They add surface area faster than you can clear it, and every rough edge you file down is one they thought was interesting." },
      { k: "b", why: "They are protective of what they built well. Your unship proposal reads to them as a verdict on their craft, not the roadmap." },
    ],
    stage: "Wanted everywhere, hired too late. Products with strong product-market fit (PMF) need you most \u2014 that is where the weight accumulates.",
  },
  g: {
    key: "g", n: 4, name: "Grower", color: "#C93A76", tint: "#F7DEEA",
    Icon: IconGrower,
    tag: "Finds the 20% people love and turns it into the whole product",
    line: "You know which number actually matters.",
    room:
      "You treat a shipped product as the beginning of the question, not the answer. You live in funnels, cohorts and session recordings, and you can tell the difference between a product people use and a product people would miss. You will happily run the ugly version of the test if it settles the argument this week.",
    strong: [
      "Reading behaviour rather than opinion",
      "Sequencing small bets so the learning compounds",
      "Knowing when a product has a distribution problem, not a product problem",
    ],
    watch: [
      "Optimising a local maximum long past the point of return",
      "Letting the metric define the goal instead of the other way round",
      "Leaving a trail of half-run experiments behind you",
    ],
    easy: [
      { k: "p", why: "They will build you the crude test version by Thursday and neither of you will mourn it." },
      { k: "s", why: "You both kill weak things for a living. They cut on principle, you cut on evidence, same outcome." },
    ],
    hard: [
      { k: "m", why: "You want to change the system weekly; they are accountable for it not changing. Every test you run is risk they carry." },
      { k: "b", why: "Their instinct is to make it right, yours is to make it measurable. You will feel slowed down, they will feel rushed." },
    ],
    stage: "Post-product-market fit (post-PMF) growth. Once the thing works for someone, you are the person who works out for whom else.",
  },
  m: {
    key: "m", n: 5, name: "Maintainer", color: "#6B4EA8", tint: "#E5DEF3",
    Icon: IconMaintainer,
    tag: "Owns the thing everyone quietly depends on",
    line: "You are boring on purpose, at scale.",
    room:
      "You take responsibility for systems after the excitement leaves. You think in failure modes, migration paths and the 3am version of every decision. The measure of your work is an absence \u2014 no incident, no outage, no thread of people asking what happened \u2014 which makes it the hardest contribution on the team to see and to reward.",
    strong: [
      "Seeing the failure two quarters before it happens",
      "Making change safe, so other people can move fast",
      "Holding institutional memory nobody else wrote down",
    ],
    watch: [
      "Defending the system against the change it actually needs",
      "Absorbing so much invisible load that nobody notices until you burn out",
      "Letting rigour become a veto rather than a guardrail",
    ],
    easy: [
      { k: "b", why: "Shared standards. You both believe how a thing is made determines what it costs later." },
      { k: "s", why: "They remove what you would otherwise have to keep alive. Every unship is a gift to your on-call rota." },
    ],
    hard: [
      { k: "p", why: "They hand you systems they will never operate, and the interesting bit for them is the part you will be paged about." },
      { k: "g", why: "Their velocity is your risk surface. You are asked to underwrite experiments you had no say in." },
    ],
    stage: "Strong product-market fit (PMF) and scale. When a lot of people depend on it, you become the person the business rests on.",
  },
};

const ORDER = ["p", "b", "s", "g", "m"];

const ORIGIN = {
  p: "generates brand-new ideas at volume; most of them never ship",
  b: "turns a prototype or an idea into production-grade product and infrastructure",
  s: "tidies the interface, simplifies the code and the system, unships, tunes performance",
  g: "takes something already built and iterates on it to sharpen product-market fit",
  m: "owns a mature system and keeps it secure, reliable, fast and efficient as it scales",
};


/* ---------- 15 questions ---------- */
const Q = [
  {
    q: "A blank Friday afternoon appears on your calendar. What actually happens?",
    o: [
      { t: "You spin up three throwaway repos to test a weird idea", w: { p: 3 } },
      { t: "You finally wire up the thing you demoed last month so it stops falling over", w: { b: 3 } },
      { t: "You delete 400 lines and close six stale tickets", w: { s: 3 } },
      { t: "You dig into the funnel to find where people are quietly dropping off", w: { g: 3 } },
      { t: "You upgrade the dependency everyone has been ignoring since March", w: { m: 3 } },
    ],
  },
  {
    q: "It's demo day. Your demo is\u2026",
    o: [
      { t: "Held together with duct tape, but the idea lands", w: { p: 3 } },
      { t: "Not flashy, but it's running on real data at real volume", w: { b: 3, m: 1 } },
      { t: "The same product as last month with half the buttons gone \u2014 and it feels twice as fast", w: { s: 3 } },
      { t: "A chart. The number went up", w: { g: 3 } },
      { t: "Ninety days, zero incidents", w: { m: 3 } },
    ],
  },
  {
    q: "Which sentence would give you the most quiet satisfaction?",
    o: [
      { t: "\u201cI've never seen anything like this.\u201d", w: { p: 3 } },
      { t: "\u201cIt shipped.\u201d", w: { b: 3 } },
      { t: "\u201cWait \u2014 this used to be way more complicated.\u201d", w: { s: 3 } },
      { t: "\u201cRetention is up six points.\u201d", w: { g: 3 } },
      { t: "\u201cIt just always works.\u201d", w: { m: 3 } },
    ],
  },
  {
    q: "Pick your nightmare.",
    o: [
      { t: "A roadmap with no room to try anything new", w: { p: 3 } },
      { t: "An endless prototype that never becomes real", w: { b: 3 } },
      { t: "A settings page with 47 toggles", w: { s: 3 } },
      { t: "A beautiful product nobody uses", w: { g: 3 } },
      { t: "A 3am page for something that got flagged six months ago", w: { m: 3 } },
    ],
  },
  {
    q: "Your working definition of \u201cdone\u201d:",
    o: [
      { t: "Done is when I've learned the thing \u2014 usually by lunchtime", w: { p: 3 } },
      { t: "Done is merged, tested, documented", w: { b: 3, m: 1 } },
      { t: "Done is when there's nothing left to take away", w: { s: 3 } },
      { t: "Done is a moving target; the metric decides", w: { g: 3 } },
      { t: "Done is a system that outlives my attention", w: { m: 3 } },
    ],
  },
  {
    q: "Which meeting would you actually volunteer for?",
    o: [
      { t: "Blue-sky offsite. Whiteboard, no agenda", w: { p: 3 } },
      { t: "Technical design review", w: { b: 3 } },
      { t: "Backlog triage, the kind where things get killed", w: { s: 3, m: 1 } },
      { t: "The weekly metrics review", w: { g: 3 } },
      { t: "Post-incident review", w: { m: 3 } },
    ],
  },
  {
    q: "Your browser, right now:",
    o: [
      { t: "Forty tabs, half of them things that don't exist yet", w: { p: 3 } },
      { t: "Docs, a pull request, and a staging environment", w: { b: 3 } },
      { t: "Three tabs. You closed the rest", w: { s: 3 } },
      { t: "An analytics dashboard and five session recordings", w: { g: 3 } },
      { t: "A dashboard of dashboards, and one alert channel", w: { m: 3 } },
    ],
  },
  {
    q: "How you feel about deleting your own work:",
    o: [
      { t: "Fine \u2014 there's plenty more where that came from", w: { p: 3, s: 1 } },
      { t: "It stings. I built that properly", w: { b: 3 } },
      { t: "Genuinely one of life's pleasures", w: { s: 3 } },
      { t: "Only if the data says so", w: { g: 3 } },
      { t: "Only after a deprecation window and a migration path", w: { m: 3 } },
    ],
  },
  {
    q: "A compliment from a teammate that you'd secretly screenshot:",
    o: [
      { t: "\u201cWhere did you even get that idea?\u201d", w: { p: 3 } },
      { t: "\u201cThis held up under way more load than we expected.\u201d", w: { b: 3, m: 1 } },
      { t: "\u201cYou made this legible.\u201d", w: { s: 3 } },
      { t: "\u201cYou found the unlock.\u201d", w: { g: 3 } },
      { t: "\u201cI've never had to think about this system once.\u201d", w: { m: 3 } },
    ],
  },
  {
    q: "A user complains loudly about a feature. Your instinct?",
    o: [
      { t: "Sketch three alternative versions of it tonight", w: { p: 3 } },
      { t: "Work out what's actually broken and fix it properly", w: { b: 3 } },
      { t: "Wonder whether the feature itself is the problem", w: { s: 3 } },
      { t: "Find out how many other people feel the same way", w: { g: 3 } },
      { t: "Check the error logs and latency on that endpoint", w: { m: 3 } },
    ],
  },
  {
    q: "Your ideal team and stage:",
    o: [
      { t: "Two people, a name, and no product", w: { p: 3 } },
      { t: "Six people, a signed-off spec, and a launch date", w: { b: 3 } },
      { t: "Any team that has just realised it's carrying too much", w: { s: 3 } },
      { t: "Early traction and a fuzzy ceiling", w: { g: 3 } },
      { t: "Something a lot of people quietly depend on", w: { m: 3 } },
    ],
  },
  {
    q: "What you're secretly best at:",
    o: [
      { t: "Making something exist by Tuesday that didn't exist on Monday", w: { p: 3 } },
      { t: "Turning \u201csort of works\u201d into \u201cworks\u201d", w: { b: 3 } },
      { t: "Saying no on behalf of the user", w: { s: 3 } },
      { t: "Noticing the one number that matters", w: { g: 3 } },
      { t: "Being boring on purpose, at scale", w: { m: 3 } },
    ],
  },
];

/* ---------- signature element: the lifecycle rail ---------- */
function Rail({ scores, mode = "full", lockKey = null }) {
  const total = ORDER.reduce((a, k) => a + scores[k], 0);
  const posPct = total
    ? ORDER.reduce((a, k, i) => a + scores[k] * (i / (ORDER.length - 1)), 0) / total * 100
    : 50;

  return (
    <div className="w-full select-none">
      <div className="relative" style={{ height: mode === "full" ? 74 : 46 }}>
        <div className="absolute left-0 right-0" style={{ top: mode === "full" ? 40 : 26, height: 1, background: HAIR }} />
        {ORDER.map((k, i) => {
          const a = ARCH[k];
          const left = (i / (ORDER.length - 1)) * 100;
          const on = lockKey ? lockKey === k : false;
          return (
            <div key={k} className="absolute flex flex-col items-center"
              style={{ left: `${left}%`, top: 0, transform: "translateX(-50%)" }}>
              {mode === "full" && (
                <div style={{ opacity: lockKey && !on ? 0.3 : 1, transition: "opacity .4s" }}>
                  <a.Icon size={30} color={a.color} sw={1.6} />
                </div>
              )}
              <div style={{
                marginTop: mode === "full" ? 4 : 20,
                width: on ? 11 : 7, height: on ? 11 : 7, borderRadius: 99,
                background: on ? a.color : PAPER, border: `1.5px solid ${a.color}`,
                transition: "all .4s",
              }} />
              {mode === "full" && (
                <div style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: ".06em", color: on ? a.color : MUTE, marginTop: 6, textTransform: "uppercase" }}>
                  {a.name}
                </div>
              )}
            </div>
          );
        })}
        {mode === "slim" && (
          <div className="absolute" style={{
            left: `${posPct}%`, top: 20, transform: "translateX(-50%)",
            transition: "left .55s cubic-bezier(.4,0,.2,1)",
          }}>
            <div style={{ width: 2, height: 13, background: INK }} />
          </div>
        )}
      </div>
      <div className="flex justify-between" style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: ".08em", color: MUTE, textTransform: "uppercase" }}>
        <span>nothing exists yet</span>
        <span>everyone depends on it</span>
      </div>
    </div>
  );
}

/* ---------- shell ---------- */
function shuffled(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ArchetypeQuiz() {
  const [stage, setStage] = useState("intro");
  const [shuffles, setShuffles] = useState(() => Q.map((q) => shuffled(q.o.length)));
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(Q.length).fill(null));
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const scores = ORDER.reduce((acc, k) => ({ ...acc, [k]: 0 }), {});
  answers.forEach((oi, qi) => {
    if (oi === null) return;
    const w = Q[qi].o[oi].w;
    Object.keys(w).forEach((k) => { scores[k] += w[k]; });
  });

  const ranked = [...ORDER].sort((a, b) => scores[b] - scores[a]);
  const top = ranked[0], second = ranked[1];
  const hybrid = scores[top] - scores[second] <= 2 && scores[top] > 0;
  const maxScore = Math.max(1, scores[top]);

  const pick = (oi) => {
    const next = [...answers];
    next[idx] = oi;
    setAnswers(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (idx < Q.length - 1) setIdx(idx + 1);
      else setStage("result");
    }, 240);
  };

  const restart = () => {
    setAnswers(Array(Q.length).fill(null));
    setIdx(0); setCopied(false); setLinkCopied(false); setStage("intro");
    setShuffles(Q.map((q) => shuffled(q.o.length)));
  };

  const copy = async () => {
    const t = ARCH[top], s = ARCH[second];
    const txt = `I'm a ${t.name}${hybrid ? ` / ${s.name}` : ""} \u2014 ${t.tag}.\n\n` +
      ranked.map((k) => `${ARCH[k].name}: ${scores[k]}`).join("\n");
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  };

  // Native share sheet on phones; falls back to copying the link on desktop.
  const share = async () => {
    const t = ARCH[top], s = ARCH[second];
    const url = window.location.origin + window.location.pathname;
    const text = `I got ${t.name}${hybrid ? ` / ${s.name}` : ""} on The Five Archetypes. Which one are you?`;
    if (navigator.share) {
      try { await navigator.share({ title: "The Five Archetypes", text, url }); } catch { /* dismissed */ }
      return;
    }
    try { await navigator.clipboard.writeText(`${text} ${url}`); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }
    catch { setLinkCopied(false); }
  };

  const css = `
    .aq-opt{transition:transform .16s ease,border-color .16s ease,background .16s ease}
    .aq-opt:hover{transform:translateX(4px)}
    .aq-btn{transition:opacity .16s ease,transform .16s ease}
    .aq-btn:hover{opacity:.82}
    .aq-fade{animation:aqIn .38s cubic-bezier(.2,.7,.3,1) both}
    @keyframes aqIn{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
    .aq-bar{transition:width .7s cubic-bezier(.3,.8,.3,1)}
    button:focus-visible{outline:2px solid ${INK};outline-offset:3px}
    @media (prefers-reduced-motion:reduce){*{animation:none !important;transition:none !important}}
  `;

  return (
    <div style={{
      minHeight: "100vh", background: PAPER, color: INK, fontFamily: BODY,
      backgroundImage: `radial-gradient(${HAIR} .8px, transparent .8px)`,
      backgroundSize: "22px 22px",
    }}>
      <style>{css}</style>
      <div className="mx-auto px-5 py-8" style={{ maxWidth: 700 }}>

        {/* header */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between">
            <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: ".14em", textTransform: "uppercase", color: MUTE }}>
              The five archetypes
            </span>
            <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: ".14em", textTransform: "uppercase", color: MUTE }}>
              {stage === "quiz" ? `Q${String(idx + 1).padStart(2, "0")} / ${Q.length}` : `${Q.length} questions`}
            </span>
          </div>
          {stage === "result" && (
            <div className="mt-6">
              <Rail scores={scores} mode="full" lockKey={top} />
            </div>
          )}
        </div>

        {stage === "intro" && (
          <div className="aq-fade">
            <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(38px,10vw,64px)", lineHeight: .94, letterSpacing: "-.01em", fontWeight: 700, textTransform: "uppercase" }}>
              Which one<br />are you when<br />the work<br />gets real?
            </h1>
            <div style={{ height: 1, background: INK, margin: "26px 0 20px" }} />
            <p style={{ fontSize: 16, lineHeight: 1.6, maxWidth: 540 }}>
              Job titles describe where you sit. These five describe what you actually do once a
              product exists — and they cut across engineering, product, design and data alike.
              Answer honestly rather than aspirationally. Most people turn out to be two of them.
            </p>
            <button onClick={() => setStage("quiz")} className="aq-btn mt-8"
              style={{ background: INK, color: PAPER, fontFamily: MONO, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", padding: "15px 30px", border: "none", cursor: "pointer" }}>
              Start →
            </button>
            <p style={{ fontFamily: MONO, fontSize: 10, color: MUTE, marginTop: 14, letterSpacing: ".06em" }}>
              About two minutes. Nothing is stored.
            </p>
          </div>
        )}

        {stage === "quiz" && (
          <div key={idx} className="aq-fade">
            <div style={{ height: 2, background: HAIR, marginBottom: 26 }}>
              <div className="aq-bar" style={{ height: 2, background: INK, width: `${(idx / Q.length) * 100}%` }} />
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(25px,6.2vw,38px)", lineHeight: 1.06, fontWeight: 700, marginBottom: 24, letterSpacing: "-.005em" }}>
              {Q[idx].q}
            </h2>
            <div className="flex flex-col gap-2">
              {shuffles[idx].map((oi) => {
                const o = Q[idx].o[oi];
                const sel = answers[idx] === oi;
                return (
                  <button key={oi} onClick={() => pick(oi)} className="aq-opt text-left"
                    style={{
                      background: sel ? INK : "rgba(255,255,255,.62)",
                      color: sel ? PAPER : INK,
                      border: `1px solid ${sel ? INK : HAIR}`,
                      borderLeft: `3px solid ${sel ? INK : HAIR}`,
                      padding: "14px 16px", fontSize: 15, lineHeight: 1.45, cursor: "pointer",
                    }}>
                    {o.t}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-6">
              <button onClick={() => idx > 0 && setIdx(idx - 1)} disabled={idx === 0} className="aq-btn"
                style={{ background: "none", border: "none", fontFamily: MONO, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: idx === 0 ? HAIR : MUTE, cursor: idx === 0 ? "default" : "pointer", padding: 0 }}>
                ← Back
              </button>
              <button onClick={restart} className="aq-btn"
                style={{ background: "none", border: "none", fontFamily: MONO, fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: MUTE, cursor: "pointer", padding: 0 }}>
                Start over
              </button>
            </div>
          </div>
        )}

        {stage === "result" && <Result
          top={top} second={second} hybrid={hybrid} scores={scores} ranked={ranked}
          maxScore={maxScore} restart={restart} copy={copy} copied={copied}
          share={share} linkCopied={linkCopied} />}

      </div>
    </div>
  );
}

/* ---------- result ---------- */
function Result({ top, second, hybrid, scores, ranked, maxScore, restart, copy, copied, share, linkCopied }) {
  const t = ARCH[top], s = ARCH[second];
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(null);
  useEffect(() => { const id = setTimeout(() => setShown(true), 80); return () => clearTimeout(id); }, []);

  const Chip = ({ k, why, kind }) => {
    const a = ARCH[k];
    return (
      <div style={{ display: "flex", gap: 12, padding: "14px 14px", background: "rgba(255,255,255,.62)", border: `1px solid ${HAIR}`, borderLeft: `3px solid ${a.color}` }}>
        <div style={{ flexShrink: 0, marginTop: 1 }}><a.Icon size={26} color={a.color} sw={1.6} /></div>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: a.color, marginBottom: 4 }}>
            {kind} · {a.name}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>{why}</div>
        </div>
      </div>
    );
  };

  const List = ({ label, items, color }) => (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: MUTE, marginBottom: 10 }}>{label}</div>
      <ul className="flex flex-col gap-2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((x, i) => (
          <li key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.5 }}>
            <span style={{ color, flexShrink: 0, fontFamily: MONO, fontSize: 12, marginTop: 2 }}>—</span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="aq-fade">
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: MUTE }}>
        {hybrid ? "You span two" : "Your archetype"}
      </div>

      <div className="flex items-start gap-4 mt-3" style={{ flexWrap: "wrap" }}>
        <div style={{ background: t.tint, border: `1px solid ${t.color}`, padding: 14 }}>
          <t.Icon size={58} color={t.color} sw={1.6} />
        </div>
        <div style={{ flex: "1 1 240px" }}>
          <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(40px,11vw,68px)", lineHeight: .9, fontWeight: 700, textTransform: "uppercase", color: t.color, letterSpacing: "-.01em" }}>
            {t.name}{hybrid && <span style={{ color: s.color }}> / {s.name}</span>}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.45, marginTop: 10, maxWidth: 460 }}>{t.tag}.</p>
        </div>
      </div>

      {/* score bars */}
      <div className="mt-8 flex flex-col gap-3">
        {ranked.map((k) => {
          const a = ARCH[k];
          const pct = shown ? Math.round((scores[k] / maxScore) * 100) : 0;
          return (
            <div key={k} className="flex items-center gap-3">
              <div style={{ width: 92, fontFamily: MONO, fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: k === top ? a.color : MUTE, flexShrink: 0 }}>
                {a.name}
              </div>
              <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,.7)", border: `1px solid ${HAIR}` }}>
                <div className="aq-bar" style={{ height: "100%", width: `${pct}%`, background: a.color, opacity: k === top ? 1 : .55 }} />
              </div>
              <div style={{ width: 26, textAlign: "right", fontFamily: MONO, fontSize: 11, color: MUTE }}>{scores[k]}</div>
            </div>
          );
        })}
      </div>

      {hybrid && (
        <p style={{ fontSize: 14.5, lineHeight: 1.6, marginTop: 18, padding: "14px 16px", background: "rgba(255,255,255,.62)", border: `1px solid ${HAIR}` }}>
          Your top two are within touching distance, so read both. {t.name} is your default gear;{" "}
          {s.name} is where you go when the first approach stops working. Spanning two archetypes is
          the norm, not a fence-sit — it usually means you can carry a piece of work further
          before handing it on.
        </p>
      )}

      <div style={{ height: 1, background: INK, margin: "34px 0 26px" }} />

      <h2 style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
        How you show up
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.65, marginBottom: 26 }}>{t.room}</p>

      <div className="flex flex-col gap-7" style={{ marginBottom: 30 }}>
        <List label="What you're unusually good at" items={t.strong} color={t.color} />
        <List label="Where it turns against you" items={t.watch} color={t.color} />
      </div>

      <h2 style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
        Who you'll click with
      </h2>
      <div className="flex flex-col gap-2 mb-7">
        {t.easy.map((e) => <Chip key={e.k} k={e.k} why={e.why} kind="Easy" />)}
      </div>

      <h2 style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
        Who you'll grind against
      </h2>
      <div className="flex flex-col gap-2 mb-7">
        {t.hard.map((e) => <Chip key={e.k} k={e.k} why={e.why} kind="Friction" />)}
      </div>
      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTE, marginBottom: 30 }}>
        Friction here is not a personality clash. It is two people defending different, legitimate
        things about the same product. Teams that name it out loud tend to argue better and shorter.
      </p>

      <div style={{ background: t.tint, border: `1px solid ${t.color}`, padding: "18px 18px" }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: t.color, marginBottom: 8 }}>
          Where you're worth the most
        </div>
        <p style={{ fontSize: 15.5, lineHeight: 1.55 }}>{t.stage}</p>
      </div>


      <div style={{ height: 1, background: INK, margin: "36px 0 20px" }} />

      <h2 style={{ fontFamily: DISPLAY, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
        The other four
      </h2>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: MUTE, marginBottom: 14 }}>
        Open any of these to read the full profile. Useful if you're mapping a team rather than yourself.
      </p>
      <div className="flex flex-col gap-2">
        {ORDER.filter((k) => k !== top).map((k) => {
          const a = ARCH[k];
          const isOpen = open === k;
          return (
            <div key={k} style={{ border: `1px solid ${HAIR}`, borderLeft: `3px solid ${a.color}`, background: "rgba(255,255,255,.62)" }}>
              <button onClick={() => setOpen(isOpen ? null : k)} className="aq-btn"
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: "none", border: "none", padding: "13px 14px", cursor: "pointer", textAlign: "left" }}>
                <a.Icon size={26} color={a.color} sw={1.6} />
                <span style={{ flex: 1 }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 21, fontWeight: 700, textTransform: "uppercase", color: a.color }}>{a.name}</span>
                  <span style={{ display: "block", fontSize: 13.5, color: MUTE, lineHeight: 1.4, marginTop: 2 }}>{a.tag}</span>
                </span>
                <span style={{ fontFamily: MONO, fontSize: 17, color: a.color }}>{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="aq-fade flex flex-col gap-5" style={{ padding: "2px 14px 18px" }}>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{a.room}</p>
                  <List label="Unusually good at" items={a.strong} color={a.color} />
                  <List label="Where it turns against them" items={a.watch} color={a.color} />
                  <div className="flex flex-col gap-2">
                    {a.easy.map((e) => <Chip key={e.k} k={e.k} why={e.why} kind="Easy" />)}
                    {a.hard.map((e) => <Chip key={e.k} k={e.k} why={e.why} kind="Friction" />)}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.55 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: a.color }}>Worth most at · </span>
                    {a.stage}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-9" style={{ flexWrap: "wrap" }}>
        <button onClick={share} className="aq-btn"
          style={{ background: INK, color: PAPER, fontFamily: MONO, fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", padding: "14px 26px", border: "none", cursor: "pointer" }}>
          {linkCopied ? "Link copied" : "Share with a friend"}
        </button>
        <button onClick={copy} className="aq-btn"
          style={{ background: "none", color: INK, fontFamily: MONO, fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", padding: "14px 26px", border: `1px solid ${INK}`, cursor: "pointer" }}>
          {copied ? "Copied" : "Copy result"}
        </button>
        <button onClick={restart} className="aq-btn"
          style={{ background: "none", color: INK, fontFamily: MONO, fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", padding: "14px 26px", border: `1px solid ${INK}`, cursor: "pointer" }}>
          Take it again
        </button>
      </div>

      <div style={{ marginTop: 54, paddingTop: 20, borderTop: `1px solid ${INK}` }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: MUTE, marginBottom: 10 }}>
          Where this came from
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.65, marginBottom: 14 }}>
          A post by Boris Cherny (@bcherny) on 29 June 2026, written while looking at the Claude Code
          team. His observation was that as engineering, product, design and data science melt into
          each other, what distinguishes people is no longer their job function but which of five
          recurring shapes they take. Paraphrasing his five:
        </p>
        <ol style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "flex", flexDirection: "column", gap: 7 }}>
          {ORDER.map((k) => (
            <li key={k} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: ARCH[k].color, flexShrink: 0, marginTop: 2 }}>{ARCH[k].n}</span>
              <span><strong style={{ color: ARCH[k].color }}>{ARCH[k].name}</strong> · {ORIGIN[k]}</span>
            </li>
          ))}
        </ol>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: MUTE }}>
          He also noted that most people span two of these and sometimes three, and that the right mix
          depends on the product's stage: a pre-product-market fit (pre-PMF) product needs 1+2+3, a growing
          product with product-market fit (PMF) needs 2+3+4 and some 5, and a product with strong
          product-market fit (PMF) needs 3+4+5 and some 2. His post
          supplied the five shapes and that stage logic. The questions, scoring, written profiles and
          the affinity mapping here are original.
        </p>
        <p style={{ fontSize: 13, marginTop: 16, fontFamily: MONO, letterSpacing: ".04em" }}>
          <a href="https://stevenraynaldili.com" target="_blank" rel="noopener noreferrer"
            style={{ color: INK, borderBottom: `1px solid ${INK}`, textDecoration: "none" }}>
            stevenraynaldili.com ↗
          </a>
        </p>
      </div>
    </div>
  );
}
