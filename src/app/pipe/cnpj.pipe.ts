import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnpj',
})
export class CnpjPipe implements PipeTransform {
  transform(cnpj: string): string {
    if (cnpj) {
      const value = cnpj.toString().replace(/\D/g, '');
      let formattedCnpj = '';

      if (value.length == 14) {
        formattedCnpj = value.replace(
          /(\d{2})?(\d{3})?(\d{3})?(\d{4})?(\d{2})/,
          '$1.$2.$3/$4-$5'
        );
      }

      return formattedCnpj;
    }

    return null;
  }
}
