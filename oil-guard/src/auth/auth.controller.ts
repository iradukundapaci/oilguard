import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { Authorize } from "./decorators/authorize.decorator";
import { GetUser } from "./decorators/get-user.decorator";
import { JwtGuard } from "./guards/jwt.guard";
import { SignInDto } from "./dto/sign-in.dto";
import { SignupDto } from "./dto/sign-up.dto";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiRequestBody,
  BadRequestResponse,
  ConflictResponse,
  CreatedResponse,
  ErrorResponses,
  GetOperation,
  OkResponse,
  PostOperation,
  UnauthorizedResponse,
} from "../__shared__/decorators";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostOperation("/login", "Log in a user")
  @HttpCode(200)
  @OkResponse(SignInDto.Output)
  @ApiRequestBody(SignInDto.Input)
  @ErrorResponses(BadRequestResponse)
  async login(
    @Body() signInDTO: SignInDto.Input,
  ): Promise<GenericResponse<SignInDto.Output>> {
    const payload = await this.authService.signIn(signInDTO);
    return new GenericResponse("Logged in successfully", payload);
  }

  @PostOperation("/signup", "Sign up a new user")
  @CreatedResponse()
  @ApiRequestBody(SignupDto.Input)
  @ErrorResponses(ConflictResponse, BadRequestResponse)
  async SignUp(@Body() signUpDTO: SignupDto.Input): Promise<GenericResponse> {
    await this.authService.signup(signUpDTO);
    return new GenericResponse("User successfully registered");
  }

  @GetOperation("/logout", "Sign out a user")
  @OkResponse()
  @ErrorResponses(UnauthorizedResponse)
  async logout(@GetUser("id") id: number): Promise<GenericResponse> {
    await this.authService.logout(id);
    return new GenericResponse("Logged out successfully");
  }
}
