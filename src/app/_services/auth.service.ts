import { inject, Injectable } from '@angular/core';
import {ApiClient, AuthData, Models, UsersApi} from 'purecloud-platform-client-v2';
import { AppRoles, CLIENT_ID_KEY, ENV_KEY, GROUPS_DT_ID, INTERACTIONS_DT_ID, LANG_KEY } from '../_models';
import {Params} from '@angular/router';
import {BehaviorSubject, from, mergeMap, Observable, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import { ArchitectApiService } from './architect-api.service';
import { DirectoriesService } from './directories.service';
import { InteractionsService } from './interactions.service';

interface State {
  path?: string;
  params?: Params;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  isAuthorized = new BehaviorSubject<boolean>(false);
  userMe = new BehaviorSubject<Models.UserMe | null>(null);

  private readonly client = ApiClient.instance;
  private readonly usersApi = new UsersApi();
  // Authorization values
  private language: string = 'en-us';
  private environment: string = 'mypurecloud.de';
  private clientId: string = '';
  private authData?: AuthData;
  // State params (QueryParams)
  private path?: string;
  private qParams?: Params;
  private readonly directoriesSvc = inject(DirectoriesService);
  private readonly interactionsSvc = inject(InteractionsService);

  login(path?: string, qParams?: Params) {

    this.initializeParams(qParams);

    this.client.setPersistSettings(true, 'mini-qm-demo');
    this.client.setEnvironment(this.environment);

    const obj: State = {path: window.location.pathname, params: qParams};
    const state = btoa(JSON.stringify(obj));

    return this.loginImplicitGrant(state).pipe(
      tap(data => {
        this.authData = data;
        this.isAuthorized.next(true);
        if (data.state) {
          const actualState: State = JSON.parse(atob(data.state));
          this.path = actualState.path;
          this.qParams = actualState.params;
          this.initializeParams(this.qParams);
          if (this.qParams) {
            this.directoriesSvc.initialize('163ceb04-0fb8-4754-9bb5-19462d45de94');
            this.interactionsSvc.initialize('9db2a0b0-2360-4e20-b26c-07ea3ab1b8c1');
          }
        }
      }),
      mergeMap(() => this.getUserMe()),
      tap<Models.UserMe>(data => this.userMe.next(data)),
      map<Models.UserMe, boolean>(() => true));
  }

  isTokenValid(): boolean {
    if (!this.authData) return false;
    return Date.now() < this.authData?.tokenExpiryTime;
  }

  getToken(): string | undefined {
    return this.authData?.accessToken
  }

  getParams() {
    return this.qParams;
  }

  private getUserMe(): Observable<Models.UserMe> {
    return from(this.usersApi.getUsersMe({
      expand: ['authorization'],
    }));
  }

  private loginImplicitGrant(state: string): Observable<AuthData> {
    return from(this.client.loginImplicitGrant(
      this.clientId,
      window.location.origin + window.location.pathname,
      {state: state}));
  }

  private initializeParams(qParams?: Params) {
    if (!qParams) qParams = {};

    if (qParams[CLIENT_ID_KEY]) this.clientId = qParams[CLIENT_ID_KEY];
    if (qParams[LANG_KEY]) this.language = qParams[LANG_KEY];
    if (qParams[ENV_KEY]) this.environment = qParams[ENV_KEY];
  }

  private getPermissions(): Array<string> {
    const permissions = this.userMe.value?.authorization?.permissions;
    return permissions ? permissions : [];
  }
}
