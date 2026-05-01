export type QuestionOption = {
  letter: string;
  text: string;
};

export type Question = {
  id: string;
  number: number;
  title: string;
  helper: string;
  options: QuestionOption[];
  multiSelect?: boolean;
  maxSelect?: number;
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    number: 1,
    title: "Where's your Amazon revenue today?",
    helper: "Annualized run rate is fine. Round if you have to.",
    options: [
      { letter: "A", text: "Under $5M" },
      { letter: "B", text: "$5M\u2013$10M" },
      { letter: "C", text: "$10M\u2013$25M" },
      { letter: "D", text: "$25M\u2013$75M" },
      { letter: "E", text: "$75M+" },
    ],
  },
  {
    id: "q2",
    number: 2,
    title:
      "What's your contribution margin on Amazon, after fees, ads, and returns?",
    helper:
      "If you don't track it that way, give your best read. Most brands underestimate this number by 3\u20135 points.",
    options: [
      { letter: "A", text: "Negative or break-even" },
      { letter: "B", text: "1\u201310%" },
      { letter: "C", text: "11\u201320%" },
      { letter: "D", text: "21\u201330%" },
      { letter: "E", text: "30%+" },
      { letter: "F", text: "Not sure / don't track" },
    ],
  },
  {
    id: "q3",
    number: 3,
    title: "Who runs Amazon for you today?",
    helper:
      "Pick the closest. Hybrid is fine if it's actually how you operate.",
    options: [
      { letter: "A", text: "In-house team, 3+ people" },
      { letter: "B", text: "In-house, 1\u20132 people wearing other hats" },
      {
        letter: "C",
        text: "Agency on retainer (we still own 1P/3P relationship)",
      },
      {
        letter: "D",
        text: "2P operator / aggregator (they buy our inventory)",
      },
      {
        letter: "E",
        text: "Founder + part-time help / Fiverr / nothing structured",
      },
    ],
  },
  {
    id: "q4",
    number: 4,
    title:
      "How would you describe your Amazon inventory and fulfillment situation?",
    helper: "Pick the answer closest to the last 90 days.",
    options: [
      { letter: "A", text: "FBA-only, rarely OOS" },
      {
        letter: "B",
        text: "FBA-only, 1\u20133 OOS events per quarter on hero SKUs",
      },
      { letter: "C", text: "FBA + FBM mix, occasional OOS" },
      {
        letter: "D",
        text: "FBM-heavy or 3PL-routed (we manage units ourselves)",
      },
      { letter: "E", text: "OOS more often than we'd like to admit" },
    ],
  },
  {
    id: "q5",
    number: 5,
    title:
      "How exposed are you on brand defense \u2014 counterfeits, unauthorized sellers, MAP erosion?",
    helper:
      "If you've checked your hero SKU on Amazon in the last 30 days, you know.",
    options: [
      {
        letter: "A",
        text: "Locked down. Brand registry active, no unauthorized sellers I'm aware of, MAP holds.",
      },
      {
        letter: "B",
        text: "Mostly clean, 1\u20132 unauthorized sellers we tolerate or chase quarterly.",
      },
      {
        letter: "C",
        text: "Persistent unauthorized sellers, we play whack-a-mole.",
      },
      {
        letter: "D",
        text: "MAP is broken on at least one hero SKU.",
      },
      { letter: "E", text: "Honestly haven't checked recently." },
    ],
  },
  {
    id: "q6",
    number: 6,
    title: "Where do you sit in your category on Amazon today?",
    helper:
      "Best guess. The diagnostic adjusts using SmartScout category data on the back end.",
    options: [
      { letter: "A", text: "Top 3 in our subcategory" },
      { letter: "B", text: "Top 10, not top 3" },
      {
        letter: "C",
        text: "Mid-pack. We exist, we're not winning.",
      },
      {
        letter: "D",
        text: "Behind. We watch competitors out-position us on Page 1.",
      },
      { letter: "E", text: "Not sure how to rank ourselves." },
    ],
  },
  {
    id: "q7",
    number: 7,
    title:
      "What are your top 1\u20132 frustrations on Amazon right now?",
    helper: "Pick up to two. The honest answer beats the strategic one.",
    multiSelect: true,
    maxSelect: 2,
    options: [
      {
        letter: "A",
        text: "Stagnant growth \u2014 we're up YoY but the category is up more",
      },
      {
        letter: "B",
        text: "Margin pressure \u2014 Amazon is profitable but worse every quarter",
      },
      {
        letter: "C",
        text: "Agency frustration \u2014 we're paying for output we could do ourselves",
      },
      {
        letter: "D",
        text: "Account health risk \u2014 suspensions, IP claims, listing pulls",
      },
      {
        letter: "E",
        text: "Brand control \u2014 unauthorized sellers, MAP, counterfeits",
      },
      {
        letter: "F",
        text: "Channel expansion stalled \u2014 TikTok Shop / Walmart can't operate",
      },
      { letter: "G", text: "Inventory and forecasting" },
      { letter: "H", text: "Other" },
    ],
  },
  {
    id: "q8",
    number: 8,
    title: "What does success on Amazon look like in twelve months?",
    helper:
      "Be honest. The growth score weights ambition against current scale.",
    options: [
      {
        letter: "A",
        text: "Hold the line. We're happy where we are.",
      },
      {
        letter: "B",
        text: "Grow 20\u201340% on Amazon, status quo elsewhere",
      },
      {
        letter: "C",
        text: "Grow 40%+ on Amazon AND launch one new channel (TikTok Shop, Walmart, DTC)",
      },
      {
        letter: "D",
        text: "Replace our agency and build it in-house or with a 2P partner",
      },
      {
        letter: "E",
        text: "Honestly, we want a partner who runs it for us so we can focus on retail and brand",
      },
    ],
  },
];

export const CATEGORY_OPTIONS = [
  { value: "pet", label: "Pet" },
  { value: "food-bev", label: "Food & Beverage" },
  { value: "beauty", label: "Beauty" },
  { value: "supplements", label: "Supplements" },
  { value: "home", label: "Home" },
  { value: "other", label: "Other" },
];

export const ROLE_OPTIONS = [
  "CEO/Founder",
  "CFO",
  "VP eCommerce",
  "Director eCommerce",
  "Marketing Lead",
  "Operations",
  "Other",
];
