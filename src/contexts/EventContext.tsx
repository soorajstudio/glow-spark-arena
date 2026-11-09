import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { sound } from "@/lib/sound";

export interface Team {
  id: string;
  name: string;
  color: string; // Tailwind or Hex
  avatar: string; // Emoji or icon
}

export interface BreakIceQuestion {
  id: string;
  question: string;
  imageUrl?: string;
  hint?: string;
  points?: number;
}

export interface PuzzleRoundData {
  id: string;
  title: string;
  answer: string;
  imageUrl?: string;
  iconName?: string;
  clues: string[]; // 9 clues for 3x3 grid
  points: number;
}

export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionImage?: string;
  options: QuizOption[];
  explanation?: string;
  points?: number;
}

export interface QuizCategory {
  id: string;
  name: string;
  color: string;
  questions: QuizQuestion[];
}

export interface MatchPair {
  id: string;
  term: string;
  termImage?: string;
  definition: string;
  definitionImage?: string;
}

export type ThemePreset = "cyber-cyan" | "matrix-emerald" | "solar-amber" | "synth-violet";

export interface EventSettings {
  name: string;
  tagline: string;
  logoUrl?: string;
  theme: ThemePreset;
  timerSeconds: number;
  directPoints: number;
  passedPoints: number;
  soundEnabled: boolean;
  projectorMode: boolean;
}

export interface ScoreLogEntry {
  id: string;
  timestamp: number;
  teamId: string;
  category: string;
  points: number;
  description?: string;
}

export interface EventData {
  version: number;
  settings: EventSettings;
  teams: Team[];
  breakTheIce: {
    title: string;
    description: string;
    questions: BreakIceQuestion[];
  };
  puzzles: PuzzleRoundData[];
  quizWheel: {
    title: string;
    description: string;
    categories: QuizCategory[];
  };
  matchTheLogic: {
    title: string;
    description: string;
    pairs: MatchPair[];
  };
}

