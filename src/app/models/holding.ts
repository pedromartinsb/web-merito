import { Segment } from "./segment";

export interface Holding {
  id?: string;
  name: string;

  segment: Segment;
  segmentId: any;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
