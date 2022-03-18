export interface AuthData {
  accessToken: string;
    id:number;
    username: string;
    email: string;
    roles:{
      id:string,
      roleName:string,
    }[]
}

export class User {
  constructor(
    public id:number,
    public username:string,
    public email: string,
    public roles:{
      id:string,
      roleName:string,
    }[],
    private _token: string,
    private _tokenEx: Date,
    public rolesStr:string|undefined=''
  ) {}

  get token() {
    if (!this._tokenEx || new Date() > this._tokenEx) {
      return null;
    }
    return this._token;
  }
}

export interface UserPackage{
  content:User[]
}
