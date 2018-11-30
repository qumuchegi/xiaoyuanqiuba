const mongoose=require('mongoose');
const DBURL='mongodb://localhost:27017/xiaoyuanqiuba';
mongoose.connect(DBURL,{useNewUrlParser:true},err=>console.log(err));
//用户信息的model
mongoose.model('usermodel',
                new mongoose.Schema({
                    userName:String,//用户名
                    password:String,//密码
                    xueyuan:String,//学院
                    zhuanye:String,//专业
                    aihao:String, //爱好 
                    myFriends:[],//好友名           
                     })
)
mongoose.model('chatmodel',
                new mongoose.Schema({
                    chatFrom:String,
                    chatTo:String,
                    chatContent:[],
                    
                })



)
mongoose.model('dongtaimodel',
                new mongoose.Schema({
                    dongtaiOwner:String,
                    dongtaiContent:[],
                    dongtaiStarsNum:Number
                })
)
mongoose.model('ratemodel',
                new mongoose.Schema({
                    evaFrom:String,
                    evaTo:String,
                    //评价数据：
                    pangdaiV:Number,
                    chuanqiuV:Number,
                    fangshouV:Number,
                    zuzhiV:Number,
                    tingqiuV:Number,
                    zhanweiV:Number,
                    shemenV:Number,
                    suduV:Number,
                    liliangV:Number,
                    menqianxiujueV:Number,
                    wuqiuV:Number
                })
)
mongoose.model('invitemodel',
new mongoose.Schema({
    inviteFrom:String,
    inviteTo:String
}))
mongoose.model('trainmodel',
new mongoose.Schema({
    user:String,
    trainTime:Array,//数组，保存每一次踢球时间长短，与下面的trainDay一一对应，如果有一天没有踢球，那么这一天的踢球时间就是0
    trainDay:Array,//数组，与上面的trainTime的每一个元素一一对应，表示每一天踢一次，如['','','']
})
)
mongoose.model('teammodel',
new mongoose.Schema({
    captain:String,//队长名
    players:Array,//队员名数组
    roles:Array,//队员对应的场上角色，中场/前锋/门将/后卫
})
)
module.exports={
    getModel:function(modelname){
        return mongoose.model(modelname)
    }
}


