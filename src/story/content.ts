/*
  Words for the home page story, one entry per chapter.
  Chapter components own the markup; scenes and timelines own the motion.
  Keep copy factual: nothing here may be invented (see CLAUDE.md, "Home page story").
*/

export type ChapterId =
  | "introduction"
  | "person"
  | "building"
  | "leadership"
  | "ai"
  | "work"
  | "lessons"
  | "family"
  | "next"
  | "closing";

export interface ChapterMeta {
  id: ChapterId;
  /** Shown in the progress indicator and chapter index. */
  label: string;
}

/** Chapter order on the page; the progress indicator numbers them from this list. */
export const CHAPTERS: readonly ChapterMeta[] = [
  { id: "introduction", label: "Introduction" },
  { id: "person", label: "Beyond the title" },
  { id: "building", label: "How I build" },
  { id: "leadership", label: "Leadership" },
  { id: "ai", label: "Building with AI" },
  { id: "work", label: "The work" },
  { id: "lessons", label: "What I've learned" },
  { id: "family", label: "Beyond the code" },
  { id: "next", label: "What's next" },
  { id: "closing", label: "Say hello" },
];

export const CONTACT = {
  email: "ddumont86@gmail.com",
  profiles: [
    { label: "LinkedIn", href: "https://linkedin.com/in/danieldumont" },
    { label: "GitHub", href: "https://github.com/da-dumont" },
    { label: "X", href: "https://twitter.com/EngLeader_" },
  ],
} as const;

export const introduction = {
  name: "Dan Dumont",
  role: "Engineering leader · Builder · Dad",
  statement: ["I build products.", "I lead people.", "I care about", "what happens"],
  /** Set apart from the last statement line in the accent face. */
  statementAccent: "next.",
  supporting:
    "I lead engineering teams. I'm also a husband and a dad. Most of my days go to turning complicated ideas into products people use, and helping good people do the best work of their careers.",
  portraitAlt: "Dan Dumont, smiling, in a light blue collared shirt",
} as const;

export const person = {
  headline: "There's more to me than a job title.",
  /** depth: -1 (far) to 1 (near); x/y: desktop position in % of the stage; mx/my: phone position. */
  words: [
    { text: "Builder", depth: 0.55, x: 16, y: 24, mx: 8, my: 34 },
    { text: "Leader", depth: -0.45, x: 74, y: 18, mx: 58, my: 44 },
    { text: "Husband", depth: 0.7, x: 68, y: 72, mx: 46, my: 78 },
    { text: "Dad", depth: 0.1, x: 24, y: 70, mx: 12, my: 66 },
    { text: "Curious by nature", depth: -0.9, x: 56, y: 42, mx: 18, my: 55 },
  ],
  message:
    "I've spent a big part of my life building software. Plenty of what I care about happens away from it.",
  facts: ["Massachusetts", "Roots in front-end engineering and design", "15+ years building software"],
} as const;

/** A short label above a chapter's headline, and the headline's lines. */
export interface ChapterHeading {
  label: string;
  lines: readonly string[];
}

export const building = {
  heading: { label: "How I build", lines: ["The problem", "comes first."] },
  beats: [
    {
      title: "Understand the problem.",
      body: "The question I keep coming back to is whether this makes things better for the person using it. Hard problems rarely show up with clean answers. I'll sit in the ambiguity long enough to understand it, as long as the team keeps moving.",
    },
    {
      title: "Make the complicated understandable.",
      body: "Early decisions compound. A name turns into an abstraction, and a few of those harden into architecture. So I'll pick plain, explicit code over clever code that's hard to change.",
    },
    {
      title: "Ship the part that matters.",
      body: "Get something real in front of people quickly and learn from it. Most features have a small core that carries most of the value. I ship that first and watch how people use it before deciding if the rest is worth building.",
    },
  ],
  /** The layers of the interactive diagram, top to bottom. */
  layers: [
    {
      id: "customer",
      name: "Customer",
      note: "The test is whether it's better for the person using it. If we can't say how, I'd pause before we build.",
    },
    {
      id: "experience",
      name: "Experience",
      note: "My roots are in front-end engineering and design. How a product feels to use is part of whether it works.",
    },
    {
      id: "logic",
      name: "Product logic",
      note: "Find the version that gets most of the value for a fraction of the work. Ship it and learn from it before deciding what else to build.",
    },
    {
      id: "platform",
      name: "Platform",
      note: "Some early calls will be wrong. Build so they're cheap to undo.",
    },
    {
      id: "signals",
      name: "Signals",
      note: "I'd rather ship to a small group and get a clear signal than launch wide and get vague engagement numbers.",
    },
  ],
  layersHint: "Select a layer to see how I think about it.",
} as const;

