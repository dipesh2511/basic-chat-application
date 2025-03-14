import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";
export default class UserController {
  constructor() {
    this.UserRepository = new UserRepository();
  }

  async create(req, res, next) {
    let { name, email, password } = req.body;
    let bcrypt_password = UserModel.bcryptPassword(password);
    let new_user = UserModel.create(name, email, bcrypt_password);
    try {
      let result = await this.UserRepository.create(new_user);
      if (result.status_code === 201) {
        return res.status(200).send(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async read(req, res, next) {}

  async list(req, res, next) {}

  async update(req, res, next) {}

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
