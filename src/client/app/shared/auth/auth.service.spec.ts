import { async, inject, TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Restangular, RestangularHttp, RestangularModule } from 'ngx-restangular';
import {
  Http, Headers, RequestOptions, URLSearchParams, Request, RequestMethod, HttpModule,
  BaseRequestOptions, ResponseOptions, Response
} from '@angular/http';

import { BrowserModule } from '@angular/platform-browser';
import { MockBackend, MockConnection } from '@angular/http/testing';

export function main() {
  describe('AuthService Test', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpModule,
          RestangularModule.forRoot((RestangularProvider: any) => {
            let headers = {'Authorization': 'Bearer ' + localStorage.getItem('id_token')};
            RestangularProvider.setBaseUrl('api');
            // Todo: Replace this with enviornment constant
            RestangularProvider.setDefaultHeaders(headers);
          }),
          BrowserModule
        ],
        providers: [
          AuthService,
          BaseRequestOptions,
          MockBackend,
          {
            provide: RestangularHttp,
            useFactory: (http: Http) => {
              return new RestangularHttp(http);
            },
            deps: [Http]
          },
          {
            provide: Http,
            useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backendInstance, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
          },
        ],
      });


    });


    it('Authservice should be Defined', async(inject([AuthService], (authService: AuthService) => {
      expect(authService).toBeDefined();
    })));

    it('Should save the token when it is  40 characters long', async(inject([AuthService], (authService: AuthService) => {
      let token = '8ed65429d29164b71261c44d9b968a49e7da31c3';
      authService.setToken(token);
      expect(localStorage.getItem('id_token')).toBe(token);
    })));

    it('Should save blank when the token is different from 40 chars', async(inject([AuthService], (authService: AuthService) => {
      let token = 'fake_token';
      authService.setToken(token);
      expect(localStorage.getItem('id_token')).toBe('');
    })));

    it('Should return the token when it is 40 characters long', async(inject([AuthService], (authService: AuthService) => {
      let token = '8ed65429d29164b71261c44d9b968a49e7da31c3';
      localStorage.setItem('id_token', token);
      let storedToken = authService.getToken();
      expect(storedToken).toBe(token);
    })));

    it('Should return null when the token is not 40 characters long', async(inject([AuthService], (authService: AuthService) => {
      let token = 'fake_token';
      localStorage.setItem('id_token', token);
      let storedToken = authService.getToken();
      expect(storedToken).toBeNull();
    })));

    it('Should save and return the response token when the request is correct', async(inject([AuthService, MockBackend],
      (authService: AuthService, backend: MockBackend) => {
        let headers = {'content-type': 'application/x-www-form-urlencoded'};
        let options = new RequestOptions({
          url: 'http://127.0.0.1:3033/oauth/token',
          headers: new Headers(headers),
          body: {},
          search: new URLSearchParams()
        });
        let request = new Request(options);

        let mockBody = {
          'access_token': 'bcf346835ce5631610316078c2e7d8577caa106f',
          'token_type': 'Bearer',
          'expires_in': 2339,
          'refresh_token': '9a0df822156662a8f1389256fcc0990d0c2509a3'
        };
        let resOptions = new ResponseOptions({
          body: JSON.stringify(mockBody),
          status: 200
        });
        let response = new Response(resOptions);
        let testUser = 'testuser';
        let testPassword = 'testPassword';
        backend.connections.subscribe((connection: MockConnection) => {
          debugger;
          expect(connection.request.url).toBe(request.url);
          connection.mockRespond(response);
          authService.login(testUser, testPassword).subscribe((response: any) => {
            debugger;
            expect(response.access_token).toBe(mockBody.access_token);
            expect(response.refresh_token).toBe(mockBody.refresh_token);
            expect(response.status).toBe(resOptions.status);
            expect(localStorage.getItem('id_token')).toBe(response.access_token);
            expect(localStorage.getItem('refresh_token')).toBe(response.refresh_token);
          });
        });
      })));

    it('Should go to the error handler when backend responds 401', async(inject([AuthService, MockBackend],
      (authService: AuthService, backend: MockBackend) => {
        let headers = {'content-type': 'application/x-www-form-urlencoded'};
        let options = new RequestOptions({
          url: 'api/oauth/token',
          headers: new Headers(headers),
          body: {},
          search: new URLSearchParams()
        });
        let request = new Request(options);
        let body = {
          'error': 'server_error',
          'error_description': 'INCORRECT_PASSWORD'
        };
        let resOptions = new ResponseOptions({
          body: body,
          status: 503
        });
        let response = new Response(resOptions);
        let testUser = 'wronguser';
        let testPassword = 'wrongpassword';

        expect(backend).toBeDefined();
        console.log(backend);

        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toBe(request.url);
          connection.mockRespond(response);
          authService.login(testUser, testPassword).subscribe((response: any) => {
            expect(response).toBeUndefined();
            expect('not').toBe('here');

            throw new Error('Generic Error');
          },(error: any) => {
            expect(error).toBeDefined();
            expect(error.error).toBe('server_error');
            expect(error.description).toBe('INCORRECT_PASSWORD');
            expect(error.status).toBe(503);
            expect('not').toBe('here');
          });
        }, (error: any) => {
          expect('Error').toBe('null');
          console.log(error);
        });
      })));
  });
}
