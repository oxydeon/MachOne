import { Pipe, PipeTransform } from '@angular/core';
import { isNotNullish } from '../util/is-nullish';

@Pipe({
  name: 'isNotNullish',
  pure: true,
  standalone: true,
})
export class IsNotNullishPipe implements PipeTransform {

  transform<T>(val: T): val is T {
    return isNotNullish(val);
  }

}
