import { Injectable } from '@angular/core';
import { ConversationsApi } from 'purecloud-platform-client-v2';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ConversationsApiService {

  private readonly api = new ConversationsApi();

  getConversationById(conversationId: string) {
    return from(this.api.getAnalyticsConversationDetails(conversationId));
  }

  getConversationsByIds(conversationIds: string[]) {
    return from(this.api.getAnalyticsConversationsDetails({ id: conversationIds })).pipe(map(e => e.conversations));
  }

}
