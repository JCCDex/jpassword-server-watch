import MessageCode from "@/js/base/message-code";

class Response {
  constructor(res) {
    this.code = res.code;
    this.message = res.message || res.msg;
    this.data = res.data;
  }

  isSuccess() {
    return this.code == MessageCode.Success;
  }
}

export default Response;
