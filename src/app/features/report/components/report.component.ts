import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EmployeeService } from "../../employees/services/employee.service";
import jsPDF from "jspdf";
import { AppointmentService } from "src/app/services/appointment.service";
import { PersonAppointmentRoutineTask } from "src/app/models/appointment";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import { ProfessionalsService } from "../../professionals/services/professionals.service";
import { SuppliersService } from "../../suppliers/services/suppliers.service";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.css"],
})
export class ReportComponent implements OnInit {
  formGroup: FormGroup;
  employees: any[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private professionalsService: ProfessionalsService,
    private suppliersService: SuppliersService,
    private toast: ToastrService,
    private appointmentService: AppointmentService
  ) {
    this.formGroup = this.fb.group({
      employeeId: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this._suppliers();
    this._professionals();
    this._employees();
    this.employees.sort((a, b) => a.name.localeCompare(b.name));
  }

  _cleanFields(): void {
    this.formGroup.reset();
  }

  _employees() {
    this.isLoading = true;
    this.employeeService.findAllEmployees().subscribe({
      next: (employees) => {
        this.isLoading = false;
        this._cleanFields();
        if (employees != null) {
          employees.forEach((response) => {
            const employee = [response.id, response.name];
            this.employees.push(employee);
          });
        }
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.isLoading = false;
      },
    });
  }

  _professionals() {
    this.isLoading = true;
    this.professionalsService.findAllProfessionals().subscribe({
      next: (employees) => {
        this.isLoading = false;
        this._cleanFields();
        if (employees != null) {
          employees.forEach((response) => {
            const employee = [response.id, response.name];
            this.employees.push(employee);
          });
        }
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.isLoading = false;
      },
    });
  }

  _suppliers() {
    this.isLoading = true;
    this.suppliersService.findAllSuppliers().subscribe({
      next: (employees) => {
        this.isLoading = false;
        this._cleanFields();
        if (employees != null) {
          employees.forEach((response) => {
            const employee = [response.id, response.name];
            this.employees.push(employee);
          });
        }
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.isLoading = false;
      },
    });
  }

  onEmployeeChange(event: any): void {
    this.formGroup.get("employeeId").patchValue(event.target.value);
  }

  onSubmitForm() {
    this.isLoading = true;
    this._generatePDF();
  }

  async _generatePDF(): Promise<void> {
    this.isLoading = true;
    this.appointmentService
      .findViewsByPersonIdAndCreatedAtBetween(
        this.formGroup.get("employeeId").value,
        this.formGroup.get("startDate").value,
        this.formGroup.get("endDate").value
      )
      .subscribe({
        next: async (response) => {
          if (response !== null) {
            const appointments: PersonAppointmentRoutineTask[] = response;
            const pdf = new jsPDF("p", "mm", "a4");

            // Título principal em estilo minimalista
            pdf.setFontSize(20);
            pdf.setTextColor(0); // Preto para o título
            pdf.text("Relatório de Avaliações", 10, 30);

            // Gerar Base64 do emoji
            // const emojiBase64 = await this._generateEmojiBase64("😊");
            // Adicionar o emoji como imagem ao PDF
            // pdf.addImage(emojiBase64, "PNG", 10, 20, 20, 20); // X, Y, largura, altura

            // Configurações de layout e estilo
            const pageHeight = pdf.internal.pageSize.height;
            let yPosition = 50; // Posição vertical inicial para o conteúdo
            pdf.setLineWidth(0.1); // Linha fina para separar os itens

            // Adiciona o cabeçalho na primeira página
            pdf.setFontSize(10);
            pdf.setTextColor(150); // Cinza claro para o cabeçalho
            pdf.text("Relatório de Avaliações", 10, 10);
            pdf.text(`Página ${pdf.internal.pages.length - 1}`, 180, 10);

            // Lista de avaliações
            pdf.setFontSize(12);
            pdf.setTextColor(30); // Cinza escuro para o texto dos itens
            pdf.text("Avaliações:", 10, 45);

            // Iteração dos itens da lista com campos adicionais
            appointments.forEach((item, index) => {
              // Verifica se a posição ultrapassa o limite da página
              if (yPosition > pageHeight - 30) {
                pdf.addPage(); // Adiciona nova página
                yPosition = 20; // Reinicia a posição vertical para o início da nova página
                // Adiciona o cabeçalho na nova página
                pdf.setFontSize(10);
                pdf.setTextColor(150); // Cinza claro para o cabeçalho
                pdf.text("Relatório de Avaliações", 10, 10);
                pdf.text(`Página ${pdf.internal.pages.length - 1}`, 180, 10);
                pdf.setTextColor(30); // Reaplica a cor do texto após adicionar nova página
              }

              // Usa valores seguros para evitar undefined
              const personText = `${index + 1}. ${item.name || "Sem nome"}`;
              const createdAtText = `Data: ${item.createdAt || ""}`;
              const routineText = `Rotina: ${item.routine || "-"}`;
              const descriptionText = `Descrição: ${item.description || "-"}`;
              const justificationText = `Justificativa: ${item.justification || "-"}`;
              const tagText = `Cor: ${item.tag || "-"}`;

              // Nome da pessoa em negrito
              pdf.setFontSize(11);
              pdf.setFont("helvetica", "bold");
              pdf.text(personText, 10, yPosition);

              // Campos adicionais em fonte regular
              pdf.setFontSize(10);
              pdf.setFont("helvetica", "normal");

              console.log("tagText", tagText);
              if (tagText == "Cor: Vermelho") {
                pdf.setTextColor("#FF0000");
                pdf.text(tagText + " (Falha grave)", 10, yPosition + 7);
              }
              if (tagText == "Cor: Laranja") {
                pdf.setTextColor("#FF7514");
                pdf.text(tagText + " (Alerta - erro cometido as vezes)", 10, yPosition + 7);
              }
              if (tagText == "Cor: Amarelo") {
                pdf.setTextColor("#FFFF00");
                pdf.text(tagText + " (Atenção)", 10, yPosition + 7);
              }
              if (tagText == "Cor: Verde") {
                pdf.setTextColor("#008000");
                pdf.text(tagText + " (Dever cumprido)", 10, yPosition + 7);
              }
              if (tagText == "Cor: Azul") {
                pdf.setTextColor("#0000FF");
                pdf.text(tagText + " (Acima da média)", 10, yPosition + 7);
              }
              if (tagText == "Cor: Roxo") {
                pdf.setTextColor("#A020F0");
                pdf.text(tagText + " (Ótimo, Parabéns, Excelente)", 10, yPosition + 7);
              }
              if (tagText == "Cor: Cinza") {
                pdf.text(tagText + " (Atestado médico ou Férias)", 10, yPosition + 7);
              }
              if (tagText == "Cor: Preto") {
                pdf.text(tagText, 10, yPosition + 7);
              }

              pdf.setTextColor("#000000");
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
        },
      });
  }

  _generateEmojiBase64(emoji: string): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Definir tamanho do canvas
      canvas.width = 64;
      canvas.height = 64;

      if (context) {
        // Escolher fonte e renderizar o emoji
        context.font = "64px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(emoji, canvas.width / 2, canvas.height / 2);

        // Converter o canvas para Base64
        const base64 = canvas.toDataURL("image/png");
        resolve(base64);
      }
    });
  }

  _openNoContentModal(): void {
    const modalElement = document.getElementById("noContentModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  _openSuccessModal(): void {
    const modalElement = document.getElementById("successModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element: any) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: element.message,
        });
        this.toast.error(element.message);
      });
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ex.error.message,
    });
  }
}
