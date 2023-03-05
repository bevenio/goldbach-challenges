import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { ValidateReq } from '../utils/decorators/validateRequest';

import { Role } from '../utils/typings/roles';
import { AuthService } from '../services/auth.service';

interface RequestBodyLogin {
    username: string;
    password: string;
}

class x {
    x: 0
}

export class AuthController {

    @ValidateReq(body('username').isString())
    @ValidateReq(body('password').isString())
    public async login(req: Request<{}, {}, RequestBodyLogin, {}>, res: Response, next: NextFunction): Promise<Response> {
        const {username, password} = req.body;
        const userRole = AuthService.getUserRole(username, password);
        
        if(userRole !== Role.NONE) {
            const token = AuthService.createUserToken(userRole);
            return res.status(200).send({token})
        }
        return res.status(401).send({message: "Unauthorized"})
    }
}