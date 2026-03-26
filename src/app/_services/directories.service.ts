import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { ArchitectApiService } from './architect-api.service';
import { CustomDirectory } from '../_models';
import { map } from 'rxjs/operators';
import { PostCustomDirectoryDto } from '../_dtos';

@Injectable({providedIn: 'root'})
export class DirectoriesService {

  directories = new BehaviorSubject<CustomDirectory[]>([]);
  loading = false;
  private groupsTableId?: string;
  private readonly apiService = inject(ArchitectApiService);

  initialize(groupsTableId: string) {
    this.groupsTableId = groupsTableId;
  }


  getAll() {
    if (!this.groupsTableId) throw new Error('Datatable id has not been yet initialized');
    this.loading = true;
    return this.apiService.getDatatableRecords(this.groupsTableId).pipe(
      map(records => records?.filter(e => e !== undefined).map(e => new CustomDirectory(e))),
      tap(directories => {
        this.directories.next(directories);
        this.loading = false;
      }));
  }

  create(dto: PostCustomDirectoryDto) {
    if (!this.groupsTableId) throw new Error('Datatable id has not been yet initialized');
    return this.apiService.addRecordToDatatable(this.groupsTableId, dto).pipe(map(res => new CustomDirectory(res)),tap(res => {
      this.directories.next([...this.directories.getValue(), res]);
    }));
  }

  update() {
    if (!this.groupsTableId) throw new Error('Datatable id has not been yet initialized');
  }

  delete() {
    if (!this.groupsTableId) throw new Error('Datatable id has not been yet initialized');
  }


}
