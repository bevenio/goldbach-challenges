import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator'

const validateRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  res.status(400).json({ errors: errors.array() })
}

export const ValidateReq = (validator: ValidationChain) => {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    
    // Extend route with validation
    if(!Array.isArray(descriptor.value)) {
      descriptor.value = [descriptor.value]
    }

    if(!descriptor.value.includes(validateRequestMiddleware)) {
      descriptor.value = [validateRequestMiddleware, ...descriptor.value]
    }

    // Replace original route with chain of middlewares
    descriptor.value = [validator, ...descriptor.value]
  }
}


