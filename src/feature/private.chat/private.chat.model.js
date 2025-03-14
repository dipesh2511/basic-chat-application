export default class PrivateChatModel {
  constructor(sender, receiver, message) {
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
  }

  static create(sender, receiver, message) {
    let new_chat = new PrivateChatModel(sender, receiver, message);
    return new_chat;
  }

  static list() {}

  static get() {}

  static update() {}

  static delete() {}
}
