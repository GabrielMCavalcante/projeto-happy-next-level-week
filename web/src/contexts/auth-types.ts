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

export type Token = string | null

export interface AuthContextValues {
  signedIn: boolean,
  token: Token,
  signin(userAccount: UserAccount): Promise<any>,
  signup(userData: UserData): Promise<any>,
  signout(): void,
  requestPasswordResetToken(accountEmail: string): Promise<any>,
  resetPassword(resetData: PasswordResetData): Promise<any>
  loading: boolean
}

interface SigninSuccessData {
  status: 200,
  token: string
}

interface SigninFailureData {
  status: 500,
  message: string
}

export type SigninResponseData = SigninSuccessData | SigninFailureData

interface SignupSuccessData {
  status: 201
}

interface SignupFailureData {
  status: 409 | 500,
  message: string
}

export type SignupResponseData = SignupSuccessData | SignupFailureData

interface RequestPasswordRecoveryTokenSuccessData {
  status: 200
}

interface RequestPasswordRecoveryTokenFailureData {
  status: 404 | 500,
  message: string
}

export type RequestPasswordRecoveryTokenData =
  RequestPasswordRecoveryTokenSuccessData | RequestPasswordRecoveryTokenFailureData


interface ResetPasswordSuccessData {
  status: 200
}

interface ResetPasswordFailureData {
  status: 401 | 404 | 500,
  message: string
}

export type ResetPasswordData = ResetPasswordSuccessData | ResetPasswordFailureData