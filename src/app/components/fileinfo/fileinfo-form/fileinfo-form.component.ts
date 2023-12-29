import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FileinfoService } from 'src/app/services/fileinfo.service';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { Fileinfo } from 'src/app/models/fileinfo';

@Component({
  selector: 'app-fileinfo-form',
  templateUrl: './fileinfo-form.component.html',
  styleUrls: ['./fileinfo-form.component.css']
})
export class FileinfoFormComponent implements OnInit {

  files: NgxFileDropEntry[] = [];

  constructor(
    private fileinfoService: FileinfoService,
    private toast: ToastrService,
    private router: Router,    
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {}

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
  }

  public onSave() {
    if (this.files && this.files.length > 0) {
      const firstFile = this.files[0];

      if (firstFile.fileEntry.isFile) {
        const fileEntry = firstFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.fileinfoService.uploadFile(file).subscribe({
            next: () => {
              this.toast.success('Documento enviado com sucesso', 'Cadastro');
              this.router.navigate(['fileinfo']);
            },
            error: (ex) => {
              this.handleErrors(ex);
            },
          });
        });
      }
    }
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach(element => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }
}
