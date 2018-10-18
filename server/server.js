var express =require('express');
const Router = express.Router()
var model=require('./mongoDB');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var app=express();
app.use(cookieParser());
app.use(bodyParser.json());

var userInfo=model.getModel('usermodel');
var chatInfo = model.getModel('chatmodel');
var dongtaiInfo=model.getModel('dongtaimodel');
var rateInfo=model.getModel('ratemodel');
/////socket消息
const server = require('http').Server(app);
const io = require('socket.io')(server);
io.on('connection',function(socket){
  
    socket.on('sendmsg',function(data){
        const {from,to,msg}=data;   
        chatInfo.findOne({chatFrom:from,chatTo:to},function(err,dat){
            if(!dat){
                new chatInfo({
                    chatFrom:from,
                    chatTo:to,
                    chatContent:[msg],
                }).save();
            }else{
                dat.chatContent.push(msg);
                dat.save();
                
            }
        });      
        io.emit('recmsg',{from,to,msg})
    })
})
 
//允许跨域
app.all('*',function(req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Content-Length,Authorization, Accept,yourHeaderFeild");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type","application/json;charset=utf-8");
    next();
    });
//查看mongoDB数据库内容，便于调试
Router.get('/userinfo',function(req,res){
    userInfo.find({},function(err,dat){
        return res.json(dat)
    })
});
Router.get('/chatinfo',function(req,res){
    chatInfo.find({},function(err,dat){
        return res.json(dat)
    })
});
Router.get('/getdongtaiinfo',function(req,res){
    dongtaiInfo.find({},function(err,dat){
        return res.json(dat);
    })
})
Router.get('/getrateinfo',function(req,res){
    rateInfo.find({},function(err,dat){
        return res.json(dat)
    })
})
Router.post('/getusers',function(req,res){
    userInfo.find({},function(err,dat){
         
        return res.json({code:0,data:dat});
}) 
});
Router.post('/saverate',function(req,res){
    const{evaFrom,
    evaTo,
    //评价数据：
    pangdaiV,
    chuanqiuV,
    fangshouV,
    zuzhiV,
    tingqiuV,
    zhanweiV,
    shemenV,
    suduV,
    liliangV,
    menqianxiujueV,
    wuqiuV,
}=req.body;
rateInfo.findOne({evaFrom:evaFrom,evaTo:evaTo},function(err,dat){
    if(!dat){
        new rateInfo({
            evaFrom,
            evaTo,
            //评价数据：
            pangdaiV,
            chuanqiuV,
            fangshouV,
            zuzhiV,
            tingqiuV,
            zhanweiV,
            shemenV,
            suduV,
            liliangV,
            menqianxiujueV,
            wuqiuV
        }).save();
        return res.json({code:0,data:'已经保存评价数据！'})
    }
    if(dat){
        return res.json({code:1,data:'你已经对他评价过了'})
    }
})
})

