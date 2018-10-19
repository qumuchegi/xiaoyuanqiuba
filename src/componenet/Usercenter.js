import React,{Component} from 'react';
import { Icon, Card,Tag,Button} from 'antd';
import FriendsList from './FriendsList';
import '../CSS/Usercenter.css';
import { Tabs} from 'antd';
import Daka from './Daka';
import MsgNotRead from './MsgNotRead';
const TabPane = Tabs.TabPane;
//user,logout

//const Usercenter=({user,logout})=>{   
class Usercenter extends Component{
   constructor(props){
     super(props);
     this.state={
     
     }
   }

  render(){
    let user=this.props.user;
    let logout=this.props.logout;
        return (
          //如果已经注册或登录，则从cookie中得到当前用户信息
          //若没有则渲染提供注册或登录表单的页面
          <div>
            <div style={{ background: '#ECECEC', padding: '0px' }}>
             <Card title={<div style={{width:'86%'}}>
             <div style={{marginRight:'30%'}}>{user.userName}</div>
             <Button
             onClick={()=>{
                logout()
             }}
             style={{left:'80%',color:'white',padding:'1% 5% 1% 5%',backgroundColor:'rgba(22,24,123,0.8)'}}>
             <Icon type="export" theme="outlined" />
              注销 
             </Button>
             </div>}
              bordered={false} style={{  }}>
                <Tag color='magenta'>{user.userXueyuan}</Tag>
                <Tag color='volcano'>{user.userZhuanye}</Tag>
                <Tag color='red'>爱好：
                 {user.userAihao}
                </Tag>
             </Card>
            </div>
           
            <Tabs type="card">
            <TabPane tab="我要聊球" key="1">
             <FriendsList user={user.userName}/>
            </TabPane>
            <TabPane tab="未读消息" key="2" id='weiduxiaoxi'>
             <MsgNotRead user={user.userName}/>
            </TabPane>
            <TabPane tab="我的球队" key="3">
             Content of Tab Pane 3
            </TabPane>
            <TabPane tab="好友评价" key="4">
              <Daka user={user.userName}/>
            </TabPane>
            </Tabs>
           
          </div>
        )
             

            }
    }

export default Usercenter;