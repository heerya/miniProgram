// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    activity_id,
    author
  } = event;
  let result = null;
  try {
    const db = cloud.database();
    const collection = db.collection('like');
    const _ = db.command;
    result = await collection.where({
      activity_id: activity_id,
      author:author
    }).get()
    if (!result.data.length) {
      result = await collection.add({
        data: {
          activity_id,
          author
        }
      })
      result = await db.collection('activity').where({
        _id: event.activity_id
      }).update({
        data: {
          like: true,
          likenum: _.inc(1)
        }
      })
    } else {
      //如果没点赞，就加一，如果点赞了，就减一
      result = await db.collection('activity').where({
        _id: activity_id
      }).get()
      if (result.data[0].like) {
        if (result.data[0].likenum == 1) {
          try {
            result = await collection.where({
              activity_id: activity_id
            }).remove()
          } catch (e) {
            console.log(e);
          }
        }
        return await db.collection('activity').where({
          _id: event.activity_id
        }).update({
          data: {
            like: false,
            likenum: _.inc(-1)
          }
        })
      } else {
        return await db.collection('activity').where({
          _id: event.activity_id
        }).update({
          data: {
            like: true,
            likenum: _.inc(1)
          }
        })
      }
    }
  } catch (e) {
    return {
      code: 1, //添加数据失败
      msg: e.message
    }
  }

  return {
    code: 0,
    data: {
      result: result
    }
  }
}