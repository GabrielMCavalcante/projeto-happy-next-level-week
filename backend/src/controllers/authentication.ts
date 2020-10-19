import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getRepository } from "typeorm"
import User from "../models/User"

export default class AuthenticationController {

  private tokenTimer: NodeJS.Timeout

  private generateToken(id: string, expires: boolean, expiresIn: number = 86400) {
    if (expires) {
      return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET!, { expiresIn })
    } else return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET!)
  }

  static async signup(req: Request, res: Response) {
    
  }

  static async signin() {

  }
}