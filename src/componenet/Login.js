import React,{Component} from 'react';
import { Icon, Form, Input, Button,Alert } from 'antd';
import {Link,withRouter} from 'react-router-dom';
import Usercenter from './Usercenter';
import '../CSS/Login.css';
import axios from 'axios';
 

const FormItem = Form.Item;
class Loginn extends Component {
  constructor(props){
    super(props);
    this.state={
         
            userName:'',
            userXueyuan:'',
            userPassword:'',   
            hasNotInput:false,
            isTrue:true,
            hasLogin:false
    }
    this.isTrue_warn=this.isTrue_warn.bind(this);
  }
  
  componentWillMount(){//以下我直接用的在浏览器自己存cookie，自己用自己的cookie登录
    if(document.cookie){
      let loginInfoArr=document.cookie.split(':');
      console.log('document.cookie', loginInfoArr[0],loginInfoArr[1])
           axios.post('http://localhost:9093/user/login',{userName:loginInfoArr[0],userPassword:loginInfoArr[1]})
           .then(res=>{
            if(res.status===200&&res.data.code===1)   this.isTrue_warn();//alert('用户名或密码错误！');
            if(res.status===200&&res.data.code===0)   
            {this.hasLogin_warn(res.data.data);console.log(res.data)}
           })
         
    //保存登录信息到cookie
     
    }  
        
  }

  reInput(){
    this.setState({
      hasNotInput:false,
      isTrue:true,
      hasLogin:false
    })
  }
  isTrue_warn(){
    this.setState({isTrue:false});
  }
  hasLogin_warn(userdata){
    this.setState(
      {hasLogin:true,
       userName:userdata.userName,
       userXueyuan:userdata.xueyuan,
       userZhuanye:userdata.zhuanye,
       userAihao:userdata.aihao
    })
  }
  
  handleLogin(){    
//如果有登录信息cookie，则用cookie登录
 
    console.log(this.state.userName,this.state.userPassword)
     if(this.state.userName===''||this.state.userPassword===''){
        this.setState({hasNotInput:true})
     }else{
      // this.setState({isVisibility_warn:false});
       axios.post('http://localhost:9093/user/login',this.state)
       .then(res=>{
        if(res.status===200&&res.data.code===1)   this.isTrue_warn();//alert('用户名或密码错误！');
        if(res.status===200&&res.data.code===0)   
        {this.hasLogin_warn(res.data.data);console.log(res.data)}
       })
     };
//保存登录信息到cookie
document.cookie=this.state.userName+':'+this.state.userPassword;
console.log('保存登录信息到cookie:',document.cookie)
  }
    render(){
        return(
              this.state.userXueyuan===''?(
              <div>   
                  <h1>校园球霸</h1>
               <Form  className="login-form" style={{'marginTop':'20%'}}>
                <FormItem>
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>} 
                  placeholder="用户名" 
                  onFocus={()=>this.reInput()}
                  onChange={e=>this.setState({userName:e.target.value})}/>
                </FormItem>
                <FormItem>
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                  type="password" placeholder="密码" 
                  onFocus={()=>this.reInput()}
                  onChange={e=>this.setState({userPassword:e.target.value})}/>
                </FormItem>
               {(this.state.hasNotInput===true)? 
               (
               < Alert
                 message=""
                 description=" 请输入信息！"
                 type="warning"
                showIcon
               />):null}             
               {(this.state.isTrue===false)?
               (< Alert
                 message=""
                 description="用户名或密码错误！"
                 type="warning"
                showIcon
               />):null}
               {(this.state.hasLogin===true)?(<Alert message="登录成功！" type="success" showIcon />):null}
                  <Button type="primary"    onClick={()=>this.handleLogin()} className='dengluButton'>
                   登录
                  </Button>
                  <Link style={{'marginLeft':'50px'}} to='./register'>
                   注册
                  </Link>
               
               </Form>
             </div>)
             : 
             <Usercenter user={this.state} logout={()=>this.setState({
              userName:'',
              userXueyuan:'',
              userPassword:'',   
              hasNotInput:false,
              isTrue:true,
              hasLogin:false
             })}/>

           
             )
    }
}

const Login=withRouter(Loginn);
export default Login;
 /*
             <Usercenter user={this.state} logout={()=>this.setState({
              userName:'',
              userXueyuan:'',
              userPassword:'',   
              hasNotInput:false,
              isTrue:true,
              hasLogin:false
             })}/>
            */