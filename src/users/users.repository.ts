import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "../_entities/Users";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private usersTable: Repository<Users>
  ) {}
}