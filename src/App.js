import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';
import Register from './componenet/Register';
import Dashboard from './componenet/Dashboard';
import Chat from './componenet/Chat';
 

//import './App.css';

  class App extends Component {

    render() {
      return (
        <div className="App">
          <Switch>
           <Route exact path='/' component={Dashboard}></Route>
           <Route path='/register' component={Register}></Route>
           <Route path='/chat/:chatto'  component={Chat}></Route>
          
          </Switch>
        </div>
      );
    }
  }

  export default App;
    