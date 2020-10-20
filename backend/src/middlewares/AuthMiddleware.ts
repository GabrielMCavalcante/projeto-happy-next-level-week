import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  // Verifying if authorization header doesn´t exist
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided." })
  }

  const splittedHeader = authHeader.split(" ")

  // Verifying if header doesn´t have two parts
  if (splittedHeader.length !== 2) {
    return res.status(401).json({ error: "Token badly formatted." })
  }

  const [scheme, token] = splittedHeader

  // Verifying if scheme doesn´t exist or if it´s different from "Bearer"
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token badly formatted." })
  }

  // Verifying if the token wasn´t given
  if (!token) {
    return res.status(401).json({ error: "No token provided." })
  }

  // Verifying if the given token is valid
  jwt.verify(token, process.env.JWT_TOKEN_SECRET!, err => {
    if (err) {
      return res.status(401).json({ error: "Invalid token: " + err })
    }

    return next()
  })
}