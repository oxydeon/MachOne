import { Pipe, PipeTransform } from '@angular/core';
import { isNullish } from '../utils/validation';

@Pipe({
  name: 'isNotNullish',
  pure: true,
  standalone: true,
})
export class IsNotNullishPipe implements PipeTransform {

  transform<T>(val: T): val is T {
    return !isNullish(val);
  }
}
