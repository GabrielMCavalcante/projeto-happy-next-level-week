import { ErrorRequestHandler } from 'express'

const serverErrors: ErrorRequestHandler = (error, req, res, next) => {
    console.log(error)

    return res.status(500).json({
        status: 500,
        type: "Internal server error",
        message: "An error occurred whilst processing the request. Try again later."
    })
}

export default serverErrors