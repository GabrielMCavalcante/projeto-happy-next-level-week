import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getRepository } from "typeorm"
import User from "../models/User"
import sendMail from "../services/mail"
import serverErrors from "../errors/serverErrors"

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
            return serverErrors(err, res)
          }

          const newUser = new User()

          newUser.id = hashUserId
          newUser.email = email
          newUser.password = encryptedPassword

          try {
            await usersRepository.save(newUser)

            return res.status(201).json({
              status: 201,
              message: "User successfully created."
            })
          } catch (e) {
            return serverErrors(e, res)
          }
        })
      } catch (err) {
        return serverErrors(err, res)
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
        return serverErrors(err, res)
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

    user.password_recovery_token = recoveryToken

    try {
      await sendMail(email, recoveryToken)

      await usersRepository.save(user)

      return res.status(200).json({
        status: 200,
        message: "Password recovery token sent to email successfully."
      })
    } catch (err) {
      return serverErrors(err, res, "Could not send recovery token to email due" +
      "to an unknown error. Please, try again later.")
    }

  }

  static async resetPassword(req: Request, res: Response) {
    const recoveryToken = req.headers.recovery_token as string
    const { password } = req.body
    const usersRepository = getRepository(User)

    // Verifying if recovery token is still valid
    const users = await usersRepository.find({
      where: {
        password_recovery_token: recoveryToken
      }
    })

    const user = users[0]

    if (
      users.length === 0 ||
      !user.password_recovery_token
    ) {
      return res.status(404).json({
        status: 404,
        message: "No password recovery token found for this user."
      })
    }

    const decodedToken: any = jwt.verify(user.password_recovery_token, process.env.JWT_TOKEN_SECRET!)

    if (Date.now() / 1000 >= Number(decodedToken.exp)) {
      return res.status(401).json({
        status: 401,
        message: "The password recovery token expired. Request another one and try again."
      })
    }

    await bcrypt.genSalt(10, async (_, salt) => {
      await bcrypt.hash(password, salt, async (err, encryptedPassword) => {
        if (err) {
          return serverErrors(err, res)
        }

        user.password = encryptedPassword
        user.password_recovery_token = ""

        await usersRepository.save(user)

        return res.status(200).json({
          status: 200,
          message: "Password changed successfully."
        })
      })
    })
  }
}