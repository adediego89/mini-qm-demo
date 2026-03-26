import { Component, computed, inject, Signal } from '@angular/core';
import { Button } from 'primeng/button';
import { HeaderComponent } from '../header/header.component';
import { Tooltip } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Card } from 'primeng/card';
import { AccordionModule  } from 'primeng/accordion';
import { CustomInteraction } from '../../_models';
import { AuthService, DirectoriesService, InteractionsService } from '../../_services';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { DurationFormatPipe } from '../../_pipes/duration-format.pipe';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { Panel } from 'primeng/panel';
import { OverlayBadge } from 'primeng/overlaybadge';

@Component({
  selector: 'app-interaction-details',
  templateUrl: './interaction-details.component.html',
  imports: [
    Button,
    HeaderComponent,
    Tooltip,
    Card,
    AccordionModule,
    DatePipe,
    TitleCasePipe,
    DurationFormatPipe,
    Select,
    FormsModule,
    Tag,
    Dialog,
    Textarea,
    Panel,
    OverlayBadge
  ],
  styleUrl: './interaction-details.component.scss'
})
export class InteractionDetailsComponent {

  directoryId: Signal<string | undefined>;
  interactionId: Signal<string | undefined>;
  interactions: Signal<CustomInteraction[]>;
  interaction = computed(() => this.interactions().find(e => e.key === this.interactionId()));
  modelInteraction = computed(() => this.interaction()?.clone())
  statusOpts = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Review', value: 'review' },
    { label: 'Failed', value: 'failed' },
  ];
  noteDialogVisible = false;
  noteText?: string;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly interactionsService = inject(InteractionsService);
  private readonly directoriesService = inject(DirectoriesService);
  private readonly authService = inject(AuthService);

  constructor() {
    this.directoryId = toSignal(this.route.params.pipe(map((p) => p['id'])));
    this.interactionId = toSignal(this.route.params.pipe(map((p) => p['interactionId'])));
    this.interactions = toSignal(this.interactionsService.getInteractionsByDirectory(this.directoryId()), { initialValue: [] });
    if (this.directoriesService.directories.getValue().length === 0) {
      this.directoriesService.getAll().subscribe();
    }
    if (this.interactionsService.interactions.getValue().length === 0) {
      this.interactionsService.getAll().subscribe();
    }
  }

  back() {
    this.router.navigate(['directories', `${this.directoryId()}`]);
  }

  openInGenesysCloud() {
    const interaction = this.interaction();
    if (!interaction) return;
    window.open(`https://apps.mypurecloud.de/directory/#/analytics/interactions/${interaction.key}/admin`, '_blank');
  }

  saveChanges() {
    const model = this.modelInteraction();
    if (!model) return;
    this.interactionsService.update(model).subscribe(data => {

    })
  }

  getSeverity(status: string) {
    switch (status) {
      case 'pending': return 'secondary';
      case 'completed': return 'success';
      case 'review': return 'info';
      case 'failed': return 'danger';
      default: return 'info';
    }
  }

  openNewNote() {
    this.noteText = undefined;
    this.noteDialogVisible = true;
  }

  addNote() {
    if (!this.noteText) return;
    this.modelInteraction()?.notes.push({
      text: this.noteText,
      date: new Date().toUTCString(),
      user: this.authService.userMe.getValue()?.name ?? ''
    });
    this.noteDialogVisible = false;
  }

  pendingChanges(): number {
    let changes = 0;
    if (this.modelInteraction()?.status !== this.interaction()?.status) changes += 1;
    if (this.modelInteraction()?.notes.length !== this.interaction()?.notes.length) changes += 1;
    return changes;
  }

}
