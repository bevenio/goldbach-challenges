import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken';

import { secretKey } from '../secrets/authorization';
import { Role } from "../typings/roles";
import { JWTTokenDecoded } from "../typings/jwt";

declare global {
    namespace Express {
        interface Request {
            role: Role
        }
    }
}

const extractToken = (req: Request): string | null => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return `${req.query.token}`;
    }
    return null;
}


const setRequestAuthorization = (role: string, req: Request) => {
    if((<any>Object).values(Role).includes(role)) {
        req.role = role as Role
    } else {
        req.role = Role.NONE
    }
}

const createAuthorizeMiddleware = (roles: string[])=> {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        const isRoleNeeded = roles.length > 0
        
        if(token) {
            verify(token, secretKey, function(err, decoded) {
                if(err) return res.status(401).json({ msg: err });

                const {userRole, iat, exp} = decoded as JWTTokenDecoded
                if(!roles.includes(userRole) && isRoleNeeded) return res.status(403).json({ msg: 'Insufficient rights' });
                
                setRequestAuthorization(userRole, req);
                return next();
            });
        } else {
            if(!isRoleNeeded) {
                setRequestAuthorization('none', req);
                return next();
            }
            return res.status(401).json({msg: 'No token provided'});
        }        
    }
}

export const Authorize = (...roles: Role[]) => {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {

        // Extend route with authorization
        if(!Array.isArray(descriptor.value)) {
            descriptor.value = [descriptor.value]
        }

        // Replace original route with chain of middlewares
        descriptor.value = [createAuthorizeMiddleware(roles), ...descriptor.value]
    }
  }