import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../employees/services/employee.service';
import jsPDF from 'jspdf';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PersonAppointmentRoutineTask } from 'src/app/models/appointment';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  formGroup: FormGroup;
  employees: any[] =[];
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, 
    private employeeService: EmployeeService, 
    private toast: ToastrService,
    private appointmentService: AppointmentService) 
  {
    this.formGroup = this.fb.group({
      employeeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this._employees();
  }

  _cleanFields(): void {
    this.formGroup.reset();
  }

  _employees() {
    this.isLoading = true;
    this.employeeService.findAllEmployees()
      .subscribe({
        next: (employees) => {
          this.isLoading = false;
          this._cleanFields();
          if (employees != null) {
            employees.forEach((response) => {
              const employee = [
                response.id,
                response.name,
              ];
              this.employees.push(employee);
            });
          }
        },
        error: (ex) => {
          this._handleErrors(ex);
          this.isLoading = false;
        }
      });
  }

  onEmployeeChange(event: any): void {
    this.formGroup.get('employeeId').patchValue(event.target.value);
  }

  onSubmitForm() {
    this.isLoading = true;
    this._generatePDF();
  }

  _generatePDF(): void {
    this.appointmentService.findViewsByPersonIdAndCreatedAtBetween(
      this.formGroup.get('employeeId').value,
      this.formGroup.get('startDate').value,
      this.formGroup.get('endDate').value,
    )
    .subscribe({
      next: (response) => {
        if (response !== null) {
          const appointments: PersonAppointmentRoutineTask[] = response;
          const pdf = new jsPDF('p', 'mm', 'a4');

          // Título principal em estilo minimalista
          pdf.setFontSize(20);
          pdf.setTextColor(0); // Preto para o título
          pdf.text('Relatório de Avaliações', 10, 30);

          // Configurações de layout e estilo
          const pageHeight = pdf.internal.pageSize.height;
          let yPosition = 50; // Posição vertical inicial para o conteúdo
          pdf.setLineWidth(0.1); // Linha fina para separar os itens

          // Adiciona o cabeçalho na primeira página
          pdf.setFontSize(10);
          pdf.setTextColor(150); // Cinza claro para o cabeçalho
          pdf.text('Relatório de Avaliações', 10, 10);
          pdf.text(`Página ${pdf.internal.pages.length - 1}`, 180, 10);

          // Lista de avaliações
          pdf.setFontSize(12);
          pdf.setTextColor(30); // Cinza escuro para o texto dos itens
          pdf.text('Avaliações:', 10, 45);

          // Iteração dos itens da lista com campos adicionais
          appointments.forEach((item, index) => {
            // Verifica se a posição ultrapassa o limite da página
            if (yPosition > pageHeight - 30) {
              pdf.addPage(); // Adiciona nova página
              yPosition = 20; // Reinicia a posição vertical para o início da nova página
              // Adiciona o cabeçalho na nova página
              pdf.setFontSize(10);
              pdf.setTextColor(150); // Cinza claro para o cabeçalho
              pdf.text('Relatório de Avaliações', 10, 10);
              pdf.text(`Página ${pdf.internal.pages.length - 1}`, 180, 10);
              pdf.setTextColor(30); // Reaplica a cor do texto após adicionar nova página
            }

            // Usa valores seguros para evitar undefined
            const personText = `${index + 1}. ${item.name || 'Sem nome'}`;
            const createdAtText = `Data: ${item.createdAt || ''}`;
            const routineText = `Rotina: ${item.routine || '-'}`;
            const descriptionText = `Descrição: ${item.description || '-'}`;
            const justificationText = `Justificativa: ${item.justification || '-'}`;
            const tagText = `Cor: ${item.tag || '-'}`;

            // Nome da pessoa em negrito
            pdf.setFontSize(11);
            pdf.setFont("helvetica", "bold");
            pdf.text(personText, 10, yPosition);

            // Campos adicionais em fonte regular
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text(tagText, 10, yPosition + 7);
            pdf.text(createdAtText, 10, yPosition + 14);
            pdf.text(routineText, 10, yPosition + 21);
            pdf.text(descriptionText, 10, yPosition + 28);
            pdf.text(justificationText, 10, yPosition + 34);

            // Linha de separação entre os itens
            yPosition += 45; // Avança para a próxima posição vertical após todos os campos
            pdf.setDrawColor(220); // Cor de linha separadora em cinza claro
            pdf.line(10, yPosition - 5, 200, yPosition - 5); // Linha horizontal
            yPosition += 5;
          });

          // Salvar o PDF com layout atualizado
          pdf.save(`${appointments[0].name}-${appointments[0].createdAt}.pdf`);

          this._openSuccessModal();
          this._cleanFields();

        } else {
          this._openNoContentModal();
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  _openNoContentModal(): void {
    const modalElement = document.getElementById('noContentModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  _openSuccessModal(): void {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

}
