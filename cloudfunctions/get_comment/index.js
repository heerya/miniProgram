// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let comment_result = {}, comment = {};
    comment_result = await db.collection('comment').where({
      activity_id: event.activity_id
    }).get();
    comment_result = comment_result.data.concat([]);
    for (var i = 0; i < comment_result.length; i++) {
      comment = await db.collection('comment_like').where({
        comment_id: comment_result[i]._id,
        author: event.userinfo
      }).get();
      comment_result[i].like = comment.data.length == 0? false:true;
    }
    return comment_result;
  } catch (e) {
    console.log('error!', e)
  }
}