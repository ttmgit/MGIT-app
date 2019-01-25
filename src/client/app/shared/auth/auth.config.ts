import { AuthService } from './auth.service';
import { Config } from '../index';
import { HTTP_CODES } from '../http.constants';


const AUTHORIZATION_HEADER = 'Authorization';
const BEARER_KEYWORD = 'Bearer ';

/**
 * @description Configuration for main Restangular service
 * @param {any} RestangularProvider - Provider injected by Restangular
 * @param {AuthService}authService - Our Authentication service
 */
export function RestangularConfigFactory(RestangularProvider: any, authService: AuthService) {
  RestangularProvider.setBaseUrl(Config.API);
  // Function to refresh token
  let refreshAccesstoken = () => {
    return authService.refreshToken();
  };
  // Function in case we can't refresh the token
  let couldNotRefreshTokenError = (error: any) => {
    authService.logout(true);
  };
  // In case of auth failure try to refresh token. If it cannot be done, then logout
  RestangularProvider.addErrorInterceptor((response: any, subject: any, responseHandler: any) => {
    if (response.status === HTTP_CODES.UNAUTHORIZED || response.status === HTTP_CODES.SERVICE_UNAVAILABLE) {

      refreshAccesstoken()
        .switchMap(refreshAccesstokenResponse => {
          // We update the Authorization header
          response.request.headers.set(AUTHORIZATION_HEADER, BEARER_KEYWORD + authService.getToken());
          return response.repeatRequest(response.request);
        })
        .subscribe(
          res => responseHandler(res),
          err => couldNotRefreshTokenError(err)
        );
      // False if error could be handled
      return false;
    }
    // True if error was not handled
    return true;
  });

  RestangularProvider.addFullRequestInterceptor((element: any,
                                                 operation: any,
                                                 path: any,
                                                 url: any,
                                                 headers: any,
                                                 params: any) => {
    let token = authService.getToken();
    if (token === null) {
      delete headers[AUTHORIZATION_HEADER];
      return {
        params: params,
        headers: Object.assign({}, headers),
        element: element
      };
    } else {
      return {
        params: params,
        headers: Object.assign({}, headers, {
          Authorization: BEARER_KEYWORD + token
        }),
        element: element
      };
    }

  });

}
