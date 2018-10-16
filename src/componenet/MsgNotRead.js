import React, { Component } from 'react';
import {Divider,Icon,Badge,Avatar} from 'antd';
import axios from 'axios';
import '../CSS/MsgNotRead.css'
import {withRouter} from 'react-router-dom'
import io from 'socket.io-client';
 

const socket = io('ws://localhost:9093');
class MsgNotReadd extends Component {
    constructor(props){
        super(props);
        this.state={
            chatNotReadInfo:[],
            chatNotReadFrom:[],
            isshowIcon:false,
            isshowmsg:false,
            numofNotRead:0
        }
    };
    saveChatsTohere(data){
        let dataa=[];
        let Froom=[];
        data.forEach(v=>{
             if(this.props.user===v.chatTo){
            dataa[v.chatFrom]=[];
            Froom.push(v.chatFrom);
             v.chatContent.forEach(i=>{
            dataa[v.chatFrom].push(i)
             })}
        })
      this.setState({chatNotReadInfo:dataa,chatNotReadFrom:Froom});
      console.log('axios请求到的未读消息来源',this.state.chatNotReadFrom);
      this.setState({numofNotRead:this.state.chatNotReadFrom.length});
      console.log('axios请求到的未读消息',this.state.chatNotReadInfo);
    }
    componentDidMount(){
        const user=this.props.user;
        axios.post('http://localhost:9093/user/getchat',{userName:user})
        .then(res=>{
            if(res.status===200&&res.data.code===0) {
                this.saveChatsTohere(res.data.data);
            }
        }
            );
            let that=this;
        ///以下三行确保socket在此组件渲染之后才执行，不然socket将会游离于组件之外
        ///如果socket游离于组件外那么在组件还没渲染之前都会执行socket，
        //导致socket内的this.setState()在组件没有渲染也即还没有state时就setState,
        //从而报错
        let isthiscomponentBemount=false;
        isthiscomponentBemount=true;
        if(isthiscomponentBemount){
        ////
    //为了解决一个用户在当前组件页面上无法接受到另一个人同时发过来的消息，从chat.js引入一下socket部分
    socket.on('recmsg',function(data){
        if(data.to===that.props.user){
            //如果接受到的消息的发送对象是当前用户，而且消息的来源和当前发送的对象是一个人则接受该消息到state里
            let dataa=[];
            dataa=that.state.chatNotReadInfo;
            let Froom=[];
            Froom=that.state.chatNotReadFrom;
            if(!dataa[data.from]){
                dataa[data.from]=[]
            }
            dataa[data.from].push(data.msg);
            Froom.push(data.from);
            var setfroom=new Set(Froom);
            var settoarr=[...setfroom];
            that.setState({chatNotReadInfo:dataa,chatNotReadFrom:settoarr});
            that.setState({numofNotRead:that.state.chatNotReadFrom.length});
           
        }
    })
}
    
}
    componentWillUnmount(){
        this.setState({
            chatNotReadInfo:[],
            chatNotReadFrom:[],
            isshowIcon:false,
            isshowmsg:false
        })
    }
 
    

    huifu(v){
        this.props.history.push(`/chat/${v}?${this.props.user}`);
        const user=this.props.user;
        axios.post('http://localhost:9093/user/removechat',{chatFrom:v,chatTo:user})
        .then(res=>{
            if(res.status===200&&res.data.code===0) {
                console.log(res.data.msg);
                 
            }
        }
            );

    }

    render(){
        let num=0;
        let nu=0;
        
        return(
            <div>
                <h3 
                onClick={()=>{this.setState({numofNotRead:0});this.setState({isshowmsg:!this.state.isshowmsg,isshowIcon:!this.state.isshowIcon})}}>
               <Badge count={this.state.numofNotRead}></Badge>
                消息列表
                <span>
                            {this.state.isshowIcon?
                            <Icon type="down" theme="outlined" />
                            :<Icon type="up" theme="outlined" />
                        }
                            </span>
                </h3>
                {this.state.chatNotReadFrom.length===0?
                (
                <div style={{textAlign:'center',color:'red',fontSize:'130%'}}>
                   <div style={{textAlign:'center',color:'red',fontSize:'130%'}}>
                        <Icon type="robot" theme="outlined" />
                    </div>
                    <div style={{padding:'10%',textAlign:'center',color:'red',fontSize:'130%',textShadow:'18px 18px 2px black'}}>
                    无未读消息
                    </div>
                </div>
                )
                :
                null
                }
            {
               this.state.chatNotReadFrom.map(v=>
                    (
                        <div key={nu++} className='eachFrom'>
                           <span>
                               <span style={{ marginRight: 24 }}>
                                <Badge count={this.state.chatNotReadInfo[v].length} style={{width:'10%'}}>
                                <Avatar shape="square" icon="user" />
                                </Badge>
                               </span>
                               <span id='notReadchatinfofrom'>
                                 {v}  
                                </span> 
                           </span>
                                  
                           <span className='huifu'
                                onClick={()=>this.huifu(v)}
                                >
                                回复
                                </span>                    
                            {this.state.isshowmsg?
                            this.state.chatNotReadInfo[v].map(i=>
                                <div className='msg'  key={num++}>
                               
                                <li className='msgli'>{i}</li>
                                <Divider className='divider'/>
                                </div>
                            ):null}
                            <Divider/>
                        </div>
                    )
            )
            }
            </div>
        )
}
}
 const MsgNotRead=withRouter(MsgNotReadd);
export default MsgNotRead;
