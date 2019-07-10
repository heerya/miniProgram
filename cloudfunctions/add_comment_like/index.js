// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    open_id,
    comment_id
  } = event;
  let result = null;
  try {
    const db = cloud.database();
    const collection = db.collection('comment_like');
    const _ = db.command;
    result = await collection.where({
      open_id: open_id,
      comment_id: comment_id
    }).get()
    if (!result.data.length) {
      result = await collection.add({
        data: {
          open_id,
          comment_id
        }
      })
      result = await db.collection('comment').where({
        _id: event.comment_id
      }).update({
        data: {
          like: true,
          likenum: _.inc(1)
        }
      })
    } else {
      //如果没点赞，就加一，如果点赞了，就减一
      result = await db.collection('comment').where({
        _id: comment_id
      }).get()
      if (result.data[0].like) {
        if (result.data[0].likenum == 1) {
          try {
            result = await collection.where({
              comment_id: comment_id
            }).remove()
          } catch (e) {
            console.log(e);
          }
        }
        return await db.collection('comment').where({
          _id: event.comment_id
        }).update({
          data: {
            like: false,
            likenum: _.inc(-1)
          }
        })
      } else {
        return await db.collection('comment').where({
          _id: event.comment_id
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