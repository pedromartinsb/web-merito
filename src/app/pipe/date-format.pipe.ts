import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);

    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Os meses começam em 0
    const year = date.getUTCFullYear();

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    // Retorna a data no formato dd/MM/yyyy HH:mm
    // return `${day}/${month}/${year} ${hours}:${minutes}`;

    // Retorna a data no formato dd/MM/yyyy
    return `${day}/${month}/${year}`;
  }

}
