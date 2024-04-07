const MessageCode = {
  // 成功
  Success: 0,
  // 数据异常
  Data_Exception: 900,
  // 网络错误
  Network_Error: 901,
  // 系统错误
  System_Error: 902,
  // 参数错误
  Invalid_Parameter: 100,
  // 令牌无效
  Invalid_Token: 101,
  // 签名错误
  Invalid_Sign: 102,
  // 未分配角色权限
  Unassigned_Role: 103,
  // 无调用权限
  Invalid_Call: 104
};

export default MessageCode;
