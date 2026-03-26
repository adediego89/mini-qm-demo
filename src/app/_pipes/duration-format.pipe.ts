import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormat',
  pure: true
})
export class DurationFormatPipe implements PipeTransform {
  transform(duration: number): string {
    if (duration === undefined) return '-';
    return this.processSeconds(duration);
  }

  private processSeconds(value: number): string {
    const days = Math.floor(value / 86400);
    const hours = Math.floor((value % 86400) / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');

    return days > 0
      ? `${days} days`
      : `${hh}:${mm}:${ss}`;
  }
}
