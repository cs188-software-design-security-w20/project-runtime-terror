import React, {Component} from 'react'
import {Menu, Input} from 'semantic-ui-react'
import {Redirect} from 'react-router-dom'

class Navbar extends Component {
    LOGIN = 'LOGIN'
    PROFILE = 'PROFILE'
    DISCOVER = 'DISCOVER'
    FEED = 'FEED'
    
    state = {
        redirect_target: null,
        targets: {
            LOGIN: '/login',
            PROFILE: '/profile',
            DISCOVER: '/discover',
            FEED: '/feed'
        }
    }


    load = (target) => {
        this.setState({
            redirect_target: target
        })
    }

    render() {
        if (this.state.redirect_target != null) {
            console.log(this.state.redirect_target)
            let to_link = this.state.targets[this.state.redirect_target]
            console.log("redirecting... to " + to_link)
            return (<Redirect to={to_link}/>)
        }
        else {
            return (
                <Menu inverted>
                    <Menu.Item onClick={() => {this.load(this.PROFILE)}} icon='user'/>
                    <Menu.Item onClick={() => {this.load(this.DISCOVER)}} name='Discover'/>
                    <Menu.Item onClick={() => {this.load(this.FEED)}} name='Feed'/>
                    <Menu.Item onClick={() => {this.load(this.PROFILE)}}>
                        <Input icon='search' placeholder='Search for...'/>
                    </Menu.Item>
                    <Menu.Item onClick={this.sign_out} name='Sign out' position='right'/>
                </Menu>
            )
        }
    }

    sign_out = () => {
        // TODO: Steps to sign out from firebase
        this.load(this.LOGIN)
    }
}

export default Navbar;