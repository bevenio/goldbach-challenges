import { sign } from "jsonwebtoken";
import { secretKey, tokenExpiresIn } from "../utils/secrets/authorization";
import { Role } from "../utils/typings/roles"

export class AuthService {
    public static getUserRole(username: string, password: string) {
        if (username === Role.USER && password === Role.USER) return Role.USER
        else if (username === Role.ADMIN && password === Role.ADMIN) return Role.ADMIN
        return Role.NONE
    }

    public static createUserToken(userRole: Role) {
        const expiresIn = tokenExpiresIn;
        return sign({userRole}, secretKey, { expiresIn })
    }
}


