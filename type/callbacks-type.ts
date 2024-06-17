import Session from "./session-type";
import Token from "./token-type";

interface Callbacks {
  session: (props: {
    session: Session;
    token: Token;
    user: any;
  }) => Promise<any>;
  jwt: (props: {
    token: Token;
    user: any;
    account: { access_token: string };
    profile?: any;
    isNewUser?: boolean;
  }) => Promise<any>;
}

export default Callbacks;
