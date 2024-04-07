import { i18n } from "@/js/render";
import { Message } from "element-ui";
import ApiError from "@/js/api/response/api-error";

const apiErrorMessage = (error, messageApi) => {
  const m = messageApi || Message;
  if (error instanceof ApiError) {
    const messageCode = i18n.t(`message.messageCode`);
    const message = messageCode[error.code] || error.message;
    m.error(message);
  } else {
    m.error(error.message);
  }
};

export { apiErrorMessage };
