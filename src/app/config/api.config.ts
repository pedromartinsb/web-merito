// export const API_CONFIG = {
//   baseUrl : 'http://localhost:8080'
// }

import { environment } from "src/environments/environment";


export class Config {
  public static get webApiUrl() {
    if (environment.production) {
      return 'http://177.136.202.95:8082/api';
      // return 'https://api.sistemamerito.com.br/api';
    }
    if (environment.staging) {
      return 'https://api-merito-66f71383f3bc.herokuapp.com/api';
    }
    return 'http://localhost:8080/api'
  }
}
