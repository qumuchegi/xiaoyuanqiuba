import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import '../CSS/Register.css';

import { Icon, Form, Input, Button ,Alert} from 'antd';
 
const FormItem = Form.Item;
class Register extends Component {
    constructor(props){
        super(props);
        this.state={
             
                userName:'',
                userPassword:'',
                userXueyuan:'',
                userZhuanye:'',
                userAihao:'',
             
             warnVisibility_passw:true,
             isNameTrue:true,
             hasRegister:false
            
    }
   
    this.IsNameTrue=this.IsNameTrue.bind(this);
    //this.HasRegister=this.HasRegister.bind(this);
}
    HasRegister(){
        this.setState({hasRegister:true})
    }
    IsNameTrue(){
        this.setState({isNameTrue:false})
    }
    handleSubmit(){
        if(this.state.userName===''){
            alert('请输入信息！！！')
        }else{
            axios.post('http://localhost:9093/user/userregister',this.state)
             .then(function (res) {
                if(res.status===200&&res.data.code===1)   alert('已有用户名注册该名');//this.IsNameTrue(); 
                if(res.status===200&&res.data.code===0)   alert('注册成功！！')//this.HasRegister();
              }  
        )
    }
        console.log(this.state);
    }
    render(){
        return(
            <div>
            <Link to='/' ><Icon type="left" theme="outlined" style={{'marginTop':'2%'}}/>返回</Link>
            <h1>注册<Icon type="edit" theme="outlined" /></h1>
            <Form>
              <FormItem>
               <Input placeholder='用户名' onChange={e=>this.setState({userName:e.target.value})}/>
               {!this.state.isNameTrue?
             <Alert
             message=""
             description="用户名已经被注册过！"
             type="warning"
             showIcon
          />:null
             }
             </FormItem>
             <FormItem>
               <Input type="password" placeholder='密码' onChange={e=>this.setState({userPassword:e.target.value})}/> 
             </FormItem>
             <FormItem>
              <Input type="password" placeholder='确认密码' onBlur={e=>this.state.userPassword===e.target.value?
              this.setState({warnVisibility_passw:true}):this.setState({warnVisibility_passw:false})}
              />
             {!this.state.warnVisibility_passw?
             <Alert
             message=""
             description=" 密码前后不一致"
             type="warning"
             showIcon
          />:null
             }
             </FormItem>
             <FormItem>
              <Input  placeholder='学院' onChange={e=>this.setState({userXueyuan:e.target.value})}/>
             </FormItem>
             <FormItem>
              <Input   placeholder='专业' onChange={e=>this.setState({userZhuanye:e.target.value})} />
             </FormItem>
             <FormItem>
              <Input   placeholder='爱好' onChange={e=>this.setState({userAihao:e.target.value})}/>
             </FormItem>
             <Button type="primary" size='large' className='zhuceButton' onClick={()=>this.handleSubmit()}>
                   注册
             </Button>
             
        </Form>
        {this.state.hasRegister?
             <Alert
             message=""
             description="注册成功！"
             type="success"
             showIcon
          />:null
             }
            </div>
            
        )
    }

}
export default Register;