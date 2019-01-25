import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: 'http://40.124.13.17:3000/api',
  TOKEN_LOCATION: 'id_token',
  REFRESH_TOKEN_LOCATION: 'refresh_token',
  CLIENT_ID: 'pRKj87ZJd9AIupNbEdk3ZoEhcALnnTUgUPqhHngu',
  CLIENT_SECRET: 'Uxr21MHccXLfT7G9UiyT3TEJoeukG9axtQhL4RMw'
};

export = ProdConfig;
