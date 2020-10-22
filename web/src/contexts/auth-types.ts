export interface AuthContextValues {
  signedIn: boolean,
  token: Token,
  setContextToken: (token: Token) => void,
  signin(userAccount: UserAccount): Promise<any>,
  signup(userData: UserData): Promise<any>,
  signout(): void,
  requestPasswordResetToken(accountEmail: string): Promise<any>,
  resetPassword(resetData: PasswordResetData): Promise<any>
  loading: boolean
}

export type Token = string | null
export type SigninResponseData = SigninSuccessData | SigninFailureData
export type ResetPasswordData = ResetPasswordSuccessData | ResetPasswordFailureData
export type SignupResponseData = SignupSuccessData | SignupFailureData
export type RequestPasswordRecoveryTokenData =
  RequestPasswordRecoveryTokenSuccessData | RequestPasswordRecoveryTokenFailureData

export interface UserData {
  email: string,
  password: string
}

export interface UserAccount extends UserData {
  remember_user: boolean
}

export interface PasswordResetData {
  password: string,
  token: string
}

interface SigninSuccessData {
  status: 200,
  token: string
}

interface SigninFailureData {
  status: 500,
  message: string
}

interface SignupSuccessData {
  status: 201
}

interface SignupFailureData {
  status: 409 | 500,
  message: string
}

interface RequestPasswordRecoveryTokenSuccessData {
  status: 200
}

interface RequestPasswordRecoveryTokenFailureData {
  status: 404 | 500,
  message: string
}

interface ResetPasswordSuccessData {
  status: 200
}

interface ResetPasswordFailureData {
  status: 401 | 404 | 500,
  message: string
}