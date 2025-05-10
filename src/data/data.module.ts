import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { UserRepository } from "src/domain/repositories/user.repository";
import { UserLoginUseCase } from "src/domain/usecases/user-login.usecase";
import { UserImplementationRepository } from "./repositories/user/user-implementation.repository";

const userLoginUseCaseFactory = (userRepo: UserRepository) => new UserLoginUseCase(userRepo);
export const userLoginUseCaseProvider = {
  provide: UserLoginUseCase,
  useFactory: userLoginUseCaseFactory,
  deps: [UserRepository],
};

@NgModule({
  providers: [userLoginUseCaseProvider, { provide: UserRepository, useClass: UserImplementationRepository }],
  imports: [CommonModule, HttpClientModule],
})
export class DataModule {}
