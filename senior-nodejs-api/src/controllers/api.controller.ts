import { NextFunction, Request, Response } from 'express';
import { query} from "express-validator";

import { ApiService } from "../services/api.service";
import { Authorize } from "../utils/decorators/authorizeAccess";
import { ValidateReq } from "../utils/decorators/validateRequest";
import { Role } from "../utils/typings/roles";

interface RequestQueryGetAll {
    start_element: string;
    num_elements: string;
}

export class ApiController {
    @ValidateReq(
        query('start_element', "Value must be greater than 0")
            .default(0)
            .isInt({ min: 0})       
    )
    @ValidateReq(
        query('num_elements', "Value must be between 0-100")
            .default(100)
            .isInt({ min: 0, max: 100})       
    )
    @Authorize(Role.ADMIN, Role.USER)
    public async getAll(req: Request<{}, {}, {}, RequestQueryGetAll>, res: Response, next: NextFunction): Promise<Response> {
        const isAuthorized = req.role === Role.ADMIN
        const index = Number(req.query['start_element'])
        const amount = Number(req.query['num_elements'])
     
        const apiList = await ApiService.getApiList(index, amount, isAuthorized);
        return res.status(200).send(apiList)
    }
}