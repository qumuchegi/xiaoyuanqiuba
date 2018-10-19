import React,{Component} from 'react';
import axios from 'axios';
import '../CSS/Daka.css';
import {Icon,Button,Drawer,message} from 'antd';
import echarts from 'echarts';

class Daka extends Component {
    constructor(props){
        super(props);
        this.state={
            user:'',
            year:'',
            mon:'',
            day:'',
            hour:'',
            min:'', 
            last_day:'',    
            rateData:[],
            isdrawers:false,
            friends:[]
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
    componentDidMount(){
        const user=this.props.user;
        this.setState({user:user});
        this.getdate();
        axios.post("http://localhost:9093/user/getmyrate",{user})
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
        console.log('平均值：', pangdaiV/num_rate)
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
        axios.post('http://localhost:9093/user/getmyfriends',{userName:user})//获取当前用户的好友
            .then(res=>{
                if(res.status===200&&res.data.code===0){
                    this.saveFriends(res.data.data)
                    console.log(res.data.data)
                    console.log('已经得到我的好友');
                    
                }
                
            })
    }
    saveFriends(data){
        this.setState({friends:data});
        console.log('state好友',this.state.friends)
        this.setState({isGetFriends:true})
    }
    componentWillUnmount(){
        clearInterval(this.getdate)
    }
    render(){
        return(
            <div>
                <div id='left'>
                 <h4 id='Daka-title'>将好友的评价数据可视化</h4> 
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
                <div id='myability-chart' style={{width:'100%',height:'254px',margin:'0'}}>

                    {/*
                    使用Echarts库展示个人受好友评价的数据
                    评价的各个方面按个人司职不同而不同 前锋/门将/后卫/中场 都有不同的评价方法
                    在这个div里展示当前用户的不同能力的雷达图
                    */}

                </div>
                </div>
                <div id='right'>
                <div>有{this.state.rateData.length}位好友对你做了评价</div>
                <div>他们是:
                {this.state.rateData.map(rate=>
                    <li key={rate.evaFrom} id='evaFrom'>{rate.evaFrom}</li>)}
                </div>
                 <span>评价的好友人数越多，你的数据更可靠</span>
                 <div>
                     <Button type='danger'
                     onClick={
                         ()=>this.setState({isdrawershow:true})
                     }>
                     邀请好友评价
                     </Button>
                     <Drawer
                       title="我的好友列表"
                       placement="left"
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
                             message.warning('已邀请')
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
                        <p>
                            所有好友均做过评价
                            <p>如果想获取更多人的评价，请加其他好友</p>
                        </p>

                        :null
                        }
                    </Drawer>         
                </div>
                </div>
            </div>
        )
    }
}

export default Daka;