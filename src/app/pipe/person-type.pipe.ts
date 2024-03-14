import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'personType',
})
export class PersonTypePipe implements PipeTransform {
  transform(cpfOrCnpj: string): string {
    if (cpfOrCnpj) {
      const value = cpfOrCnpj.toString().replace(/\D/g, '');
      let formattedCpfOrCnpj = '';

      if (value.length == 11) {
        formattedCpfOrCnpj = value.replace(
          /(\d{3})?(\d{3})?(\d{3})?(\d{2})/,
          '$1.$2.$3-$4'
        );
      } else if (value.length == 14) {
        formattedCpfOrCnpj = value.replace(
          /(\d{2})?(\d{3})?(\d{3})?(\d{4})?(\d{2})/,
          '$1.$2.$3/$4-$5'
        );
      }

      return formattedCpfOrCnpj;
    }

    return null;
  }
}
