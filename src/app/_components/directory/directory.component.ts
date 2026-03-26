import { Component, computed, inject, Signal } from '@angular/core';
import { Button } from 'primeng/button';
import { HeaderComponent } from '../header/header.component';
import { Tooltip } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomDirectory, CustomInteraction } from '../../_models';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DirectoriesService, InteractionsService } from '../../_services';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { InteractionNewComponent } from '../interaction-new/interaction-new.component';
import { DurationFormatPipe } from '../../_pipes/duration-format.pipe';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-directory',
  imports: [
    Button,
    HeaderComponent,
    Tooltip,
    TableModule,
    DurationFormatPipe,
    DatePipe,
    Tag,
    TitleCasePipe
  ],
  templateUrl: './directory.component.html',
  styleUrl: './directory.component.scss',
  providers: [DialogService]
})
export class DirectoryComponent {

  directoryId: Signal<string | undefined>;
  directories: Signal<CustomDirectory[]>;
  directory = computed(() => this.directories().find(e => e.id === this.directoryId()));
  interactions: Signal<CustomInteraction[] | undefined>;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly directoriesService = inject(DirectoriesService);
  protected readonly interactionsService = inject(InteractionsService);
  private readonly dialogService = inject(DialogService);

  constructor() {
    this.directoryId = toSignal(this.route.params.pipe(map((p) => p['id'])));
    this.directories = toSignal(this.directoriesService.directories, { initialValue: []});
    this.interactions = toSignal(this.interactionsService.interactions.pipe(
      map(interactions => interactions.filter(e => e.groupId === this.directoryId())),
    ));
    if (this.directoriesService.directories.getValue().length === 0) {
      this.directoriesService.getAll().subscribe();
    }
    if (this.interactionsService.interactions.getValue().length === 0) {
      this.interactionsService.getAll().subscribe();
    }
  }

  back() {
    this.router.navigate(['directories']);
  }

  refresh() {

  }

  editDirectory() {}

  openInteractionDetails(interaction: any) {
    window.open(`https://apps.mypurecloud.de/directory/#/analytics/interactions/${interaction.key}/admin`, '_blank');
  }

  addInteraction() {
    this.dialogService.open(InteractionNewComponent, {
      header: 'New interaction',
      width: '90vw',
      data: {
        directoryId: this.directoryId()
      }
    });
  }

  openDetails(interaction: CustomInteraction) {
    this.router.navigate(['directories', `${this.directoryId()}`, `${interaction.key}`]);
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

}
