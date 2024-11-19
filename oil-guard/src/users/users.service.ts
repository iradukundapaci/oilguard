import { PasswordEncryption } from "src/auth/utils/password-encrytion.util";
import { FetchProfileDto } from "./dto/fetch-profile.dto";
import { plainToInstance } from "class-transformer";
import { FetchUserDto } from "./dto/fetch-user.dto";
import { paginate } from "nestjs-typeorm-paginate";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    user.password = PasswordEncryption.hashPassword(user.password);
    return this.usersRepository.save(user);
  }

  registerUser(createUserDto: CreateUserDto.Input) {
    const user = plainToInstance(User, createUserDto);
    return this.createUser(user);
  }

  findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findUserById(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getProfile(userId: number) {
    const userProfile = await this.findUserById(userId);
    return plainToInstance(FetchProfileDto.OutPut, {
      names: userProfile.names,
      email: userProfile.email,
    });
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto.Input,
  ) {
    const user = await this.findUserById(userId);

    if (updateProfileDto.email !== undefined) {
      const exist = await this.usersRepository.findOne({
        where: { email: updateProfileDto.email },
      });

      if (exist && exist.id !== user.id) {
        throw new ConflictException("Email is already in use");
      }
    }

    user.names = updateProfileDto.names ?? user.names;
    user.email = updateProfileDto.email ?? user.email;
    user.role = updateProfileDto.role ?? user.role;
    const updatedUser = await this.usersRepository.save(user);
    return plainToInstance(UpdateProfileDto.OutPut, updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);

    await this.usersRepository.update(user.id, {
      deletedAt: new Date().toISOString(),
      email: `${user.email}-deleted-${new Date().toISOString()}`,
    });
  }

  async findAllUsers(dto: FetchUserDto.Input): Promise<any> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder("user")
      .orderBy("user.id", "DESC")
      .select(["user.id", "user.names", "user.role", "user.email"]);

    if (dto.q) {
      queryBuilder.andWhere(
        "user.names ilike :searchKey OR user.email ilike :searchKey",
        {
          searchKey: `%${dto.q}%`,
        },
      );
    }

    return await paginate<FetchUserDto.Output>(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }
}
