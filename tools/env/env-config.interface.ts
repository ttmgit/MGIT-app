// Feel free to extend this interface
// depending on your app specific config.
export interface EnvConfig {
  API?: string;
  ENV?: string;
  MSGTIME?: string;
  DISPLAYTIME?: string;
  TOKEN_LOCATION?: string;
  REFRESH_TOKEN_LOCATION?: string;
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
}
