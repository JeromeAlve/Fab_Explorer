import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDate'
})
export class ConvertDatePipe implements PipeTransform {

  transform(value: string, args?: any): number {
    if (isNaN(Number(value))) {
      return !!value ? Number(new Date(value)) : null;
    }
    return !!value ? Number(value) * 1000 : null;
  }

}
