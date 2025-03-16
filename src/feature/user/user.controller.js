import ApplicationLevelError from "../../custom.error.logs.reponses/application.level.error.js";
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";
export default class UserController {
  constructor() {
    this.UserRepository = new UserRepository();
  }

  async create(req, res, next) {
    let { name, email, password } = req.body;
    // let bcrypt_password = UserModel.bcryptPassword(password);
    let new_user = UserModel.create(name, email, password);
    try {
      let result = await this.UserRepository.create(new_user);
      if (result.status_code === 201) {
        return res.status(200).send(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {}

  async read(req, res, next) {
    try {
      let id = req.params;
      let result = await this.UserRepository.read(id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      let { id } = req.params;
      let updateUserBody = req.body;
      if (!typeof updateUserBody.friends == "object") {
        throw new ApplicationLevelError(
          "Friends show be provided as a array",
          404,
          "Friends should be a array",
          "Bad Request"
        );
      }
      updateUserBody.friends = updateUserBody.friends.map((key) => key.trim());
      let result = await this.UserRepository.update(id, updateUserBody);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {}

  async generateOtp(req, res, next) {}

  async verifyOtp(req, res, next) {}

  async login(req, res, next) {
    let { email, password } = req.body;
    try {
      let result = await this.UserRepository.login(email, password);
      if (result.status_code === 200) {
        let token = UserModel.login(result.data.name, result.data._id);
        result.access = token;
        return res.status(200).send(result);
      }
    } catch (error) {
      next(error);
    }
  }
}
