import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'yup'

interface ValidationErrors {
    [key: string]: string[]
}

const serverErrors: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof ValidationError) {
        let errors: ValidationErrors = {}

        error.inner.forEach(err => {
            errors[err.path] = err.errors
        })

        return res.status(400).json(errors)
    }

    return res.status(500).json({
        status: 500,
        type: "Internal server error",
        message: "An error occurred whilst processing the request. Try again later."
    })
}

export default serverErrors