// Default Presets
export const DEFAULT_EVENT_DATA: EventData = {
  version: 2,
  settings: {
    name: "SRISHTI AI CLASH",
    tagline: "Srishti Tech Fest Interactive Gaming Arena 2026",
    theme: "cyber-cyan",
    timerSeconds: 30,
    directPoints: 10,
    passedPoints: 5,
    soundEnabled: true,
    projectorMode: false,
  },
  teams: [
    { id: "team-a", name: "Alpha Cyber", color: "#00f0ff", avatar: "⚡" },
    { id: "team-b", name: "Beta Titans", color: "#ff007f", avatar: "🔥" },
    { id: "team-c", name: "Gamma Matrix", color: "#00ff66", avatar: "🚀" },
    { id: "team-d", name: "Delta Nexus", color: "#ffb700", avatar: "🤖" },
  ],
  breakTheIce: {
    title: "Break the Ice",
    description: "Shatter cyber shields to reveal questions and ignite the crowd!",
    questions: [
      {
        id: "ice-1",
        question: "What does 'AI hallucination' mean in modern Generative AI?",
        hint: "Think about confident outputs that are factually fabricated.",
        points: 10,
      },
      {
        id: "ice-2",
        question: "Name two critical ethical concerns regarding AI-generated deepfakes.",
        hint: "Misinformation, identity theft, and consent.",
        points: 10,
      },
      {
        id: "ice-3",
        question: "What is 'prompt engineering' and why is it crucial for LLM reasoning?",
        hint: "Context framing, few-shot examples, and chain-of-thought.",
        points: 10,
      },
      {
        id: "ice-4",
        question: "Cite one real-world breakthrough of responsible AI in modern healthcare.",
        hint: "AlphaFold protein folding, early cancer screening, or clinical diagnostics.",
        points: 10,
      },
    ],
  },
  puzzles: [
    {
      id: "puzzle-0",
      title: "First AI Program",
      answer: "ELIZA (First Conversational Chatbot)",
      iconName: "Brain",
      clues: [
        "Created in the 1960s at MIT Computer Science lab.",
        "Simulated a Rogerian psychotherapist in dialogue.",
        "Relied on keyword substitution and pattern matching.",
        "Authored by pioneer Joseph Weizenbaum.",
        "Widely hailed as the first conversational chatbot in history.",
        "Executed on room-sized IBM 7094 mainframe computers.",
        "Surprised researchers as users attributed human empathy to it.",
        "Laid philosophical foundations for the Turing test discussion.",
        "Named after Eliza Doolittle from Shaw's 'Pygmalion'.",
      ],
      points: 15,
    },
    {
      id: "puzzle-1",
      title: "Social Media Giant",
      answer: "Facebook / Meta (First to 1B Users)",
      iconName: "Globe",
      clues: [
        "Launched from a university dormitory in Cambridge, MA.",
        "Originally restricted exclusively to Ivy League college emails.",
        "Founder became the world's youngest self-made billionaire.",
        "First social network platform in history to cross 1 billion active users.",
        "Rebranded corporate parent to Meta to pursue the immersive spatial web.",
        "Introduced the globally ubiquitous 'Like' button in 2009.",
        "Now connects more than 3 billion people each month.",
        "Founded in early 2004 at Harvard University.",
        "Iconic corporate identity dominated by primary royal blue.",
      ],
      points: 15,
    },
    {
      id: "puzzle-2",
      title: "Dominant Messaging App",
      answer: "WhatsApp (Most Downloaded Chat App)",
      iconName: "MessageSquare",
      clues: [
        "Cross-platform IP messaging client founded in 2009.",
        "Acquired in a landmark $19 billion tech buyout in 2014.",
        "Features Signal protocol end-to-end encryption by default.",
        "Handles over 100 billion daily messages across 2B+ users.",
        "Pioneered lightweight VoIP audio and video calling over cellular.",
        "Branded with an iconic green telephone handset in a speech bubble.",
        "Co-founded by former Yahoo engineers Jan Koum and Brian Acton.",
        "Effectively replaced paid SMS text messages worldwide.",
        "Consistently holds the #1 downloaded communication utility on Google Play.",
      ],
      points: 15,
    },
    {
      id: "puzzle-3",
      title: "Generative AI Phenomenon",
      answer: "ChatGPT (Fastest-Growing Consumer App)",
      iconName: "Bot",
      clues: [
        "Reached 100 million active consumers in just 60 days post-launch.",
        "Developed by research lab OpenAI in San Francisco.",
        "Generates code, essays, debugging logic, and creative prose.",
        "Publicly unveiled to the world in late November 2022.",
        "Harnesses decoder-only Generative Pre-trained Transformers.",
        "Reinforced via RLHF (Reinforcement Learning from Human Feedback).",
        "Sparked the global modern generative artificial intelligence boom.",
        "Supports multimodal visual, voice, and reasoning capabilities.",
        "Synonymous with modern conversational generative AI.",
      ],
      points: 15,
    },
  ],
  quizWheel: {
    title: "AI Quiz Wheel",
    description: "Spin the quantum wheel, pick your battleground, and answer under pressure!",
    categories: [
      {
        id: "cat-basics",
        name: "AI Core",
        color: "hsl(185, 100%, 50%)",
        questions: [
          {
            id: "q-basics-1",
            question: "What fundamentally differentiates Narrow AI (ANI) from Artificial General Intelligence (AGI)?",
            options: [
              { id: "opt-1", text: "Narrow AI performs one dedicated task; AGI matches generalized human cognitive adaptability", isCorrect: true },
              { id: "opt-2", text: "Narrow AI uses deep learning while AGI only uses rule-based systems", isCorrect: false },
              { id: "opt-3", text: "Narrow AI requires supercomputers while AGI runs on microcontrollers", isCorrect: false },
              { id: "opt-4", text: "There is no scientific difference between Narrow AI and AGI", isCorrect: false },
            ],
            explanation: "Narrow AI excels at targeted domains (e.g. chess, image classification), whereas AGI refers to autonomous adaptability across human-level tasks.",
            points: 10,
          },
          {
            id: "q-basics-2",
            question: "Which learning paradigm relies primarily on rewards and penalties rather than labeled datasets?",
            options: [
              { id: "opt-1", text: "Supervised Learning", isCorrect: false },
              { id: "opt-2", text: "Unsupervised Clustering", isCorrect: false },
              { id: "opt-3", text: "Reinforcement Learning (RL)", isCorrect: true },
              { id: "opt-4", text: "Transfer Learning", isCorrect: false },
            ],
            explanation: "Reinforcement Learning optimizes an agent's policy through environmental interactions, maximizing cumulative numerical reward.",
            points: 10,
          },
        ],
      },
      {
        id: "cat-genai",
        name: "GenAI & LLMs",
        color: "hsl(300, 100%, 55%)",
        questions: [
          {
            id: "q-genai-1",
            question: "What core architectural innovation in the 2017 paper 'Attention Is All You Need' enabled LLMs?",
            options: [
              { id: "opt-1", text: "Convolutional Kernels", isCorrect: false },
              { id: "opt-2", text: "Self-Attention Transformer Mechanism", isCorrect: true },
              { id: "opt-3", text: "Recurrent Hidden Markov Gates", isCorrect: false },
              { id: "opt-4", text: "Binary Decision Trees", isCorrect: false },
            ],
            explanation: "Transformers replaced sequential RNNs with parallel self-attention, allowing models to weigh relationships between distant tokens simultaneously.",
            points: 10,
          },
          {
            id: "q-genai-2",
            question: "What is 'Temperature' in language model inference parameters?",
            options: [
              { id: "opt-1", text: "Physical GPU operating heat", isCorrect: false },
              { id: "opt-2", text: "Entropy parameter controlling randomness and creativity of token selection", isCorrect: true },
              { id: "opt-3", text: "The maximum context window size in kilobytes", isCorrect: false },
              { id: "opt-4", text: "The learning rate during fine-tuning", isCorrect: false },
            ],
            explanation: "Higher temperature flattens token probability distributions for creative outputs; lower temperature yields deterministic, focused answers.",
            points: 10,
          },
        ],
      },
      {
        id: "cat-prompts",
        name: "Prompt Eng",
        color: "hsl(130, 100%, 50%)",
        questions: [
          {
            id: "q-prompt-1",
            question: "What does 'Few-Shot Prompting' entail?",
            options: [
              { id: "opt-1", text: "Providing explicit input-output demonstration examples inside the prompt context", isCorrect: true },
              { id: "opt-2", text: "Restricting the prompt length to fewer than 5 words", isCorrect: false },
              { id: "opt-3", text: "Re-running a query fewer than 3 times", isCorrect: false },
              { id: "opt-4", text: "Deleting prompt history after completion", isCorrect: false },
            ],
            explanation: "Few-shot prompting provides contextual demonstrations directly in the input so the LLM identifies patterns without model weight updates.",
            points: 10,
          },
          {
            id: "q-prompt-2",
            question: "Why does 'Chain-of-Thought' (CoT) prompting drastically improve complex mathematical logic?",
            options: [
              { id: "opt-1", text: "It compresses vector embeddings", isCorrect: false },
              { id: "opt-2", text: "It guides the model to produce intermediate reasoning steps before arriving at a final answer", isCorrect: true },
              { id: "opt-3", text: "It bypasses safety guardrails", isCorrect: false },
              { id: "opt-4", text: "It switches the model to Python interpreter mode", isCorrect: false },
            ],
            explanation: "CoT encourages the LLM to spend computational tokens decomposing complex problems into sequential deductions.",
            points: 10,
          },
        ],
      },
      {
        id: "cat-ethics",
        name: "AI Ethics & Safety",
        color: "hsl(40, 100%, 55%)",
        questions: [
          {
            id: "q-ethics-1",
            question: "What is 'algorithmic bias' in automated hiring or lending systems?",
            options: [
              { id: "opt-1", text: "A hardware glitch causing server latency", isCorrect: false },
              { id: "opt-2", text: "Systematic discrimination stemming from historical inequities in training data or model design", isCorrect: true },
              { id: "opt-3", text: "When an AI refuses to generate code", isCorrect: false },
              { id: "opt-4", text: "When AI servers consume excessive electrical power", isCorrect: false },
            ],
            explanation: "Algorithmic bias occurs when training data reflects historical human disparities, leading the model to reproduce or amplify discriminatory outcomes.",
            points: 10,
          },
          {
            id: "q-ethics-2",
            question: "What constitutes 'Watermarking' in synthetic media provenance?",
            options: [
              { id: "opt-1", text: "Embedding cryptographic or perceptual signatures into AI media to identify origin and authenticity", isCorrect: true },
              { id: "opt-2", text: "Cooling data center GPUs with liquid water", isCorrect: false },
              { id: "opt-3", text: "Blurring copyrighted faces in images", isCorrect: false },
              { id: "opt-4", text: "Adding visible logos across the entire screen", isCorrect: false },
            ],
            explanation: "Synthetic watermarking (like SynthID) embeds imperceptible signals in generated images, audio, or text for verification.",
            points: 10,
          },
        ],
      },
    ],
  },
  matchTheLogic: {
    title: "Match the Logic",
    description: "Connect computer science & AI concepts to their accurate specifications!",
    pairs: [
      { id: "m-1", term: "Hallucination", definition: "Model produces confident, syntactically fluent assertions that lack factual truth" },
      { id: "m-2", term: "Prompt Engineering", definition: "Designing context, constraints, and instructions to elicit optimal AI completions" },
      { id: "m-3", term: "Tokenization", definition: "Segmenting natural language into discrete sub-word numerical vectors for LLM ingestion" },
      { id: "m-4", term: "Fine-Tuning", definition: "Adjusting pre-trained neural network parameters on domain-specific curated data" },
      { id: "m-5", term: "RLHF", definition: "Aligning generative model outputs with human values via preference feedback ratings" },
      { id: "m-6", term: "Vector Database", definition: "Storage engine optimized for high-dimensional cosine similarity and semantic search" },
    ],
  },
};

