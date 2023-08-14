import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGlobalGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    const { role } = context.switchToHttp().getRequest().whoAmi;
    if (!roles) {
      return true;
    }
    if (roles.includes(role)) return true;
    return false;
  }
}
