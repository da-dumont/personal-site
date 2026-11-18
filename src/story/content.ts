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
    "I'm an engineering leader, builder, husband, and dad. I spend my days figuring out how to turn complicated ideas into useful products, and how to help good people do the best work of their careers.",
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
    "I've spent a large part of my life building software, but the things I care about go well beyond the software itself.",
  facts: ["Massachusetts", "Roots in front-end engineering and design", "15+ years building software"],
} as const;

/** A short label above a chapter's headline, and the headline's lines. */
export interface ChapterHeading {
  label: string;
  lines: readonly string[];
}

export const building = {
  heading: { label: "How I build", lines: ["The technology matters.", "The problem matters more."] },
  beats: [
    {
      title: "Understand the problem.",
      body: "Every decision starts with one question: does this make things better for the person using the product? Most hard problems don't arrive with clean answers, so I stay in the ambiguity long enough to understand it, without letting it stall the team.",
    },
    {
      title: "Make the complicated understandable.",
      body: "Early decisions compound. A name becomes an abstraction, an abstraction becomes a pattern, a pattern becomes architecture. I favor systems that are explicit and straightforward over ones that are clever and rigid.",
    },
    {
      title: "Build something that actually works.",
      body: "Get something real in front of people quickly, learn what matters, and build from there. Most features have a core that delivers most of the value. Ship that, validate it, then decide whether the rest is worth building.",
    },
  ],
  /** The layers of the interactive diagram, top to bottom. */
  layers: [
    {
      id: "customer",
      name: "Customer",
      note: "Not cleaner internally. Not more architecturally elegant. Better for the person using it. If we can't say how, it's worth pausing before we build.",
    },
    {
      id: "experience",
      name: "Experience",
      note: "My roots are in front-end engineering and design. How a product feels to use is part of whether it works, not a coat of paint on top.",
    },
    {
      id: "logic",
      name: "Product logic",
      note: "Find the version that delivers most of the value for a fraction of the work. Ship it, learn from it, and only then decide what else to build.",
    },
    {
      id: "platform",
      name: "Platform",
      note: "Design for adaptability, not correctness. Being right up front matters less than being easy to change later. Make being wrong recoverable.",
    },
    {
      id: "signals",
      name: "Signals",
      note: "A feature shipped to a small group with a clear signal beats a broad launch with vague engagement data. Shipping isn't progress if nothing is learned from it.",
    },
  ],
  layersHint: "Select a layer to see how I think about it.",
} as const;

export const leadership = {
  heading: { label: "Leadership", lines: ["Great teams don't", "happen by accident."] },
  principles: [
    { name: "Accountability", line: "Own the outcome.", body: ["Not just the task.", "Not just the ticket.", "The actual result."] },
    {
      name: "Clarity",
      line: "Say what matters.",
      body: ["Make decisions understandable.", "Remove confusion.", "Give people the context to act."],
    },
    {
      name: "Urgency",
      line: "Make progress count.",
      body: ["Move deliberately.", "Don't confuse process with progress."],
    },
  ],
  reflection: [
    "Leadership isn't demanding more output. It's coaching engineers, building judgment, and helping a team understand why its work matters.",
    "I hire and develop people I'd want to work for, give them context and clear goals, then get out of the way. I want engineers who challenge me, bring product judgment, and understand what they're building instead of trusting whatever the AI hands back.",
  ],
} as const;