Router.post('/getmyrate',function(req,res){
    const {user}=req.body;
    rateInfo.find({evaTo:user},function(err,data){
        let datt=[];
        for(let v of data){
            datt.push(v)
        }
        return res.json({code:0,data:datt});
    })
})
Router.post('/savedongtai',function(req,res){
    const {dongtaiOwner,dongtaiContent}=req.body;

    ////以下的代码是把每个人的动态内容存到自己的字段里
    ///但是实际上动态应该是每个人每一次动态都应该与自己的其他
    //动态是互相独立的,所以其实应该改为后面的代码
    
    dongtaiInfo.findOne({dongtaiOwner:dongtaiOwner},function(err,dat){
        if(!dat){
            let content=[];
            content.push(dongtaiContent);
            new dongtaiInfo({
                dongtaiOwner:dongtaiOwner,
                dongtaiContent:content,
                dongtaiStarsNum:0
            }).save();
            return res.json({code:0,data:'已经保存动态！'})
        }else{
            
            dat.dongtaiContent.push(dongtaiContent);
            dat.save();
            return res.json({code:0,data:'已经保存动态！'})

        }
    })
    
   /*
   new dongtaiInfo({
    dongtaiOwner:dongtaiOwner,
    dongtaiContent:dongtaiContent,
    dongtaiStarsNum:0
    }).save();

    return res.json({code:0,data:'已经保存动态！'})
*/

})
Router.post('/getchat',function(req,res){
    chatInfo.find({},function(err,dat){
        let datt=[];
        for(let v of dat){
            datt.push(v)
        }
        return res.json({code:0,data:datt});
}) 
})
Router.post('/removechat',function(req,res){
    const {chatFrom,chatTo}=req.body;
    chatInfo.findOne({chatFrom:chatFrom,chatTo:chatTo},function(err,dat){
        if(dat){
            dat.remove();
            return res.json({code:0,msg:'已经删除已读消息！！！'})
        }
    })
})
Router.post('/getmyfriends',function(req,res){
    const {userName}=req.body;
    userInfo.findOne({userName:userName},function(err,dat){
        const friendsList=dat.myFriends;    
    return res.json({code:0,data:friendsList});
    })
    
   

})
Router.post('/getmyfriendsdongtai',function(req,res){
    const {i}=req.body;
    userInfo.findOne({userName:i},function(err,dat){
        let myfriendsArr=dat.myFriends;
        var ii=i;
        if(myfriendsArr===[]){
          return  res.json({code:1,msg:'没有好友，所以不能找到好友的动态'})
        }else{
            var allfriendsdongtai=[];
            console.log(myfriendsArr.length);
            for(let i=0;i<myfriendsArr.length;i++){
            dongtaiInfo.findOne({dongtaiOwner:myfriendsArr[i]},function(err,data){//找好友的动态
                    if(!err){
                        allfriendsdongtai.push(data);
                    }else{
                        console.log('虽然有好友但好友还没有动态');
                    }
                    console.log('myfriendsArr.length',myfriendsArr.length)
                    console.log('i',i)
                    if(i===myfriendsArr.length-1)//为什么不能用if(i===myfriendsArr.length-1)
                     {
                         console.log('allfriendsdongtai',allfriendsdongtai);
                         dongtaiInfo.findOne({dongtaiOwner:ii},function(err,dat){//找自己的动态
                            allfriendsdongtai.push(dat);
                            console.log('加上我的动态后',allfriendsdongtai);
                            res.json({code:0,data:allfriendsdongtai});
                          })
                   
                }
                });
            }

        }
    })
})
Router.post('/addfriends',function(req,res){
    const {friendName,myName}=req.body;
    userInfo.findOne({userName:myName},function(err,doc){
        doc.myFriends.push(friendName);
        doc.save();
        return res.json({code:0,msg:'已经添加对方为好友'})
    })
    }
)
Router.post('/login', function(req,res){
        const {userName, userPassword} = req.body;
        userInfo.findOne({userName, password:userPassword},function(err,doc){
            if (!doc) {
                return res.json({code:1,msg:'用户名或者密码错误'})
            }
            res.cookie('userid', doc._id)
            return res.json({code:0,data:doc})
        })
    });
    
Router.post('/userregister',function(req,res){
     const {userName,userPassword,userXueyuan,userZhuanye,userAihao}=req.body;
     userInfo.findOne({userName},function(err,data){
         if(data){return res.json({code:1,msg:'用户名已经注册'})}
         else{
            var userM=new userInfo(
               {userName:userName,
                password:userPassword,
                xueyuan:userXueyuan,
                zhuanye:userZhuanye,
                aihao:userAihao});
            userM.save(
               function(err,doc){
                   if(err){
                    return res.json({mess:'用户信息入库出错'})
                    }            
                     const {userName,xueyuan,_id}=doc;
                     res.cookie('userid',_id);
                     return res.json({code:0,data:{userName,xueyuan,_id}});
                 }
             )
         }
     })
}); 

//chatInfo.find({},function(err,doc){doc.map(v=>v.remove())});
//userInfo.find({},function(err,doc){doc.map(v=>v.remove())});
//dongtaiInfo.find({},function(err,doc){doc.map(v=>v.remove())});
//rateInfo.find({},function(err,doc){doc.map(v=>v.remove())});;
app.use('/user',Router);
//app.listen(9093,console.log('服务器开启'));
server.listen(9093,console.log('server'))