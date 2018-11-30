import React,{Component} from 'react';
import axios from 'axios';
import '../CSS/Myteam.css';

class Myteam extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
       const user=this.props.user;
       let teamCanvas=document.getElementById('myteam-show');
       let teamContext=teamCanvas.getContext('2d');
       teamContext.fillStyle='rgb(115,231,124)';
       teamContext.fillRect(0,0,249,330);
       
    }

    render(){

        return(
            <div>
                <div id='players'>
                {/*
                在这里把队里的全部队员列出来，
                并且可以被拖拽到画布上任何位置
                  */}
                {/*
                 点击在这里的按钮，出现抽屉，队长（当前的用户）可以邀请抽屉里面的好友入队
                 如果不是队长则没有这项功能
                */}
                </div>
                <canvas id='myteam-show' width='250' height='331'>
                
                </canvas>
            </div>
        )
    }
}

export default Myteam;