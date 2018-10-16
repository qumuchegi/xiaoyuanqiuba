import React, { Component } from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import { Icon,Divider,Button } from 'antd';
import '../CSS/Chat.css';
import io from 'socket.io-client';

let socket = io('ws://localhost:9093');

class Chatt extends Component{
    constructor(props){
        super(props);
        this.state={
            chatInfo:[],
            chatSend:'',
            chatto:'',
            chatfrom:''
        }
     }
     
    componentDidMount(){
        const chatTo=this.props.match.params.chatto;
        const chatFrom=this.props.location.search.substr(1);
        console.log('from',chatFrom);
        this.setState({chatto:chatTo,chatfrom:chatFrom});
        console.log('to',this.props.match.params.chatto);
        let that=this;
        ///以下三行确保socket在此组件渲染之后才执行，不然socket将会游离于组件之外
        ///如果socket游离于组件外那么在组件还没渲染之前都会执行socket，
        //导致socket内的this.setState()在组件没有渲染也即还没有state时就setState,
        //从而报错
        let isthiscomponentBemount=false;
        isthiscomponentBemount=true;
        if(isthiscomponentBemount){
        ////
        socket.on('recmsg',function(data){
            console.log('recmsg',data);
            if(data.to===chatFrom&&data.from===that.props.match.params.chatto){
                //如果接受到的消息的发送对象是当前用户，而且消息的来源和当前发送的对象是一个人则接受该消息到state里
                let chatinfo=[];
                chatinfo=that.state.chatInfo;
                chatinfo.push([data.msg,data.from]);
                console.log(chatinfo);
                that.setState({chatInfo:chatinfo});
            }
        })}
        
    }
     
    handleSend(inputV){
        let chatinfo=[];
        chatinfo=this.state.chatInfo;
        chatinfo.push(inputV);
        this.setState({chatInfo:inputV});
        this.setState({chatInfo:chatinfo});
        console.log(this.state.chatInfo);
        let [from,to,msg]=[this.state.chatfrom,this.state.chatto,inputV];
        socket.emit('sendmsg',{from,to,msg});
        this.input.value=null;
        this.setState({chatSend:''})
    }
    handleBack(){
        this.props.history.goBack();
        ///当前对方给我发的消息不应该存到后台数据库后当初未读消息发给我5
        //所以在我退出的时候应该把对方当前在与我对话时发送的这些消息从数据库中删除掉
        axios.post('http://localhost:9093/user/removechat',{chatFrom:this.state.chatto,chatTo:this.state.chatfrom})
        .then(res=>{
            if(res.status===200&&res.data.code===0) {
                console.log(res.data.msg);
            }
        }
            );

    }

    render(){
        return(
            <div >
             <h3>
                 <span>
                 <span  id='goback' 
                 onClick={()=>this.handleBack()}>
                 <Icon type="left" theme="outlined"/>
                 返回
                 </span> 
                 <span id='span'>
                 <Icon type="message" theme="outlined"  />{this.state.chatto}
                 </span>
                 </span> 
             </h3>

             <div id='chatList'>
             {this.state.chatInfo.map((v,i)=>
              (typeof v)==='string'?
              <div key={i}>
              <Divider className='diveder'/>
              <li>
                  {v}{'   '}<span>{this.state.chatfrom}</span>
              </li>
              </div>
              :
              <div id='chatList-from' key={i}>
              <Divider className='diveder'/>
              <li>
              <span>{v[1]}</span>{v[0]}{'   '}
              </li>
              </div>
              )
             }
             </div>
               
             <div id='inputSend'>
             <input
             placeholder="say something"
             ref={(input)=>this.input=input}
             onChange={
                 e=>this.setState({chatSend:e.target.value})
            }
             />
            <Button id='button' onClick={()=>this.handleSend(this.state.chatSend)}>
            <Icon type="enter" theme="outlined" />
            </Button>
            </div>
           </div>
        )
    }
}
const Chat=withRouter(Chatt)
export default Chat;