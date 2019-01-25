import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  API: 'http://127.0.0.1:3000/api',
  TOKEN_LOCATION: 'id_token',
  REFRESH_TOKEN_LOCATION: 'refresh_token',
  CLIENT_ID: 'pRKj87ZJd9AIupNbEdk3ZoEhcALnnTUgUPqhHngu',
  CLIENT_SECRET: 'Uxr21MHccXLfT7G9UiyT3TEJoeukG9axtQhL4RMw'
};

export = DevConfig;
