import MessageCode from "@/js/base/message-code";

class ExtendableError {
  constructor(message) {
    this.name = this.constructor.name;
    this.message = message;
  }
}

ExtendableError.prototype = Object.create(Error.prototype);
ExtendableError.prototype.constructor = ExtendableError;

class ApiError extends ExtendableError {
  constructor(message, code, data) {
    super(message);
    this.code = code;
    if (data) {
      this.data = data;
    }
  }

  isUnassignedRole() {
    return this.code === MessageCode.Unassigned_Role;
  }
}

export default ApiError;
