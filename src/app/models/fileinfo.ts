import { NgxFileDropEntry } from "ngx-file-drop";

export interface Fileinfo {
  id?: string;
  key: string;
  url: string;
  file: NgxFileDropEntry;
}
