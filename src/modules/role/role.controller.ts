import { Body, Controller, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { Types } from "mongoose";

@Controller("roles")
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post()
    create(@Body() body: {domainId: string, actionId: string}) {
        return this.roleService.create(new Types.ObjectId(body.domainId), new Types.ObjectId(body.actionId))
    }
}