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
module.exports={
    getModel:function(modelname){
        return mongoose.model(modelname)
    }
}


