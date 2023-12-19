import { Segment } from "./segment";

export interface Holding {
  id?: string;
  name: string;

  segmentId: any;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
