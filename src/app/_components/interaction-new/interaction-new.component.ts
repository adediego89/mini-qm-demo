import { Component, inject } from '@angular/core';
import { InteractionsService } from '../../_services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { CustomInteraction } from '../../_models';

@Component({
  selector: 'app-interaction-new',
  templateUrl: './interaction-new.component.html',
  imports: [
    Button,
    FormsModule,
    InputText,
  ],
  styleUrl: './interaction-new.component.scss'
})
export class InteractionNewComponent {

  model: CustomInteraction = new CustomInteraction({
    key: '',
    groupId: '',
    date: '',
    notes: '[]',
    direction: '',
    dnis: '',
    ani: '',
    duration: 0
  });
  loading= false;
  private readonly interactionsService = inject(InteractionsService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  constructor() {
    this.model.groupId = this.config.data['directoryId'];
  }

  cancel() {
    this.ref.close();
  }

  addInteraction() {
    this.loading = true;
    this.interactionsService.create(this.model).subscribe(res => {
      this.loading = false;
      if (res) {
        this.ref.close();
      }
    });
  }

}
