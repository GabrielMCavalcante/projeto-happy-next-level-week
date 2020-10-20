import { Response } from 'express'
import { ValidationError } from 'yup'

interface ValidationErrors {
    [key: string]: string[]
}

const serverErrors = (error: any, res: Response, message?: string) => {
    if (error instanceof ValidationError) {
        let errors: ValidationErrors = {}

        error.inner.forEach(err => {
            errors[err.path] = err.errors
        })

        return res.status(400).json({
            status: 400,
            errors
        })
    }

    const defaultMessage = "Internal server error. Please, try again later."

    return res.status(500).json({
        status: 500,
        message: message || defaultMessage
    })
}

export default serverErrors