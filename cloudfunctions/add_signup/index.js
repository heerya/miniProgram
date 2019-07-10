// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = null;
  try {
    const db = cloud.database();
    const collection = db.collection('signup');
    result = await collection.add({
      data: event
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