export interface UserData {
  email: string,
  password: string
}

export interface UserAccount extends UserData {  
  rememberUser: boolean 
}

export interface PasswordResetData { 
  password: string, 
  token: string 
}

export type Token = string | null

export interface AuthContextValues {
  signedIn: boolean,
  token: Token,
  signin(userAccount: UserAccount): Promise<any>,
  signup(userData: UserData): Promise<any>,
  signout(): void,
  requestPasswordResetToken(accountEmail: string): Promise<any>,
  updateUserPassword(resetData: PasswordResetData): Promise<any>
  loading: boolean
}