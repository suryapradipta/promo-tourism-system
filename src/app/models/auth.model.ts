import {RoleModel} from "./role.model";

export interface AuthModel {
  username: string;
  password: string;
  role : RoleModel;
}
