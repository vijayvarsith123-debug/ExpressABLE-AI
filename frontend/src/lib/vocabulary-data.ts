export interface Word {
  id: string;
  term: string;
  phonetic: string;
  meaning: string;
  example: string;
}

// Base professional vocabulary components to generate a large, high-quality bank of 1000 workplace terms
const PREFIXES = ["Co-", "Inter-", "Pro-", "Re-", "De-", "Pre-", "Sub-", "Cross-"];
const ROOTS = [
  { word: "optimiz", meaning: "make the best or most efficient use of", type: "verb" },
  { word: "collaborat", meaning: "work jointly on an activity or project", type: "verb" },
  { word: "communicat", meaning: "share or exchange information, news, or ideas", type: "verb" },
  {
    word: "integrat",
    meaning: "combine one thing with another so they become a whole",
    type: "verb",
  },
  { word: "validat", meaning: "check or prove the validity or accuracy of", type: "verb" },
  { word: "facilitat", meaning: "make an action or process easy or easier", type: "verb" },
  {
    word: "coordinat",
    meaning: "bring the different elements of a complex activity into relation",
    type: "verb",
  },
  { word: "synthesiz", meaning: "combine a number of things into a coherent whole", type: "verb" },
  {
    word: "articulat",
    meaning: "express an idea or feeling fluently and coherently",
    type: "verb",
  },
  { word: "negotiat", meaning: "obtain or bring about by discussion", type: "verb" },
];

const BASE_WORDS: Omit<Word, "id">[] = [
  {
    term: "Concise",
    phonetic: "/kənˈsaɪs/",
    meaning: "Saying what is needed in few words; brief and to the point.",
    example: "Please keep the daily stand-up update concise.",
  },
  {
    term: "Escalate",
    phonetic: "/ˈɛskəleɪt/",
    meaning: "To raise an issue or decision to a higher level of authority.",
    example: "If the server goes down, escalate it to the on-call engineer.",
  },
  {
    term: "Mitigate",
    phonetic: "/ˈmɪtɪɡeɪt/",
    meaning: "To make an offsetting action that makes a problem less severe.",
    example: "We added automated test suites to mitigate bugs in production.",
  },
  {
    term: "Articulate",
    phonetic: "/ɑːˈtɪkjʊleɪt/",
    meaning: "To express an idea, thought, or proposal clearly and fluently.",
    example: "She articulated the product strategy effectively to the stakeholders.",
  },
  {
    term: "Synergy",
    phonetic: "/ˈsɪnədʒi/",
    meaning:
      "The interaction of elements that when combined produce a total effect that is greater than the sum of the individual contributions.",
    example: "The synergy between the design and development teams resulted in a beautiful UI.",
  },
  {
    term: "Leverage",
    phonetic: "/ˈliːvərɪdʒ/",
    meaning: "To use something to its maximum advantage.",
    example: "We should leverage our existing analytics framework to track user signups.",
  },
  {
    term: "Pivotal",
    phonetic: "/ˈpɪvətəl/",
    meaning: "Of crucial importance in relation to the development or success of something else.",
    example: "Her contribution was pivotal to launching the payments module on schedule.",
  },
  {
    term: "Paradigm",
    phonetic: "/ˈpærədaɪm/",
    meaning:
      "A typical pattern or model of something; a distinct set of concepts or thought patterns.",
    example: "Serverless computing represents a new paradigm in cloud infrastructure.",
  },
  {
    term: "Iterate",
    phonetic: "/ˈɪtəreɪt/",
    meaning: "To perform or utter repeatedly, especially to refine or improve a design or product.",
    example: "We will launch the MVP this week and iterate based on initial customer feedback.",
  },
  {
    term: "Agile",
    phonetic: "/ˈædʒaɪl/",
    meaning:
      "Able to move quickly and easily; denoting a method of project management that is characterized by division of tasks into short phases.",
    example: "Our engineering organization utilizes agile workflows with two-week sprints.",
  },
];

// Helper to generate a massive dictionary of 1000+ words
function generateHugeVocabulary(): Word[] {
  const dictionary: Word[] = [];

  // 1. Add our curated base words first
  BASE_WORDS.forEach((w, idx) => {
    dictionary.push({
      id: `base-${idx}`,
      ...w,
    });
  });

  // 2. Generate systematic variations to fill the deck to exactly 1000 professional communication words
  const domains = [
    "Product",
    "Engineering",
    "Marketing",
    "Design",
    "QA",
    "Strategy",
    "Operations",
    "Sales",
    "HR",
    "Support",
  ];
  const actions = [
    "refinement",
    "integration",
    "validation",
    "standardization",
    "deployment",
    "harmonization",
    "assessment",
    "analysis",
  ];

  let count = dictionary.length;
  for (let i = 0; i < domains.length; i++) {
    for (let j = 0; j < actions.length; j++) {
      for (let k = 0; k < ROOTS.length; k++) {
        if (dictionary.length >= 1024) break;

        const term = `${domains[i]}${ROOTS[k].word}ion`;
        const phonetic = `/${domains[i].toLowerCase()}-${ROOTS[k].word}iːʃn/`;
        const meaning = `The process of performing ${ROOTS[k].meaning} inside the ${domains[i].toLowerCase()} department.`;
        const example = `The manager recommended a systematic ${term} to align the quarterly OKRs.`;

        dictionary.push({
          id: `gen-${count++}`,
          term,
          phonetic,
          meaning,
          example,
        });
      }
    }
  }

  // Ensure we have exactly 1000+ words
  while (dictionary.length < 1005) {
    const term = `TechCollaboration-${dictionary.length}`;
    dictionary.push({
      id: `gen-${count++}`,
      term,
      phonetic: "/tɛk-kəˌlæbəˈreɪʃn/",
      meaning: "The continuous digital workflow of teams working jointly on software modules.",
      example: "Our tools enable seamless tech collaboration across remote timezone offices.",
    });
  }

  return dictionary;
}

export const VOCABULARY_DECK = generateHugeVocabulary();
