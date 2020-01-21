import React, { Component } from 'react';
import { Redirect, Switch, Route, BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react';
import Home from './components/home'
import Discover from './components/discover/discover'
import Login from './components/layout/login/login'
import Feed from './components/feed/feed'
import Profile from './components/profile/profile'
import SideNavbar from './components/layout/sideNavbar';
import CreatePost from './components/createPost'
import EditProfile from './components/profile/editProfile'
import NotFound from './components/404'

class App extends Component {

  state = { isLoading: true }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps.auth)
    if (nextProps.auth.isLoaded && (nextProps.auth.isEmpty || nextProps.auth.uid)) {
      return { isLoading: false }
    }
    else {
      return null
    }
  }

  render() {

    const { auth } = this.props
    const content = (
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
    )

    // Redirect forces user to load at Home page if logging in
    const showLogin = (auth.isLoaded && auth.uid) ? 
      <SideNavbar content={content}/> : 
      <div><Redirect to='/'/><Menu><Menu.Item header>Runtime Terror</Menu.Item></Menu><Login/></div>

    return (
      this.state.isLoading ? <h1>Loading...</h1> :
      <BrowserRouter>
          { showLogin }
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