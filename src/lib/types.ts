export type Driver = "Income" | "Leads" | "Growth" | "Nurture";

export type Pillar =
  | "The Book"
  | "Personal Journey"
  | "Black People in Entertainment"
  | "Coffee"
  | "Music";

export type Delivery =
  | "Face to Camera"
  | "Voiceover"
  | "B-Roll"
  | "Reaction"
  | "Trending";

export type Value =
  | "Educational"
  | "Entertaining"
  | "Relatable"
  | "Inspirational";

export type HookType =
  | "Common Misconception"
  | "Bold Statement"
  | "Relatable Moment"
  | "Question"
  | "Pattern Interrupt";

export interface GeneratedScript {
  driver: Driver;
  pillar: Pillar;
  delivery: Delivery;
  value: Value;
  hookType: HookType;
  topic: string;
  content: string;
}

export interface GenerateRequest {
  driver: Driver;
  pillar: Pillar | "Auto";
  delivery: Delivery | "Auto";
  count: number;
  apiKey: string;
}
