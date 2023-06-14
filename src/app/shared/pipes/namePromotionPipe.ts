import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'namePromotionPipe'})
export class NamePromotionPipe implements PipeTransform {
    transform(text: string): string {
        let sp = text.split('#');
        text = sp[0].concat('.').concat(sp[1]);
        return text.substring(0, 16);
    }
}