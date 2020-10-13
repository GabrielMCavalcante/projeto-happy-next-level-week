import { Request, Response, NextFunction } from 'express'
import { requiredFieldNullOrEmpty } from '../requestErrors'

export default function(req: Request, res: Response, next: NextFunction) {
    const invalidFields = []
    for (const attr in req.body) {
        if (req.body[attr] === null || req.body[attr] === "") {
            invalidFields.push(attr)
        }
    }

    if (invalidFields.length > 0) {
        return requiredFieldNullOrEmpty(res, invalidFields)
    }

    return next()
}