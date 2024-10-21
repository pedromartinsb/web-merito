import { Component, Input, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-reusable-form',
  templateUrl: './reusable-form.component.html',
  styleUrls: ['./reusable-form.component.scss']
})
export class ReusableFormComponent implements OnInit {
  @Input() fieldsConfig: any[] = []; // Configuração dos campos do formulário
  @Input() initialData: any = {};

  employee!: any;// Valores iniciais para os campos do formulário

  formGroup: FormGroup;
  employeeForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      preferences: [[]],
      notifications: [false],
      phones: this.fb.array([this.fb.control('')])
    });
  }

  ngOnInit(): void {
    this.buildForm();

    // Recebe o ID do usuário da rota
    this.route.params.subscribe(params => {
      const userId = params['id'];
      console.log(userId)
      // this.loadUser(userId); // Carrega o usuário
    });
  }

  // Getter para o array de telefones
  get phones() {
    return this.formGroup.get('phones') as FormArray;
  }

  // Método para adicionar telefone
  addPhone() {
    this.phones.push(this.fb.control(''));
  }

  // Método para remover telefone
  removePhone(index: number) {
    this.phones.removeAt(index);
  }

  populateForm(employee: any): void {
    this.employeeForm.patchValue({
      id: employee.id,
      name: employee.name,
    });
  }

  // Método para construir o formulário dinamicamente
  buildForm() {
    const group: any = {};

    this.fieldsConfig.forEach(field => {
      group[field.name] = [
        this.initialData[field.name] || '', // Valor inicial
        field.required ? Validators.required : null // Validação condicional
      ];
    });

    this.formGroup = this.fb.group(group);
  }

  // Método para submeter o formulário
  onSubmit() {
    if (this.formGroup.valid) {
      console.log('Formulário enviado', this.formGroup.value);
    } else {
      console.log('Formulário inválido');
    }
  }

  // Função para voltar à página anterior
  goBack() {
    this.router.navigate(['..']); // Navega para a rota anterior
  }
}
