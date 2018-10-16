import { Carousel } from 'antd';
import React,{Component} from 'react';


class Wudaliansai extends Component {
    render(){
        return(
            <Carousel autoplay>
              <div><img src={require('../img/xijia.png')} width="100%" alt=''/></div>
              <div><img src={require('../img/dejia.png')} width="100%" alt=''/> </div>
              <div><img src={require('../img/yijia.png')} width="100%" alt=''/> </div>
              <div><img src={require('../img/fajia.png')} width="100%" alt=''/> </div>
              <div><img src={require('../img/yingchao.png')} width="100%" alt=''/> </div>
            </Carousel>)
 
        
    }
}

export default Wudaliansai;