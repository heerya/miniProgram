// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
// let whiteList = [];
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    author,
    title,
    money,
    maintext,
    start_time,
    end_time,
    edit_time,
    img_id
  } = event;
  let result = null;
  try {
    const db = cloud.database();
    const collection = db.collection('activity');
    result = await collection.add({
      data: {
        author,
        title,
        money,
        maintext,
        start_time,
        end_time,
        edit_time,
        img_id,
        _openid: wxContext.OPENID,
        use: true,
        like: false,
        likenum: 0
      }
    })
  }
  catch (e) {
    return {
      code: 1, //添加数据失败
      msg: e.message
    }
  }
  console.log(result);

  return {
    code: 0,
    data: {
      id: result.id
    }
  }
}