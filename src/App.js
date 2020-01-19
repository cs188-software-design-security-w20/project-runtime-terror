import React, { Component } from 'react';
import { Redirect, Switch, Route, BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Home from './components/home'
import Navbar from './components/layout/navbar'
import Discover from './components/discover/discover'
import Login from './components/layout/login/login'
import Feed from './components/feed/feed'
import Profile from './components/profile/profile'
import CreatePost from './components/createPost'
import EditProfile from './components/profile/editProfile'
import NotFound from './components/404'


class App extends Component {

  state = { isLoading: true }

  // Ensures the no other componenet loads before the Navbar
  // TODO: UNSAFE! Find alternative 
  componentWillReceiveProps() {
    this.setState({isLoading: false})
  }

  render() {

    const { auth } = this.props
    const showLogin = (auth.isLoaded && auth.uid) ? <Navbar/> : <Redirect to='/login'/>
    
    return (
      this.state.isLoading ? <h1>Loading...</h1> :
      <BrowserRouter>
        <div className="App">
          { showLogin }

          <Switch>
            <Route exact path='/'       component={Home} />
            <Route path='/discover'     component={Discover} />
            <Route path='/login'        component={Login} />
            <Route path='/feed'         component={Feed} />
            <Route path='/profile/:id'  component={Profile} />
            <Route path='/createpost'   component={CreatePost} />
            <Route path='/editprofile'  component={EditProfile} />
            <Route                      component={NotFound} />
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