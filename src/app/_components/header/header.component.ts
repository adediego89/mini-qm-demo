import {booleanAttribute, Component, contentChild, input, TemplateRef} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    NgTemplateOutlet
  ],
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  title = input<string>();
  isHome = input(false, {transform: booleanAttribute});
  leftTemplate = contentChild<TemplateRef<unknown>>('left');
  rightTemplate = contentChild<TemplateRef<unknown>>('right');
}
