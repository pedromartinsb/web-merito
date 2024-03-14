import { NgxFileDropEntry } from 'ngx-file-drop';

export interface Document {
  id?: string;
  key: string;
  url: string;
  file: NgxFileDropEntry;
}
