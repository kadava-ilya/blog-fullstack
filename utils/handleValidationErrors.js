import {validationResult} from "express-validator";

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return req
            .status(400)
            .json(errors.array())
    }

    next()
}

export default handleValidationErrors