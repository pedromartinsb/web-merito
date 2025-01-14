export interface Suggestion {
  id?: string;
  title: string;
  description: string;
  answer: string;
  suggestionType: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export enum SuggestionType {
  CREATED = 'CREATED',
  ANSWERED = 'ANSWERED',
}
