import React, { Component } from 'react';
import { Tabs, Icon } from 'antd';
import Wudaliansai from './Wudaliansai';
import Login from './Login';
import '../CSS/Dashboard.css'

class Dashboard extends Component {
   
    render(){
        const TabPane = Tabs.TabPane;
        return(
            <Tabs defaultActiveKey="3" className='topBar'>
             <TabPane tab={<span><Icon type="compass" theme="outlined" />五大联赛</span>} key="1">
              <Wudaliansai/>
             </TabPane>
             <TabPane tab={<span><Icon type="bank" theme="outlined" />校园足球</span>} key="2">
              Tab 2
             </TabPane>
             <TabPane tab={<span><Icon type="user" theme="outlined" />我的</span>} key="3">
               <Login/>
             </TabPane>
            </Tabs>
        )
    }

}
export default Dashboard;