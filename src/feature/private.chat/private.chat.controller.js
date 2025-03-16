import PrivateChatModel from "./private.chat.model.js";
import PrivateChatRepository from "./private.chat.repository.js";
export default class PrivateChatController {
  constructor() {
    this.privateChatRepository = new PrivateChatRepository();
  }

  async create(req, res, next) {
    let { sender, receiver, message } = req.body;
    let new_chat = PrivateChatModel.create(sender, receiver, message);
    try {
      let result = await this.privateChatRepository.create(new_chat);
      if (result.status_code === 201) {
        return res.status(200).send(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    let { persons } = req.query;
    persons = persons?.split(",").map((r) => r.trim());
    try {
      let result = await this.privateChatRepository.list(persons);
      if (result.status_code === 200) {
        return res.status(200).send(result);
      }
      return res.send({ persons });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {}

  async update(req, res, next) {}

  async delete(req, res, next) {}
}
