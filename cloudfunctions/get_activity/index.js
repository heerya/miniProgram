// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let activity_result = {},comment = {};
    activity_result = await db.collection('activity').get();
    activity_result = activity_result.data.concat([]);
    for (var i = 0; i < activity_result.length; i++){
      comment = await db.collection('like').where({
        activity_id: activity_result[i]._id,
        author: event.userinfo
      }).get();
      activity_result[i].like = comment.data.length == 0 ? false :true;
    }
    return activity_result;
  } catch (e) {
    console.log('error!', e)
  }
}