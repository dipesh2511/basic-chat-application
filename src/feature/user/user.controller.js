import ApplicationLevelError from "../../custom.error.logs.reponses/application.level.error.js";
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";
export default class UserController {
  constructor() {
    this.UserRepository = new UserRepository();
  }

  async create(req, res, next) {
    let { name, email, password } = req.body;
    let profile_photo = null;
    if (req.file) {
      profile_photo = `http://localhost:3000/${req.file.filename}`;
    }

    let new_user = UserModel.create(name, email, password, profile_photo);
    try {
      let result = await this.UserRepository.create(new_user);
      if (result.status_code === 201) {
        return res.status(200).send(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      let result = await this.UserRepository.list(req.payload);
      return res.send(result);
    } catch (error) {
      next(error)
    }
  }

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
      let updateUserBody = req.body || {};
      if (req.file) {
        updateUserBody.profile_photo = `http://localhost:3000/${req.file.filename}`;
      }
      if(updateUserBody.friends){
        updateUserBody.friends = updateUserBody.friends.trim();
      }

      if (!typeof updateUserBody.friends == "string") {
        throw new ApplicationLevelError(
          "Friend show be provided as a string",
          404,
          "Friends should be a String",
          "Bad Request"
        );
      }
      console.log(updateUserBody)
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
        let token = UserModel.login(
          result.data.name,
          result.data._id,
          result.data.email
        );
        result.access = token;
        return res.status(200).send(result);
      }
    } catch (error) {
      next(error);
    }
  }
}
