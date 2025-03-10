import { Mapper } from "src/base/mapper";
import { UserEntity } from "../entities/user-entity";
import { UserModel } from "src/domain/models/user.model";

export class UserImplementationRepositoryMapper extends Mapper<UserEntity, UserModel> {
  mapFrom(param: UserEntity): UserModel {
    return {
      id: param.id,
      fullName: param.name,
    };
  }

  mapTo(param: UserModel): UserEntity {
    return {
      id: param.id,
      name: param.fullName,
    };
  }
}
