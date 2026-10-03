import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformText',
})
export class TransformTextPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, 'text/html');
    const firstH1 = doc.querySelector('h1');
    if (firstH1) firstH1.remove();
    const firstP = doc.querySelector('p');
    if (firstP) firstP.remove();
    return doc.body.innerHTML;
  }
}
