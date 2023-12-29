import { NgxFileDropEntry } from "ngx-file-drop";

export interface Fileinfo {
  id?: string;
  name: string;
  file: NgxFileDropEntry;
}
