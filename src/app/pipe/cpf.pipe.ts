import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpf',
})
export class CpfPipe implements PipeTransform {
  transform(cpf: string): string {
    if (cpf) {
      const value = cpf.toString().replace(/\D/g, '');
      let formattedCpf = '';

      if (value.length == 11) {
        formattedCpf = value.replace(
          /(\d{3})?(\d{3})?(\d{3})?(\d{2})/,
          '$1.$2.$3-$4'
        );
      }

      return formattedCpf;
    }

    return null;
  }
}
