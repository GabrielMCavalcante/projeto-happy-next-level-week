import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getRepository } from "typeorm"
import User from "../models/User"
import PasswordRecoveryTokens from "../models/PasswordRecoveryTokens"
import sendMail from "../services/mail"

function generateToken(id: string, expires: boolean, expiresIn: number = 86400) {
  if (expires) {
    return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET!, { expiresIn })
  } else {
    return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET!)
  }
}

export default class AuthenticationController {
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
              message: "Internal server error. Please, try again later."
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
              message: "Internal server error. Please, try again later."
            })
          }
        })
      } catch (err) {
        return res.status(500).json({
          status: 500,
          message: "Internal server error. Please, try again later."
        })
      }
    })
  }

  static async signin(req: Request, res: Response) {
    const { email, password, remember_user } = req.body
    const usersRepository = getRepository(User)

    // Verifying if email exists
    const usersFound = await usersRepository.find({
      where: {
        email
      }
    })

    if (usersFound.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "There is no account associated with the specified email address."
      })
    }

    // Verifying password
    const user = usersFound[0]

    await bcrypt.compare(password, user.password, (err, same) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Internal server error. Please, try again later."
        })
      }

      if (!same) {
        return res.status(400).json({
          status: 400,
          message: "The password is incorrect."
        })
      }

      const token = generateToken(user.id, !remember_user)

      return res.status(200).json({
        status: 200,
        message: "Signin successfull.",
        user_id: user.id,
        token
      })
    })
  }

  static async requestRecoveryToken(req: Request, res: Response) {
    const { email } = req.body
    const usersRepository = getRepository(User)
    const tokenExpirationTimeInSeconds = 3600

    // Verifying if email exists
    const usersFound = await usersRepository.find({
      where: {
        email
      }
    })

    if (usersFound.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "There is no account associated with the specified email address."
      })
    }

    const user = usersFound[0]

    const recoveryToken = generateToken(user.id, true, tokenExpirationTimeInSeconds)

    const passwordRecoveryToken = new PasswordRecoveryTokens()
    
    passwordRecoveryToken.token = recoveryToken
    
    user.password_recovery_token = passwordRecoveryToken

    try {
      await sendMail(email, recoveryToken)

      return res.status(200).json({
        status: 200,
        message: "Password recovery token sent to email successfully."
      })
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Could not send recovery token to email due" + 
        "to an unknown error. Please, try again later."
      })
    }
    
  }

  static async resetPassword(req: Request, res: Response) {
    



  }
}