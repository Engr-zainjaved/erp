import Callbacks from "./callbacks-type";

interface AuthOptions {
  providers: {
    id: string;
    name: string;
    type: any;
    clientId: string;
    clientSecret: string;
    authorization?: {
      params: {
        scope: string;
      };
    };
  }[];
  secret: string;
  callbacks: Callbacks;
}

export default AuthOptions;
