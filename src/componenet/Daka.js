import React,{Component} from 'react';
import axios from 'axios';
import '../CSS/Daka.css';
import {Icon,Button,Drawer,message,Divider} from 'antd';
import echarts from 'echarts';
import io from 'socket.io-client';
import {withRouter} from'react-router-dom';

var CancelToken=axios.CancelToken;
var source=CancelToken.source();
const socket = io('ws://localhost:9093');
class Dakaa extends Component {
    constructor(props){
        super(props);
        this.state={
            user:'',
            year:0,
            mon:0,
            day:0,
            hour:0,
            min:0, 
            last_day:'',    
            rateData:[],
            isdrawers:false,
            friends:[],
            inviteFrom:[],
            trainTime:'',
            isshowStartorEnd:true
        }
    };
    getdate(){
        let that=this;
        return setInterval(()=>{
            var date= new Date();      
            let [min,hour,day,mon,year]=
            [date.getMinutes(),date.getHours(),date.getDay(),date.getMonth(),date.getFullYear()];
            that.setState({
                year:year,
                mon:mon,
                day:day,
                hour:hour,
                min:min,     
            })
        },
        1000)
    }
    componentWillMount(){
       
    }
    componentDidMount(){
        const user=this.props.user;
        this.setState({user:user});
        this.getdate();
       
        axios.post("http://localhost:9093/user/getmyrate",{user,CancelToken:source.token})
        .then(res=>{
            if(res.status===200&&res.data.code===0) {
                this.setState({rateData:res.data.data})
                console.log('返回评分：',this.state.rateData);
            }
        }).then(()=>{
            let pangdaiV=0,
            chuanqiuV=0,
            fangshouV=0,
            zuzhiV=0,
            tingqiuV=0,
            zhanweiV=0,
            shemenV=0,
            suduV=0,
            liliangV=0,
            menqianxiujueV=0,
            wuqiuV=0;

            let num_rate=this.state.rateData.length;

        this.state.rateData.forEach(rate=>{
            pangdaiV+=rate.pangdaiV;
            chuanqiuV+=rate.chuanqiuV;
            fangshouV+=rate.fangshouV;
            zuzhiV+=rate.zuzhiV;
            tingqiuV+=rate.tingqiuV;
            zhanweiV+=rate.zhanweiV;
            shemenV+=rate.shemenV;
            suduV+=rate.suduV;
            liliangV+=rate.liliangV;
            menqianxiujueV+=rate.menqianxiujueV;
            wuqiuV+=rate.wuqiuV;
            
        });
        var myChart = echarts.init(document.getElementById('myability-chart'));
        myChart.setOption({
            title: {
                text: '你的综合能力',
            },
            radar: {
                indicator : [
                    { text: '盘带', max: 5},
                    { text: '传球', max: 5},
                    { text: '防守', max: 5},
                    { text: '组织', max: 5},
                    { text: '停球', max: 5},
                    { text: '站位', max: 5},
                    { text: '射门', max: 5},
                    { text: '速度', max: 5},
                    { text: '力量', max: 5},
                    { text: '嗅觉', max: 5},
                    { text: '无球', max: 5},
                 ], 
                 center:['50%','50%'],
                 radius: '60%',
                  
             },
             series:{
                 name:'我的评价数据',
                 type:'radar',
                 symbol:'rect',
                 lineStyle: {
                    width: 1
                },
                 
                 data:[{
                     value:[
                         pangdaiV/num_rate,
                         chuanqiuV/num_rate,
                         fangshouV/num_rate,
                         zuzhiV/num_rate,
                         tingqiuV/num_rate,
                         zhanweiV/num_rate,
                         shemenV/num_rate,
                         suduV/num_rate,
                         liliangV/num_rate,
                         menqianxiujueV/num_rate,
                         wuqiuV/num_rate
                     ],
                     name:''
                 }]
                }
        });
        }
        );
        axios.post('http://localhost:9093/user/getmyfriends',{userName:user,CancelToken:source.token})//获取当前用户的好友
            .then(res=>{
                if(res.status===200&&res.data.code===0){
                    this.saveFriends(res.data.data)
                    console.log(res.data.data)
                    console.log('已经得到我的好友');
                }
            });
        socket.on('recInvite',data=>{
            const {inviteFrom,inviteTo}=data;
            if(inviteTo===user){
                let inviteFrom_arr=this.state.inviteFrom;
                inviteFrom_arr.push(inviteFrom);
                this.setState({
                    inviteFrom:inviteFrom_arr,
                });
            }
            console.log('接收到邀请：',this.state.inviteFrom)
        })
        axios.post('http://localhost:9093/user/getmyinvite',{inviteTo:user,CancelToken:source.token})
        .then(res=>{
            if(res.status===200&&res.data.code===0){
                let inviteFrom_arr=this.state.inviteFrom||[];
                res.data.data.forEach(one=>{
                    const {inviteFrom}=one;
                    inviteFrom_arr.push(inviteFrom);
                })
                this.setState({
                    inviteFrom:inviteFrom_arr,
                });
                console.log('axios请求邀请',this.state.inviteFrom)
            }
        });
        axios.post('http://localhost:9093/user/getmytraininfo',{user:this.props.user})
        .then(res=>{
            if(res.status===200&&res.data.code===0){
                console.log('获取训练数据：',res.data.data)
                this.setState({
                    mytrain:res.data.data
                })
                console.log('获取state训练数据：',this.state.mytrain.trainTime)
            }
            if(res.status===200&&res.data.code===1){
                console.log(res.data.data)
            }
        })
        console.log('月：',this.state.mon)
    }
    evaluate(evaTo,evaFrom){
        axios.post('http://localhost:9093/user/removeeva',{evaTo,CancelToken:source.token})
        .then(res=>{
            if(res.status===200&&res.data.code===0){
                console.log(res.data.data)
            }
        });
        this.props.history.push(`/eva/${evaTo}?${evaFrom}`)
        console.log('评价');
    }
    saveFriends(data){
        this.setState({friends:data});
        console.log('state好友',this.state.friends)
        this.setState({isGetFriends:true})
    }
    componentWillUnmount(){
        clearInterval(this.getdate);
        source.cancel('取消axios')
    }
    startTrain(){
        const startTime = this.state.year + ':' + this.state.mon+':' 
                        + this.state.day + ':' + this.state.hour
                        + ':' + this.state.min;
        if(startTime){
            this.setState({
                startTime
            })
        }
    }
    endTrain(){
        const user=this.props.user;
        console.log('训练者：',user)
        const endTime=this.state.year + ':' + this.state.mon+':' 
                      + this.state.day + ':' + this.state.hour
                      + ':' + this.state.min;
        if(this.state.startTime){
            const trainTime = (endTime.split(':')[3]-this.state.startTime.split(':')[3]) * 60 
            + (endTime.split(':')[4]-this.state.startTime.split(':')[4]);
                console.log('前端训练时间',trainTime)  
                axios.post('http://localhost:9093/user/savemytrain',{user:user,trainTime:trainTime,trainDay:this.state.startTime})
                .then(res=>{
                    if(res.status===200&&res.data.code===0){
                        console.log(res.data.data)
                    }
                })
                let addtrainTime;
                let addtrainDay;
                if(!this.state.mytrain){
                    addtrainTime=[trainTime];
                    addtrainDay=[this.state.startTime];  
                    console.log('shiy');
                    let mytrain={
                        trainTime:addtrainTime,
                        trainDay:addtrainDay
                    }
                    this.setState({
                        mytrain

                    })
                }else{
                    addtrainTime=this.state.mytrain.trainTime.push(trainTime);
                    addtrainDay=this.state.mytrain.trainDay.push(this.state.startTime); 
                    this.setState({
                        trainTime: addtrainTime,
                        trainDay:addtrainDay
                    })  
                }
        }
        
    }
    render(){
        return(
            <div>
                <div id='left'>
                 <p id='time-count'>
                     <Icon type="dashboard" theme="outlined" style={{color:'red'}}/>
                     {`${' '}`}
                     现在是
                     <span>
                        <span><span className='time-span'>{this.state.year}</span>年</span>
                        <span><span className='time-span'>{this.state.mon}</span>月</span>
                        <span><span className='time-span'>{this.state.day}</span>日</span>
                        <span><span className='time-span'>{this.state.hour}</span>时</span>
                        <span><span className='time-span'>{this.state.min}</span>分</span>
                     </span>
                 </p>
                 <p id='remind-last'>
                 <Icon type="tag" theme="outlined" style={{color:'blue'}}/>
                 {`${' '}`}
                 距离你上一次踢球：
                    <span>
                       <span>{this.state.day-this.state.last_day}天</span>
                    </span>
                 </p>
                 <h4 id='Daka-title'>将好友的评价数据{`${'  '}`}可视化</h4> 
                <div id='myability-chart' style={{width:'100%',height:'254px',margin:'0'}}>

                    {/*
                    使用Echarts库展示个人受好友评价的数据
                    评价的各个方面按个人司职不同而不同 前锋/门将/后卫/中场 都有不同的评价方法
                    在这个div里展示当前用户的不同能力的雷达图
                    */}

                </div>
                <div>有{this.state.rateData.length}位好友对你做了评价</div>
                <div>他们是:
                {this.state.rateData.map(rate=>
                    <li key={rate.evaFrom} id='evaFrom'>{rate.evaFrom}</li>)}
                </div>
                <Divider style={{margin:'1%'}}/>
                 <span>评价的好友人数越多，你的数据越可靠</span>
                 <div>
                     <Button type='primary'
                     style={{padding:'1% 33% 1% 33%'}}
                     onClick={
                         ()=>this.setState({isdrawershow:true})
                     }>
                     邀请好友评价
                     </Button>

                     <div id='inviteMsg'>
                       {this.state.inviteFrom}
                       {
                           this.state.inviteFrom.map(i=>
                            
                       <li key={i}>
                       <Divider/>
                       <p>
                       来自{i}的邀请，为他做评价吧
                       <Button
                       style={{marginLeft:'13%'}}
                       onClick={()=>{
                        this.evaluate(i,this.props.user)
                       }}>
                           现在去评价
                       </Button>
                       </p>
                       <Divider/>
                       </li>
                       )
                           }
                            
                     </div>
                     <Drawer
                       title="我的好友列表"
                       placement="right"
                       closable={false}
                       onClose={()=>this.setState({isdrawershow:false})}
                       visible={this.state.isdrawershow}
                     >
                        {this.state.friends.filter(
                            f=>
                            !this.state.rateData.some(rate=>
                                rate.evaFrom===f
                                )
                        ).map(friend=>
                        <p key={friend}
                        className='friendli'
                        onClick={
                            ()=>{
                              
                             message.warning('已邀请');
                             socket.emit('sendInvite',{inviteFrom:this.props.user,inviteTo:friend})
                            }
                        }
                        >邀请{friend}
                        </p>
                        )
                        }
                        {
                            this.state.friends.filter(
                                f=>
                                !this.state.rateData.some(rate=>
                                    rate.evaFrom===f
                                    )
                            ).length===0?
                        <div>
                            所有好友均做过评价
                            <p>如果想获取更多人的评价，请加其他好友</p>
                        </div>

                        :null
                        }
                    </Drawer>         
                </div>
                </div>
                <div id='right' style={{padding:'0'}}>
                <p   style={{textAlign:'center',marginLeft:'10%'}}>踢球格子</p>
                <div style={{padding:'2%'}}>
                 { this.state.isshowStartorEnd?
                   <Button type='ghost'
                   className='button-'
                   onClick={()=>{
                       this.startTrain();
                       this.setState({
                           isshowStartorEnd:false
                       })
                   }
                   }>
                  开始踢球
                   </Button>
                   :
                   <Button type='ghost'
                   className='button-'
                   onClick={()=>{
                       this.endTrain();
                       this.setState({
                           isshowStartorEnd:true
                       })
                   }
                   }>
                  结束踢球
                   </Button>
                 }
               </div>
               <div id='ballbox'>
              
                {/*
                  在这里把你每一天的踢球记录用表格的形式展示，其中每一个格子代表一天，格子里颜色的深度表示这一天踢球时间的长短，
                  格子里还要包含这一天的号数（11月20号），踢球时间（2小时），每一个格子应该按系统时间自动增加，即使用户在这一天不踢球，也应该
                  记录为0，用于表格占位
                */}
                <div>
                    
                    {   
                        this.state.mytrain?
                        this.state.mytrain.trainDay.map((day,index)=>
                            <div key={index} className='day-box' 
                            style={{backgroundColor:`rgba(76,132,${this.state.mytrain.trainTime[index]*0.8+200})`}}>
                                <div className='day-time'>{this.state.mytrain.trainTime[index]}分钟</div>
                                <div className='day-num'>{
                                    `${day.split(':')[1]}月${day.split(':')[2]}日`
                                    }</div>
                            </div>
                        )
                        :null
                    }
                </div>
                </div>
                </div>
            </div>
        )
    }
}
let Daka=withRouter(Dakaa);
export default Daka;