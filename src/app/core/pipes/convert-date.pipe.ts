import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDate'
})
export class ConvertDatePipe implements PipeTransform {

  transform(value: string, args?: any): number {
    return !!value ? Number(value) * 1000 : null;
  }

}