export const leadership = {
  heading: { label: "Leadership", lines: ["Good teams get built", "on purpose."] },
  principles: [
    { name: "Accountability", line: "Own the outcome.", body: ["You own the result,", "even after the ticket closes."] },
    {
      name: "Clarity",
      line: "Say what matters.",
      body: ["Explain decisions so they make sense.", "Give people enough context to act on their own."],
    },
    {
      name: "Urgency",
      line: "Keep things moving.",
      body: ["Decide, then go.", "Don't confuse process with progress."],
    },
  ],
  reflection: [
    "Most of leading a team is coaching. I help engineers build judgment and make sure they know why their work matters.",
    "I try to hire people I'd want to work for. I give them context and clear goals and then get out of their way. I like engineers who push back on me and have opinions about the product. They should understand what they ship, even when an AI wrote it.",
  ],
} as const;

export const ai = {
  heading: {
    label: "Building with AI",
    lines: ["AI is changing what we can build."],
  },
  /** The second, quieter half of the headline. */
  turn: "That's the part I keep thinking about.",
  shift: [
    "Code is cheap and fast to generate now, so the old walls between engineering, product and design matter less. Builders are builders.",
    "Writing enough code used to be the slow part. Now the slow parts are fuzzy context and unclear ownership before anything gets built, then review queues and the gap between done and shipped. I push teams toward short loops. Frame the problem and build, then watch what happens and adjust.",
  ],
  loopTitle: "How an AI-native product works",
  stages: [
    {
      id: "understand",
      name: "Understand",
      note: "An assistant is only as useful as what it knows about the business. That means its customers and what's worked before, plus whatever is going on this week.",
    },
    {
      id: "recommend",
      name: "Recommend",
      note: "Turn that into a short list of what to do next. Show the reasoning so the owner can judge it for themselves.",
    },
    {
      id: "act",
      name: "Act",
      note: "Agents do the work with real tools. The workflows survive retries and restarts, and a person still decides what goes out.",
    },
    {
      id: "measure",
      name: "Measure",
      note: "Check what happened, with evals and tracing on the system and real results from the business.",
    },
    {
      id: "learn",
      name: "Learn",
      note: "Feed the results back in so the next recommendation is better than the last one.",
    },
  ],
  catalyst: {
    now: {
      label: "What I'm building now",
      body: "At Constant Contact I'm helping build Catalyst, an AI marketing assistant for small businesses. Owners usually get a set of tools and have to run their own marketing. Catalyst learns the business and suggests what to focus on. Then it helps get the work done.",
    },
    next: {
      label: "Where it's going",
      body: "We're aiming for the full loop, where the assistant learns from the results and each round of recommendations gets better. That part is still being built, and it's the piece I find most interesting.",
    },
  },
} as const;

