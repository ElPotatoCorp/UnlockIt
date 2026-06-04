import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthOptionalGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any) {
        if (err || !user) {
            return null; // Return null instead of throwing an error
        }
        return user;
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
}