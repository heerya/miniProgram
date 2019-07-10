// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let result = '';
    let person = '';
    result = await db.collection('product').where({
      _id: event.product_id
    }).get();
    result = cloud.deleteFile({
      fileList: result.data[0].img_id
    })
    person = await db.collection('signup').where({
      product_id: event.product_id
    }).remove();
    return await db.collection('product').where({
      _id: event.product_id
    }).remove();
  } catch (e) {
    console.log('error!', e)
  }
}