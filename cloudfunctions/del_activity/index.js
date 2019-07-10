// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let result = '';
    let person = '';
    result = await db.collection('activity').where({
      _id: event.activity_id
    }).get();
    result = cloud.deleteFile({
      fileList: result.data[0].img_id
    })
    person = await db.collection('signup').where({
      activity_id: event.activity_id
    }).remove();
    return await db.collection('activity').where({
      _id: event.activity_id
    }).remove();
  } catch (e) {
    console.log('error!', e)
  }
}