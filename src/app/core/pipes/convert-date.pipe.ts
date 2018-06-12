import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDate'
})
export class ConvertDatePipe implements PipeTransform {

  transform(value: string, args?: any): Date {
    return !!value ? new Date(value * 1000) : null;
  }

}
