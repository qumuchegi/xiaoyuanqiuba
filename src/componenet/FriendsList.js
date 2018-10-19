import React, { Component } from 'react';
import axios from 'axios';
import { List, Card,Icon,Tabs, Divider} from 'antd';
import { Button } from 'antd';
 
 
import '../CSS/FriendsList.css'
import { withRouter } from 'react-router-dom';


class FriendsLists extends Component{
    constructor(props){
        super(props);
        this.state={
             friends:[0],
             users:[0],
             myfriendsdongtai:[],
             isGetFriends:false,
             isGetUsers:false,
             isAddButtonShow:false,
             isPublishDongtaiShow:false,
             hasstared:false
        }
        this.saveUsers=this.saveUsers.bind(this);
        this.addFriends=this.addFriends.bind(this);
        this.saveFriends=this.saveFriends.bind(this);
        
    }
    saveUsers(data){
        this.setState({users:data})
        this.setState({isGetUsers:true})
    }
    saveFriends(data){
        this.setState({friends:data});
        this.setState({isGetFriends:true})
    }
    componentDidMount(){
        const user=this.props.user;
        axios.post('http://localhost:9093/user/getusers',{userName:user})//获取所以用户
        .then(res=>{
            if(res.status===200&&res.data.code===0) 
            {console.log('未加好友',res.data.data);
             this.saveUsers(res.data.data);
            }
            if(res.status===200&&res.data.code===2) {
                console.log(res.data.msg)
            }
           return this.state.isGetUsers;
        })
        .then(
            isGetUsers=>{
            axios.post('http://localhost:9093/user/getmyfriends',{userName:user})//获取当前用户的好友
            .then(res=>{
                if(res.status===200&&res.data.code===0){
                    this.saveFriends(res.data.data)
                    console.log(res.data.data)
                    console.log('已经得到我的好友');
                    
                }
                
            })
            return this.state.isGetFriends;
        }
        )
        .then(
            isGetFriends=>{
                let notFriends;
                if(this.state.isGetFriends||this.state.isGetUsers){
                   
                     notFriends=this.state.users.filter(u=>!this.state.friends.some(f=>f===u.userName));
                      
                       this.setState({
                        users:notFriends });
                       console.log('不是好友：',notFriends);
                       console.log('454545',this.state.friends)
                }
            }
        )
        axios.post('http://localhost:9093/user/getmyfriendsdongtai',{i:this.props.user})//获取好友的动态
        .then(res=>{
            if(res.status===200&&res.data.code===0){
                this.setState({myfriendsdongtai:res.data.data});
                console.log('好友动态内容：',this.state.myfriendsdongtai)
            }
        })
    }
    updateMyfriends(){
        const user=this.props.user;
        axios.post('http://localhost:9093/user/getmyfriends',{userName:user})
        .then(res=>{
            if(res.status===200&&res.data.code===0){
                this.saveFriends(res.data.data)
                console.log(res.data.data)
                console.log('已经得到我的好友')
            }
        })
    }

