import { NgxFileDropEntry } from 'ngx-file-drop';
import { Responsibility } from './responsibility';

export interface Document {
  id?: string;
  key: string;
  createdAt: string;
  url: string;
  file: NgxFileDropEntry;
  responsibility: Responsibility;
}
