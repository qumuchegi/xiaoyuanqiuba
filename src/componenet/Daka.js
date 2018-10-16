import React,{Component} from 'react';
import '../CSS/Daka.css';
import {Icon,Calendar} from 'antd';

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
        

        
         


    }
    componentWillUnmount(){
        clearInterval(this.getdate)
    }

    render(){
        return(
            <div>
                <div id='left'>
                 <h4 id='Daka-title'>用大数据记录你与足球为伴的生活</h4> 
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
                  
                </div>
                <div id='right'>
                
                </div>
            </div>
        )
    }
}

export default Daka;