    addFriends(friendName,myName){
        console.log(friendName);
        let NotAddFriends=this.state.users.filter(v=>v.userName!==friendName);
        console.log('添加好友后剩余的未加好友：',NotAddFriends);
        this.setState({users:NotAddFriends});
        axios.post('http://localhost:9093/user/addfriends',{friendName,myName})
        .then(res=>{
            if(res.status===200&&res.data.code===0) console.log('已经添加对方为好友')
  
        })
    }
    publishDongtai(){
        console.log('我发出的动态内容：',this.textarea.value);
        axios.post('http://localhost:9093/user/savedongtai',
        {dongtaiOwner:this.props.user,dongtaiContent:this.textarea.value})
        .then(res=>{
            if(res.status===200&&res.data.code===0) console.log('已经在数据库里保存好动态内容和动态主人')
        });
        this.textarea.value=null;
        axios.post('http://localhost:9093/user/getmyfriendsdongtai',{i:this.props.user})//获取好友的动态
        .then(res=>{
            if(res.status===200&&res.data.code===0){
                this.setState({myfriendsdongtai:res.data.data});
                console.log('好友动态内容：',this.state.myfriendsdongtai)
            }
        })
        this.setState({isPublishDongtaiShow:!this.state.isPublishDongtaiShow});
    }
    evaluate(evaTo,evaFrom){
        this.props.history.push(`/eva/${evaTo}?${evaFrom}`)
        console.log('评价')
    }
    render(){
        const TabPane = Tabs.TabPane;
        var t=0;
        var ttt=0;
        return(
            <div>
            <Tabs tabPosition='left' className='footNavBar'>
            <TabPane tab="我的好友" key="1">
            <Button type='primary'  onClick={()=>this.updateMyfriends()} style={{padding:'1% 26% 1% 29%'}}>
            <Icon type="retweet" theme="outlined" />
            更新我的好友
            </Button>
            { this.state.friends.map(item=>
                <div  key={item}>
                <Divider></Divider>
                <li>
                <div style={{width:'20%'}}>{item}</div>
                <Button id='sendmsgButton' 
                type='default'
                onClick={()=>this.props.history.push(`/chat/${item}?${this.props.user}`)}>
                <Icon type="message" theme="twoTone" />
                给他发消息
                </Button>
                <Button id='evaluate'
                onClick={()=>{
                    this.evaluate(item,this.props.user)
                }}
                type='default'
                >
                
                    评价他的能力
                </Button>
                </li>
                <Divider></Divider>
                </div>
            //(item)=>this.toChat(item)
            )
            }
           </TabPane>

            <TabPane tab="所有用户" key="2">
            <h3 style={{ textAlign:'center',
                         color:'blue',width:'88.5%',
                         padding:'2% 4.5% 2% 5%',
                         boxShadow:'1px 2px 2px 2px rgba(210, 236, 149, 0.767)',
                         marginBottom:'4%',
                         borderRadius:'3px'}}>
            加好友可以接收他的动态
            </h3>
            <List
              grid={{ gutter: 2, column: 1 }}
              dataSource={this.state.users}
              renderItem={item => 
                (

                          <List.Item>
                          <Card title={item.userName} style={{ width: 220,padding:2 }}
                          >
                          {item.xueyuan+'  '+item.zhuanye+'  '+item.aihao}
                          { item.userName===this.props.user?
                          <p style={{color:'red',margin:'3% 5% 3% 6%'}}>我</p>
                          :
                          this.state.friends.some(f=>
                            f===item.userName
                            )
                            ?
                            <div style={{textAlign:'center',fontWeight:'bolder',color:'rgba(145,23,32,0.6)',borderRadius:'3px',padding:'2% 3% 2% 3%',margin:'3% 4% 3% 6%'}}>
                            <Icon type="check-circle" theme="outlined" />
                            已经添加为好友
                            </div>
                            :
                          (
                          <Button type='primary' onClick={()=>this.addFriends(item.userName,this.props.user)}>
                          <Icon type="plus-circle" theme="outlined" />
                          把他加为我的好友
                          </Button>)
                          
                           }
                          </Card>
                         
                          </List.Item>
                          )
                        
                        
                        }
             />
             
            </TabPane>
           
           <TabPane tab="动态空间" key='3'>
            <h2>动态空间</h2>
            <Button type='ghost' 
            onClick={()=>this.setState({isPublishDongtaiShow:!this.state.isPublishDongtaiShow})}>
            {this.state.isPublishDongtaiShow===false?
                '发一条动态':'算了不发了'
            }
            
            </Button>
           {this.state.isPublishDongtaiShow!==false?
            (<div>
            <textarea rows='6' cols='34' ref={textarea=>this.textarea=textarea}/>
           <Button type='primary' 
           style={{padding:'1% 28% 1% 27%'}}
           onClick={()=>
            this.publishDongtai()                                         
           }>
           发布我的动态
           </Button>
           </div>         
           )
           :
           null
           }
            {this.state.myfriendsdongtai.filter(n=>n!==null).map(item=>
            <div key={t++} >
            <Divider/>
            <Card
             className='dongtaicard'
             title={<div><Icon type="smile" theme="outlined" /><span>{item.dongtaiOwner}</span></div>}
             extra={
                 <div>
                 <span>{item.dongtaiStarsNum}</span>
                 <div
                 onClick={()=>
                    {this.setState({hasstared:true});//这里的点赞数加1需要设置到state的myfrienddongtai的相应的点赞数
                     }}
                 >
                 {
                   !this.state.hasstared?
                     <Icon type="like" theme="outlined" />
                     :
                     <Icon type="like" theme="twoTone" />
                 }
                 </div>
                 </div>
             }
             style={{ width: '89%' }}
            >
            <p> {item.dongtaiContent.map(v=>
                <li key={ttt++} id='dongtaili'>
                {v}
                </li>
           )
            }
            </p>
            
           </Card>
           </div>
            )
           }
           </TabPane>
           
        </Tabs>
        </div>

            
        )
    }
 
}
const FriendsList=withRouter(FriendsLists);
export default FriendsList;