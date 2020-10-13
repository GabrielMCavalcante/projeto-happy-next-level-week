import { Response } from 'express'

function requiredFieldNullOrEmpty(res: Response, invalidFields: string[]) {
    return res.status(400).json({
        status: 400,
        type: "Required field empty or null",
        message: "The following fields are required: "
        + invalidFields.join(", ")
    })
}

export { 
    requiredFieldNullOrEmpty 
}