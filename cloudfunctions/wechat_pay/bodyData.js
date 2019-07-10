function bodyData(wechat, payBody, non_str, openid, out_trade_no, total_fee, sign,ip) {
  var bodyData = "<xml>";
  bodyData += "<appid>" + wechat.appid + "</appid>";//小程序ID
  bodyData += "<body>" + payBody + "</body>";// 商品描述
  bodyData += "<mch_id>" + wechat.mch_id + "</mch_id>";// 商户号
  bodyData += "<nonce_str>" + non_str + "</nonce_str>";// 随机字符串
  bodyData += "<openid>" + openid + "</openid>";// 用户标志
  bodyData += "<notify_url>" + wechat.notify_url + "</notify_url>";// 支付成功的回调地址
  bodyData += "<out_trade_no>" +out_trade_no + "</out_trade_no>";// 商户订单号
  bodyData += "<spbill_create_ip>" + ip + "</spbill_create_ip>";// 终端IP
  bodyData += "<total_fee>" + total_fee + "</total_fee>";// 总金额 单位为分
  bodyData += "<trade_type>JSAPI</trade_type>";// 交易类型 小程序取这个
  bodyData += "<sign>" + sign + "</sign>";// 签名
  bodyData += "</xml>"
  return bodyData;
}
module.exports = bodyData