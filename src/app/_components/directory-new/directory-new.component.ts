import { Component, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { PostCustomDirectoryDto } from '../../_dtos';
import { DirectoriesService } from '../../_services';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-directory-new',
  imports: [
    Button,
    FormsModule,
    InputText,
    Textarea
  ],
  templateUrl: './directory-new.component.html',
  styleUrl: './directory-new.component.scss',
})
export class DirectoryNewComponent {

  model: PostCustomDirectoryDto = {
    key: uuidv4(),
    name: ''
  };
  loading= false;
  private readonly directoriesService = inject(DirectoriesService);

  constructor(private readonly ref: DynamicDialogRef) {}

  cancel() {
    this.ref.close();
  }

  addDirectory() {
    this.loading = true;
    this.directoriesService.create(this.model).subscribe(res => {
      this.loading = false;
      if (res) {
        this.ref.close();
      }
    });
  }

}
