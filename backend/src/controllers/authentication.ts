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
    const { email, password } = req.body
    const usersRepository = getRepository(User)

    // Verifying if email already exists in database
    const emailExists = await usersRepository.find({
      where: {
        email
      }
    })

    if (emailExists.length !== 0) {
      // Email already exists
      return res.status(409).json({
        status: 409,
        message: "This email address is already in use."
      })
    }

    await bcrypt.genSalt(10, async (_, salt) => {
      try {
        const encryptedPassword = await bcrypt.hash(password, salt)

        // Generating user id
        const limit = String(email).length > String(password).length
          ? String(email).length
          : String(password).length

        let userId = ""

        for (let i = 0; i < limit; i++) {
          if (email.charAt(i)) {
            userId += email.charAt(i)

            if (password.charAt(i)) {
              userId += password.charAt(i)
            }
          } else {
            userId += password.charAt(i)
          }
        }

        await bcrypt.hash(userId, 5, async (err, hashUserId) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              message: "Internal server error. Please, try again later.",
              TAG: "ENCRYPT_USERID_ON_SIGNUP"
            })
          }

          const newUser = new User()

          newUser.id = hashUserId
          newUser.email = email
          newUser.password = encryptedPassword

          try {
            await usersRepository.save(newUser)

            return res.status(200).json({
              status: 200,
              message: "User successfully created."
            })
          } catch (e) {
            return res.status(500).json({
              status: 500,
              message: "Internal server error. Please, try again later.",
              TAG: "SAVE_USER_ON_SIGNUP: " + e.message,
            })
          }
        })
      } catch (err) {
        return res.status(500).json({
          status: 500,
          message: "Internal server error. Please, try again later.",
          TAG: "ENCRYPT_PASSWORD_ON_SIGNUP"
        })
      } // TODO: REMOVE "TAG" ON RESPONSE ERROR MESSAGES
    })
  }

  static async signin() {

  }
}