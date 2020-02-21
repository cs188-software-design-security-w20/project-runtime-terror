import React, { Component } from 'react';
import { Redirect, Switch, Route, BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Loader } from 'semantic-ui-react';
import Discover from './components/discover/discover'
import TokenHandler from './components/discover/tokenHandler'
import Login from './components/layout/login/login'
import Feed from './components/feed/feed'
import Profile from './components/profile/profile'
import PendingList from './components/profile/pendingList'
import SideNavbar from './components/layout/sideNavbar';
import CreatePost from './components/createPost'
import NotFound from './components/404'


class App extends Component {

  state = { isLoading: true }

  static getDerivedStateFromProps(nextProps, prevState) {
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
        <Route exact path='/'           component={Feed} />
        <Route path='/login'            component={Login} />
        <Route path='/discover'         component={Discover} />
        <Route path='/tokenHandler'     component={TokenHandler} />
        <Route path='/profile/:id'      component={Profile} />
        <Route path='/createpost'       component={CreatePost} />
        <Route path='/requests'         component={PendingList} />
        <Route                          component={NotFound} />
      </Switch>
    )

    // Redirect forces user to load at Discover page if already logged in
    const showLogin = (auth.isLoaded && auth.uid) ? 
      <SideNavbar content={content}/> : 
      <div><Redirect to='/'/><Menu><Menu.Item header>Runtime Terror</Menu.Item></Menu><Login/></div>

    return (
      this.state.isLoading ? <div className='fullsize_div'> <Loader active size='massive'>Loading</Loader> </div>:
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