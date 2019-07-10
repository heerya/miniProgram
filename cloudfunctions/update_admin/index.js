// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const db = cloud.database();
    return await db.collection('admin').where({
      _id: event.id
    }).update({
      data: {
        admin: event.new_admin
      }
    })
  } catch (e) {
    console.log('error!', e)
  }
}