export type AssistantMode =
  | "client_reply"
  | "objection"
  | "product"
  | "measurement"
  | "designer"
  | "service"
  | "aftercare"
  | "script";

export type ResponseTone =
  | "short"
  | "detailed"
  | "premium"
  | "friendly"
  | "messenger"
  | "instagram"
  | "designer"
  | "difficult"
  | "very_short";

export type KnowledgeSection = {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  questions?: string[];
};

export type AssistantRequest = {
  prompt: string;
  mode: AssistantMode;
  tone: ResponseTone;
};

export type AssistantResponse = {
  answer: string;
  nextSteps: string[];
  clarify: string[];
  sources: string[];
};

export type SavedResponse = AssistantResponse & {
  id: string;
  prompt: string;
  mode: AssistantMode;
  tone: ResponseTone;
  createdAt: string;
  favorite?: boolean;
};

export type ObjectionScenario = {
  id: string;
  title: string;
  problem: string;
  avoid: string;
  correct: string;
  shortVersion: string;
  premiumVersion: string;
  nextStep: string;
};
