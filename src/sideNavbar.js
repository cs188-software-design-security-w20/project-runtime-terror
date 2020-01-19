import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Sidebar, Menu, Segment, Header, Image, Input} from 'semantic-ui-react'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { signOut } from './store/actions/authActions'

class SideNavbar extends Component {
    LOGIN = 'LOGIN'
    PROFILE = 'PROFILE'
    DISCOVER = 'DISCOVER'
    FEED = 'FEED'
    
    state = {
        redirect_target: null,
        targets: {
            LOGIN: '/login',
            PROFILE: ('/profile/' + this.props.auth.uid),
            DISCOVER: '/discover',
            FEED: '/feed'
        },
        visible: false
    }

    load = (target) => {
        this.setState({
            redirect_target: target,
            visible: false
        })
    }

    render() {
        const output = (
            <div>
                <Menu>
                    <Menu.Item icon='th list' onClick={() => {this.setState({visible: !this.state.visible})}}/>
                    <Menu.Item header>Project Runtime Terror</Menu.Item>
                </Menu>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar as={Menu} animation={'slide along'} direction={'left'} icon='labeled' inverted vertical visible={this.state.visible} width='thin'>
                        <Menu.Item onClick={() => {this.load(this.PROFILE)}} icon='user' name='Profile'/>,
                        <Menu.Item onClick={() => {this.load(this.DISCOVER)}} icon='map' name='Discover'/>,
                        <Menu.Item onClick={() => {this.load(this.FEED)}} icon='sitemap' name='Feed'/>,
                        <Menu.Item onClick={this.props.signOut} name='Sign out' icon='sign out' position='right'/>
                    </Sidebar>
                    <Sidebar.Pusher dimmed={this.state.visible}>
                        {this.props.content}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
        if (this.state.redirect_target != null) {
            console.log(this.state.redirect_target)
            let to_link = this.state.targets[this.state.redirect_target]
            console.log("redirecting... to " + to_link)
            return (<div><Redirect to={to_link}/>{output}</div>)
        }
        else {            
            return (
                <div>
                    {output}
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
      curUser: state.firestore.ordered.curUser,
      auth: state.firebase.auth,
      profile: state.firebase.profile
    }
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((props) => {
        if (!props.auth.uid) return []
            return [ 
            { collection: 'users', where: [ ['id', '==', props.auth.uid] ], storeaAs: 'curUser' }]
    })
)(SideNavbar)