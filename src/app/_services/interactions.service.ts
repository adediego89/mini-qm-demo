import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, switchMap, tap } from 'rxjs';
import { ArchitectApiService } from './architect-api.service';
import { map } from 'rxjs/operators';
import { ConversationsApiService } from './conversations-api.service';
import { CustomDirectory, CustomInteraction } from '../_models';

@Injectable({providedIn: 'root'})
export class InteractionsService {

  interactions = new BehaviorSubject<CustomInteraction[]>([]);
  loading = false;
  private datatableId?: string;
  private readonly architectApiService = inject(ArchitectApiService);
  private readonly conversationsApiService = inject(ConversationsApiService);

  initialize(datatableId: string) {
    this.datatableId = datatableId;
  }

  getInteractionsByDirectory(directoryId?: string) {
    return this.interactions.pipe(
      map(interactions => interactions.filter(e => e.groupId === directoryId)),
    )
  }

  getAll() {
    if (!this.datatableId) throw new Error('Datatable id has not been yet initialized');
    this.loading = true;
    return this.architectApiService.getDatatableRecords(this.datatableId).pipe(
      map(records => records?.filter(e => e !== undefined).map(e => new CustomInteraction(e))),
      tap(interactions => {
        this.interactions.next(interactions);
        this.loading = false;
      }));
  }

  create(model: CustomInteraction) {
    if (!this.datatableId) throw new Error('Datatable id has not been yet initialized');

    return this.conversationsApiService.getConversationById(model.key).pipe(
      map(details => {
        model.date = details.conversationStart!;
        model.direction = details.originatingDirection!;
        const customerPart = details.participants?.find(e => e.purpose === 'customer' || e.purpose === 'external');
        model.ani = customerPart?.sessions?.[0].ani?.slice(4);
        model.dnis = customerPart?.sessions?.[0].dnis?.slice(4);
        model.type = customerPart?.sessions?.[0].mediaType ?? 'voice';
        if (details.conversationEnd) {
          model.duration = Math.floor((new Date(details.conversationEnd).getTime() - new Date(details.conversationStart!).getTime())/1000);
        } else {
          model.duration = Math.floor((Date.now() - new Date(details.conversationStart!).getTime())/1000);
        }

        return model.toDto();
      }),
      switchMap(dto => this.architectApiService.addRecordToDatatable(this.datatableId!, dto)),
      map(res => new CustomInteraction(res)),
      tap(res => {
        console.log(res);
        this.interactions.next(this.interactions.getValue().concat(res));
      }),
      catchError(() => of(null)))

  }

  update(model: CustomInteraction) {
    if (!this.datatableId) throw new Error('Datatable id has not been yet initialized');
    return this.architectApiService.updateDatatableRecord(this.datatableId, model.toDto()).pipe(
      map(res => new CustomInteraction(res)),
      tap(interaction => {
        const interactions = this.interactions.getValue();
        const foundIndex = interactions.findIndex(e => e.key === interaction.key);
        if (foundIndex > -1) {
          interactions[foundIndex] = interaction;
          this.interactions.next([...interactions]);
        }
      })
    );
  }

  delete() {
    if (!this.datatableId) throw new Error('Datatable id has not been yet initialized');
  }


}
