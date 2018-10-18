import React, { Component } from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import { Icon,message,Button,Rate } from 'antd';
import '../CSS/evalution.css';

class evalution extends Component {
    constructor(props){
        super(props);
        this.state={
            evaFrom:'',
            evaTo:'',
            //评价数据：
            pangdaiV:'',
            chuanqiuV:'',
            fangshouV:'',
            zuzhiV:'',
            tingqiuV:'',
            zhanweiV:'',
            shemenV:'',
            suduV:'',
            liliangV:'',
            menqianxiujueV:'',
            wuqiuV:'',
            haseva:false
        }
    }
    componentDidMount(){
        let evaTo=this.props.match.params.evato;
        let evaFrom=this.props.location.search.substr(1);
        this.setState({
            evaFrom:evaFrom,
            evaTo:evaTo
        })
    }
    submitRate(rateDate){
        axios.post('http://localhost:9093/user/saverate',rateDate)
        .then(res=>{
            if(res.status===200&&res.data.code===0) {
                console.log(res.data.data);
            }
            if(res.status===200&&res.data.code===1){
                console.log('已经评价过了',res.data.data);
                this.setState({haseva:true})
            };
            if(this.state.haseva){
                message.warning('你已经对他做过评价了');
            }
        })

    }
    render(){
        return(
            <div>
                <span  id='goback' 
                 onClick={()=>this.props.history.goBack()}>
                 <Icon type="left" theme="outlined"/>
                 返回
                 <span style={{margin:'1% 25% 1% 16%'}}>客观的评价好友{this.state.evaTo}的足球水平</span>
                 </span>
                <div id='eva-form'>
                    <h4 id='evato'><Icon type="user" theme="outlined" />{this.state.evaTo}</h4>
                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    盘带值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({pangdaiV:v})} value={this.state.pangdaiV} />
                        {this.state.pangdaiV && <span className="ant-rate-text">{this.state.pangdaiV} stars</span>}
                    </span>
                    </div>

                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    传球值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({chuanqiuV:v})} value={this.state.chuanqiuV} />
                        {this.state.chuanqiuV && <span className="ant-rate-text">{this.state.chuanqiuV} stars</span>}
                    </span>
                    </div>
                    
                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    防守值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({fangshouV:v})} value={this.state.fangshouV} />
                        {this.state.fangshouV && <span className="ant-rate-text">{this.state.fangshouV} stars</span>}
                    </span>
                    </div>
                    
                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    组织值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({zuzhiV:v})} value={this.state.zuzhiV} />
                        {this.state.zuzhiV && <span className="ant-rate-text">{this.state.zuzhiV} stars</span>}
                    </span>
                    </div>
                    
                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    停球值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({tingqiuV:v})} value={this.state.tingqiuV} />
                        {this.state.tingqiuV && <span className="ant-rate-text">{this.state.tingqiuV} stars</span>}
                    </span>
                    </div>
                     
                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    站位值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({zhanweiV:v})} value={this.state.zhanweiV} />
                        {this.state.zhanweiV && <span className="ant-rate-text">{this.state.zhanweiV} stars</span>}
                    </span>
                    </div>

                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    射门值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({shemenV:v})} value={this.state.shemenV} />
                        {this.state.shemenV && <span className="ant-rate-text">{this.state.shemenV} stars</span>}
                    </span>
                    </div>
                     
                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    速度值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({suduV:v})} value={this.state.suduV} />
                        {this.state.suduV && <span className="ant-rate-text">{this.state.suduV} stars</span>}
                    </span>
                    </div>

                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    力量值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({liliangV:v})} value={this.state.liliangV} />
                        {this.state.liliangV && <span className="ant-rate-text">{this.state.liliangV} stars</span>}
                    </span>
                    </div>
                     
                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    嗅觉值</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({menqianxiujueV:v})} value={this.state.menqianxiujueV} />
                        {this.state.menqianxiujueV && <span className="ant-rate-text">{this.state.menqianxiujueV} stars</span>}
                    </span>
                    </div>

                    <div>
                    <span className='ratename'>
                    <Icon type="tags" theme="outlined" />
                    无球跑</span>
                    <span className='stars'>
                       <Rate onChange={(v)=>this.setState({wuqiuV:v})} value={this.state.wuchuV} />
                        {this.state.wuqiuV && <span className="ant-rate-text">{this.state.wuqiuV} stars</span>}
                    </span>
                    </div>
                     
                </div>

                <Button
                type='primary'
                id='submit'
                onClick={()=>{
                    this.submitRate(this.state)
                }}
                >
                    提交评价
                </Button>

            </div>

        )
    }
}
export default evalution;