// Alternative Pre-built Theme Presets for Tech Fests
export const TECH_FEST_TEMPLATES: Record<string, { label: string; desc: string; data: Partial<EventData> }> = {
  ai_fest: {
    label: "Responsible AI & Ethics Tech Fest",
    desc: "AI foundations, generative reasoning, alignment, and computer ethics challenges.",
    data: DEFAULT_EVENT_DATA,
  },
  web_dev: {
    label: "Full-Stack Web Dev Olympics",
    desc: "React, TypeScript, CSS architecture, API protocols, and performance tuning.",
    data: {
      settings: {
        ...DEFAULT_EVENT_DATA.settings,
        name: "FULL-STACK CODE CLASH",
        tagline: "Inter-College Web Engineering Tournament 2026",
        theme: "matrix-emerald",
      },
      breakTheIce: {
        title: "Break the Cache",
        description: "Smash through web protocols to reveal live engineering questions!",
        questions: [
          { id: "w-1", question: "What is the key difference between Server-Side Rendering (SSR) and Client-Side Rendering (CSR)?", hint: "Initial HTML payload vs client bundle execution." },
          { id: "w-2", question: "Explain the Critical Rendering Path and how CSS blocks page display.", hint: "DOM + CSSOM = Render Tree." },
          { id: "w-3", question: "What is CORS and why is it strictly enforced by web browsers?", hint: "Same-origin policy security boundary." },
          { id: "w-4", question: "What does WebAssembly (Wasm) enable inside modern web browsers?", hint: "Near-native binary execution for C++, Rust, and Go." },
        ],
      },
      matchTheLogic: {
        title: "Match the Architecture",
        description: "Connect web frameworks and protocols to their core superpower!",
        pairs: [
          { id: "mw-1", term: "Hydration", definition: "Attaching client-side event listeners to static server-rendered HTML markup" },
          { id: "mw-2", term: "WebSockets", definition: "Full-duplex, persistent bidirectional TCP communication channel" },
          { id: "mw-3", term: "Tree Shaking", definition: "Dead-code elimination algorithm that strips unimported JavaScript exports" },
          { id: "mw-4", term: "Service Worker", definition: "Background script enabling progressive offline caching and push notifications" },
          { id: "mw-5", term: "GraphQL", definition: "Declarative API query language allowing clients to request exact data shapes" },
          { id: "mw-6", term: "Virtual DOM", definition: "In-memory abstraction comparing UI state changes via reconciler diffing" },
        ],
      },
    },
  },
  cyber_sec: {
    label: "Cybersecurity & CTF Arena",
    desc: "Ethical hacking, cryptography, vulnerability research, and blue/red team defense.",
    data: {
      settings: {
        ...DEFAULT_EVENT_DATA.settings,
        name: "CYBER MATRIX CTF ARENA",
        tagline: "Annual Hackfest & Defensive Operations Tournament",
        theme: "synth-violet",
      },
      breakTheIce: {
        title: "Breach the Firewall",
        description: "Bypass defensive countermeasures to unlock root access challenges!",
        questions: [
          { id: "c-1", question: "What is Zero-Day vulnerability and why is it considered the highest threat severity?", hint: "No public patch or vendor fix exists yet." },
          { id: "c-2", question: "Explain the difference between Symmetric and Asymmetric encryption.", hint: "Shared single secret vs public/private key pairs." },
          { id: "c-3", question: "What is SQL Injection and how do parameterized queries prevent it?", hint: "Separating executable query logic from user data input." },
          { id: "c-4", question: "What constitutes a Man-In-The-Middle (MITM) attack and how does TLS prevent it?", hint: "Certificate authority trust and session encryption." },
        ],
      },
      matchTheLogic: {
        title: "Match the Threat Vector",
        description: "Connect cyber attacks and concepts to their technical mechanism!",
        pairs: [
          { id: "mc-1", term: "Phishing", definition: "Social engineering deceptive lures to trick victims into revealing sensitive credentials" },
          { id: "mc-2", term: "Buffer Overflow", definition: "Writing data beyond allocated memory bounds, overwriting adjacent control flow pointers" },
          { id: "mc-3", term: "Salting", definition: "Appending random cryptographic strings to passwords prior to one-way hashing" },
          { id: "mc-4", term: "Zero Trust", definition: "Security paradigm enforcing continuous authentication and never trusting implicit network location" },
          { id: "mc-5", term: "DDoS", definition: "Coordinated flood of botnet traffic aimed at exhausting target service capacity" },
          { id: "mc-6", term: "Cross-Site Scripting (XSS)", definition: "Injecting malicious scripts into trusted websites viewed by other end users" },
        ],
      },
    },
  },
};