export const work = {
  heading: { label: "The work", lines: ["A few things I've helped", "build along the way."] },
  chapters: [
    {
      id: "catalyst",
      years: "2026–now",
      company: "Constant Contact",
      product: "Catalyst",
      summary:
        "Director of Software Engineering on Catalyst, Constant Contact's AI marketing product for small businesses. I lead engineering for its agent systems and the product experience built on them.",
      roles: [{ title: "Director of Software Engineering", years: "May 2026–now" }],
    },
    {
      id: "linksquares",
      years: "2021–2026",
      company: "LinkSquares",
      product: "Platform, integrations and frontend",
      summary:
        "Joined a Series C SaaS company while it was growing fast and helped bring 30+ new engineers onto the team. Later I led Platform, Integrations, DevOps and Frontend, with several teams and engineering managers under me. That covered customer-facing product areas and the systems behind them.",
      roles: [
        { title: "Director of Engineering", years: "Jul 2023–Mar 2026" },
        { title: "Senior Software Engineering Manager", years: "Nov 2021–Jul 2023" },
      ],
    },
    {
      id: "constant-contact",
      years: "2009–2021",
      company: "Constant Contact",
      product: "Email authoring",
      summary:
        "Twelve years. I started as an email template developer and worked through UX and front-end engineering into management. By the end I led a 17-engineer Email Authoring organization on a product the business depended on, used by thousands of people every day.",
      roles: [
        { title: "Senior Software Engineering Manager", years: "Jun 2021–Nov 2021" },
        { title: "Software Engineering Manager", years: "Oct 2018–Jun 2021" },
        { title: "UX Development Manager", years: "Apr 2017–Oct 2018" },
        { title: "Senior Front End Engineer II, UX Development", years: "May 2016–Apr 2017" },
        { title: "Senior UX Developer", years: "Apr 2013–May 2016" },
        { title: "UX Developer", years: "Mar 2011–Apr 2013" },
        { title: "Email Template Developer", years: "Sep 2009–Mar 2011" },
      ],
    },
  ],
} as const;

export const lessons = {
  heading: { label: "What I've learned", lines: ["Experience changes what", "you pay attention to."] },
  statements: [
    {
      line: "More code isn't always more progress.",
      body: "I care about what shipped and what we learned from it. When a team is moving fast and not getting anywhere, I want to know why.",
    },
    {
      line: "The best engineers understand the customer.",
      body: "If you can't connect what you're building to a customer need or a business goal, ask. I'd rather explain it ten times than have a team solving the wrong problem.",
    },
    {
      line: "Clarity is a form of respect.",
      body: "I can work with bad news. Finding out too late is harder. Being direct gives people a chance to respond while there's still time.",
    },
    {
      line: "Ownership means caring what happens after you ship.",
      body: "When something goes wrong, own the recovery and share what you learned.",
    },
    {
      line: "AI can write the code. You still have to understand it.",
      body: "Models sound just as confident when they're wrong. I expect engineers to know what they're shipping.",
    },
    {
      line: "Sometimes the most important decision is what not to build.",
      body: "Most of the value usually sits in a small core. Ship that and see if anyone wants more. Often the rest isn't worth building.",
    },
  ],
} as const;

export const family = {
  heading: { label: "Beyond the code", lines: ["What matters", "most to me", "is at home."] },
  body: [
    "I'm a husband and a dad. I care about the work, and my family comes first.",
    "I want to do meaningful work and still be there for the moments that only happen once.",
  ],
  /** Small, real details: no names, no town. */
  details: [
    "My wife and our three kids",
    "Two red Labs, Yeti and Grizzly",
    "A game on in the house, more often than not",
    "A playlist with no pattern: Avicii, Blink-182, Otis Redding, Black Sabbath",
    "Adventures with the family, books, and tinkering with AI",
  ],
} as const;

export const next = {
  heading: {
    label: "What's next",
    lines: ["I'm still figuring out what's next."],
  },
  turn: "I'm okay with that.",
  exploring: [
    "Building AI-native products people can trust",
    "How AI changes the shape of engineering organizations",
    "Better ways to develop and evaluate agent systems",
    "Helping engineers become stronger product thinkers",
    "Teams that own outcomes",
    "The human side of engineering",
  ],
  writingLabel: "Writing",
  links: [
    { label: "All writing", href: "/blog" },
    { label: "Books I recommend", href: "/reading" },
  ],
} as const;

export const closing = {
  statement: ["Build useful things.", "Lead people well."],
  /** Set apart in the accent face. */
  accent: "Be home for dinner.",
  invitation: "I'm happy to talk about any of this.",
} as const;
