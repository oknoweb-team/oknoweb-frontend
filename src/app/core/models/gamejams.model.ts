export interface GameJamPayload {
  link: string;
  startDate: string;
  endDate: string;
  content: string[];
}

export interface CommunityContentPayload {
  link: string;
  author: string;
  label: string;
  description: string;
}

export interface CommunityContent {
  id: string;
  link: string;
  author: string;
  label: string;
  description: string;
}

export interface GameJam {
  id: string;
  title: string;
  link: string;
  startDate: string;
  endDate: string;
  content: CommunityContent[];
  coverLink: string;
  results: string[];
}
