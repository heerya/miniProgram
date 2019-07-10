// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const db = cloud.database();
    return await db.collection('activity').where({
      _id: event.activity_id
    }).update({
      data: {
        use: false
      }
    })
  } catch (e) {
    console.log('error!', e)
  }
}