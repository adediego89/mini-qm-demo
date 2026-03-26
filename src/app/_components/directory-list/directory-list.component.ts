import { Component, computed, inject, Signal } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from '../header/header.component';
import {DataViewModule} from 'primeng/dataview';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {TableModule} from 'primeng/table';
import {CustomDirectory} from '../../_models';
import { AuthService, DirectoriesService } from '../../_services';
import {Tooltip} from 'primeng/tooltip';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DialogService } from 'primeng/dynamicdialog';
import { DirectoryNewComponent } from '../directory-new/directory-new.component';

@Component({
  selector: 'app-directory-list',
  templateUrl: './directory-list.component.html',
  imports: [
    CommonModule,
    HeaderComponent,
    DataViewModule,
    Button,
    FormsModule,
    InputText,
    IconField,
    InputIcon,
    TableModule,
    Tooltip,
  ],
  providers: [DialogService],
  styleUrl: './directory-list.component.scss'
})
export class DirectoryListComponent {

  directories: Signal<CustomDirectory[]>;
  filtered = computed(() => this.filterDirectories(this.directories()));
  filterString: string = '';

  protected readonly authService = inject(AuthService);
  protected readonly directoriesService = inject(DirectoriesService);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);

  constructor() {
    this.directories = toSignal(this.directoriesService.directories, { initialValue: [] });
    if (this.directoriesService.directories.getValue().length === 0) {
      this.refresh();
    }
  }

  refresh() {
    this.directoriesService.getAll().subscribe();
  }


  filterDirectories(directories: CustomDirectory[]) {
    return this.filterString.length > 0
      ? directories.filter(e => e.name?.toLowerCase().includes(this.filterString.toLowerCase()))
      : directories;
  }

  selectDirectory(directory: CustomDirectory) {
    this.router.navigate(['directories', directory.id]);
  }

  openConfig(){
    this.dialogService.open(DirectoryNewComponent, {
      header: 'New',
      width: '90vw'
    });
  }

}