export const ai = {
  heading: {
    label: "Building with AI",
    lines: ["AI is changing how we build."],
  },
  /** The second, quieter half of the headline. */
  turn: "I'm more interested in how it changes what we can build.",
  shift: [
    "When generating code is cheap and fast, the old walls between engineering, product, and design matter less. Builders are builders.",
    "The bottleneck used to be writing enough code. Now it's unclear context and ownership gaps before anything exists, and review queues and the gap between done and shipped after. The loop I push toward: frame, build, observe, adjust.",
  ],
  loopTitle: "How an AI-native product works",
  stages: [
    {
      id: "understand",
      name: "Understand",
      note: "Context comes first. An assistant is only as useful as what it knows about the business: its customers, what has worked before, what's happening this week.",
    },
    {
      id: "recommend",
      name: "Recommend",
      note: "Turn that context into a short list of what matters next, with the reasoning visible, so a person can judge it instead of taking it on faith.",
    },
    {
      id: "act",
      name: "Act",
      note: "Agents use real tools to do the work, in durable workflows that survive retries and restarts, with a human deciding what goes out.",
    },
    {
      id: "measure",
      name: "Measure",
      note: "Observe what actually happened: evaluations and tracing on the system itself, and real outcomes for the business it serves.",
    },
    {
      id: "learn",
      name: "Learn",
      note: "Feed the results back into the context, so the next recommendation is better than the last.",
    },
  ],
  catalyst: {
    now: {
      label: "What I'm building now",
      body: "At Constant Contact, I'm helping build Catalyst, an AI marketing assistant for small businesses. It's a shift from handing owners tools to run their marketing themselves, toward an assistant that understands their business, recommends what matters, and helps get the work done.",
    },
    next: {
      label: "Where it's going",
      body: "The ambition is the full loop: an assistant that learns from the results, so each round of recommendations gets better. That's the part I find most interesting, and it's still being built.",
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
        "Director of Software Engineering on Catalyst, Constant Contact's AI-native marketing product for small businesses: agent systems, AI-native product experiences, engineering leadership, and the product development around them.",
      roles: [{ title: "Director of Software Engineering", years: "May 2026–now" }],
    },
    {
      id: "linksquares",
      years: "2021–2026",
      company: "LinkSquares",
      product: "Platform, integrations and frontend",
      summary:
        "Joined during a period of rapid growth and scaled the team while integrating 30+ new engineers. Went on to lead Platform, Integrations, DevOps, and Frontend across multiple teams and engineering managers at a Series C SaaS company, owning customer-facing product areas and the systems behind them.",
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
        "Twelve years, starting as an email template developer and growing through UX and front-end engineering into management. By the end, I led a 17-engineer Email Authoring organization supporting a revenue-critical product used by thousands of people every day.",
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
      body: "What shipped? What changed? What did we learn? A team moving fast without making progress is a problem worth understanding. Busy is not the goal.",
    },
    {
      line: "The best engineers understand the customer.",
      body: "If you can't connect what you're building to a customer need or a business goal, ask. I'd rather explain it ten times than have a team solving the wrong problem.",
    },
    {
      line: "Clarity is a form of respect.",
      body: "I can work with bad news. Finding out too late is harder. Being direct, even when it's uncomfortable, gives people the chance to respond while there's still room to.",
    },
    {
      line: "Ownership means caring what happens after you ship.",
      body: "When something goes wrong, own the recovery and share what you learned. Shipping isn't the finish line.",
    },
    {
      line: "AI can accelerate the work. It shouldn't replace the thinking.",
      body: "I want engineers who understand what they're building, not ones who trust an implementation because a model wrote it confidently.",
    },
    {
      line: "Sometimes the most important decision is what not to build.",
      body: "Find the core that delivers the value, ship it, validate it, and then decide whether the rest is worth building. Often it isn't.",
    },
  ],
} as const;

export const family = {
  heading: { label: "Beyond the code", lines: ["The most important things", "I'm building aren't", "made of software."] },
  body: [
    "I'm a husband and a dad. And as much as I care about what I build at work, the people waiting for me at home matter more.",
    "I want to do meaningful work. I also want to be there for the moments that don't happen twice.",
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
  turn: "That's part of what makes it interesting.",
  exploring: [
    "Building AI-native products people can trust",
    "How AI changes the shape of engineering organizations",
    "Better ways to develop and evaluate agent systems",
    "Helping engineers become stronger product thinkers",
    "Teams that own outcomes, not activity",
    "Keeping the human part of engineering front and center",
  ],
  writingLabel: "Writing",
  links: [
    { label: "All writing", href: "/blog" },
    { label: "Books I recommend", href: "/reading" },
  ],
} as const;

export const closing = {
  statement: ["Build things that matter.", "Lead people well."],
  /** Set apart in the accent face. */
  accent: "Don't forget what matters most.",
  invitation: "If any of this resonates, I'd like to hear from you.",
} as const;
