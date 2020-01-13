import React, { Component } from 'react';
import { Redirect, Switch, Route, BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Home from './components/home'
import Navbar from './components/layout/navbar'
import Discover from './components/discover/discover'
import Login from './components/layout/login/login'
import Feed from './components/feed/feed'
import Profile from './components/profile/profile'


class App extends Component {

  render() {

    const { auth } = this.props
    // const showLogin = (auth.isLoaded && auth.uid) ? <Navbar/> : <Redirect to='/login'/>
    const showLogin = <Navbar/>
    
    return (
      <BrowserRouter>
        <div className="App">
          { showLogin }

          <Switch>
            <Route exact path='/'       component={Home} />
            <Route path='/discover'     component={Discover} />
            <Route path='/login'        component={Login} />
            <Route path='/feed'         component={Feed} />
            <Route path='/profile'      component={Profile} />
          </Switch>

        </div>
      </BrowserRouter>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}


export default connect(mapStateToProps)(App);