const STORAGE_KEY = "glow_arena_event_data_v2";
const SCORES_KEY = "glow_arena_scores_v2";
const LOGS_KEY = "glow_arena_score_logs_v2";

interface EventContextType {
  eventData: EventData;
  scores: Record<string, Record<string, number>>;
  scoreLogs: ScoreLogEntry[];
  projectorMode: boolean;
  soundEnabled: boolean;
  toggleProjectorMode: () => void;
  toggleSound: () => void;
  updateSettings: (settings: Partial<EventSettings>) => void;
  updateEventData: (data: Partial<EventData>) => void;
  loadTemplate: (templateKey: string) => void;
  exportConfig: () => void;
  importConfig: (jsonString: string) => boolean;
  resetToDefaults: () => void;
  // Team Management
  addTeam: (name: string, color: string, avatar: string) => void;
  editTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  // Scoring
  addScore: (teamId: string, category: string, points: number, description?: string) => void;
  setTeamScore: (teamId: string, category: string, totalPoints: number) => void;
  undoLastScore: () => void;
  resetAllScores: () => void;
  getTeamTotal: (teamId: string) => number;
  getLeaderboard: () => Array<{ team: Team; total: number; rank: number }>;
}

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  // 1. Event Data
  const [eventData, setEventData] = useState<EventData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === 2) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load stored event data", e);
    }
    return DEFAULT_EVENT_DATA;
  });

  // 2. Scores: Record<teamId, Record<category, number>>
  const [scores, setScores] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const stored = localStorage.getItem(SCORES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    // initialize from teams
    const init: Record<string, Record<string, number>> = {};
    DEFAULT_EVENT_DATA.teams.forEach((t) => {
      init[t.id] = { "Break the Ice": 0, Puzzle: 0, Quiz: 0, Match: 0 };
    });
    return init;
  });

  // 3. Score Logs (Audit trail & Undo support)
  const [scoreLogs, setScoreLogs] = useState<ScoreLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(LOGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eventData));
    } catch (e) {
      console.warn("Storage quota exceeded or error", e);
    }
  }, [eventData]);

  useEffect(() => {
    try {
      localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    } catch {}
  }, [scores]);

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_KEY, JSON.stringify(scoreLogs));
    } catch {}
  }, [scoreLogs]);

  // Synchronize sound engine state
  useEffect(() => {
    sound.enabled = eventData.settings.soundEnabled;
  }, [eventData.settings.soundEnabled]);

  // Ensure all current teams have an entry in scores
  useEffect(() => {
    setScores((prev) => {
      let changed = false;
      const next = { ...prev };
      eventData.teams.forEach((t) => {
        if (!next[t.id]) {
          next[t.id] = { "Break the Ice": 0, Puzzle: 0, Quiz: 0, Match: 0 };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [eventData.teams]);

  // Sound toggle
  const toggleSound = useCallback(() => {
    setEventData((prev) => {
      const next = !prev.settings.soundEnabled;
      sound.enabled = next;
      if (next) sound.playClick();
      return {
        ...prev,
        settings: { ...prev.settings, soundEnabled: next },
      };
    });
  }, []);

  // Projector mode toggle
  const toggleProjectorMode = useCallback(() => {
    sound.playClick();
    setEventData((prev) => ({
      ...prev,
      settings: { ...prev.settings, projectorMode: !prev.settings.projectorMode },
    }));
  }, []);

  // Update Settings
  const updateSettings = useCallback((settings: Partial<EventSettings>) => {
    sound.playClick();
    setEventData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, []);

  // General Update
  const updateEventData = useCallback((updates: Partial<EventData>) => {
    sound.playClick();
    setEventData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Load Template
  const loadTemplate = useCallback((templateKey: string) => {
    const tmpl = TECH_FEST_TEMPLATES[templateKey];
    if (tmpl) {
      sound.playReveal();
      setEventData((prev) => ({
        ...prev,
        ...tmpl.data,
        settings: {
          ...prev.settings,
          ...tmpl.data.settings,
        },
      }));
    }
  }, []);

  // Export JSON
  const exportConfig = useCallback(() => {
    sound.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(eventData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${eventData.settings.name.toLowerCase().replace(/\s+/g, "-")}-config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [eventData]);

  // Import JSON
  const importConfig = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.teams && parsed.settings) {
        sound.playVictory();
        setEventData(parsed);
        return true;
      }
    } catch (e) {
      console.error("Invalid config JSON", e);
    }
    sound.playWrong();
    return false;
  }, []);

  // Reset to default
  const resetToDefaults = useCallback(() => {
    sound.playBuzzer();
    setEventData(DEFAULT_EVENT_DATA);
  }, []);

  // Team CRUD
  const addTeam = useCallback((name: string, color: string, avatar: string) => {
    sound.playClick();
    const id = `team-${Date.now()}`;
    const newTeam: Team = { id, name, color, avatar };
    setEventData((prev) => ({
      ...prev,
      teams: [...prev.teams, newTeam],
    }));
    setScores((prev) => ({
      ...prev,
      [id]: { "Break the Ice": 0, Puzzle: 0, Quiz: 0, Match: 0 },
    }));
  }, []);

  const editTeam = useCallback((id: string, updates: Partial<Team>) => {
    sound.playClick();
    setEventData((prev) => ({
      ...prev,
      teams: prev.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const removeTeam = useCallback((id: string) => {
    sound.playClick();
    setEventData((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== id),
    }));
    setScores((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // Score management
  const addScore = useCallback((teamId: string, category: string, points: number, description?: string) => {
    if (points > 0) sound.playCorrect();
    else sound.playWrong();

    const logEntry: ScoreLogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      teamId,
      category,
      points,
      description,
    };

    setScores((prev) => {
      const teamScores = prev[teamId] || { "Break the Ice": 0, Puzzle: 0, Quiz: 0, Match: 0 };
      const current = teamScores[category] || 0;
      return {
        ...prev,
        [teamId]: {
          ...teamScores,
          [category]: current + points,
        },
      };
    });

    setScoreLogs((prev) => [logEntry, ...prev.slice(0, 49)]); // keep latest 50 logs
  }, []);

  const setTeamScore = useCallback((teamId: string, category: string, totalPoints: number) => {
    setScores((prev) => {
      const teamScores = prev[teamId] || {};
      return {
        ...prev,
        [teamId]: {
          ...teamScores,
          [category]: Math.max(0, totalPoints),
        },
      };
    });
  }, []);

  const undoLastScore = useCallback(() => {
    if (scoreLogs.length === 0) return;
    sound.playClick();
    const [last, ...remaining] = scoreLogs;
    setScores((prev) => {
      const teamScores = prev[last.teamId] || {};
      const current = teamScores[last.category] || 0;
      return {
        ...prev,
        [last.teamId]: {
          ...teamScores,
          [last.category]: Math.max(0, current - last.points),
        },
      };
    });
    setScoreLogs(remaining);
  }, [scoreLogs]);

  const resetAllScores = useCallback(() => {
    sound.playBuzzer();
    const clean: Record<string, Record<string, number>> = {};
    eventData.teams.forEach((t) => {
      clean[t.id] = { "Break the Ice": 0, Puzzle: 0, Quiz: 0, Match: 0 };
    });
    setScores(clean);
    setScoreLogs([]);
  }, [eventData.teams]);

  const getTeamTotal = useCallback(
    (teamId: string) => {
      const teamScores = scores[teamId];
      if (!teamScores) return 0;
      return Object.values(teamScores).reduce((a, b) => a + b, 0);
    },
    [scores]
  );

  const getLeaderboard = useCallback(() => {
    const list = eventData.teams.map((team) => ({
      team,
      total: getTeamTotal(team.id),
      rank: 1,
    }));
    list.sort((a, b) => b.total - a.total);
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [eventData.teams, getTeamTotal]);

  return (
    <EventContext.Provider
      value={{
        eventData,
        scores,
        scoreLogs,
        projectorMode: eventData.settings.projectorMode,
        soundEnabled: eventData.settings.soundEnabled,
        toggleProjectorMode,
        toggleSound,
        updateSettings,
        updateEventData,
        loadTemplate,
        exportConfig,
        importConfig,
        resetToDefaults,
        addTeam,
        editTeam,
        removeTeam,
        addScore,
        setTeamScore,
        undoLastScore,
        resetAllScores,
        getTeamTotal,
        getLeaderboard,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvent must be used within an EventProvider");
  return ctx;
};
