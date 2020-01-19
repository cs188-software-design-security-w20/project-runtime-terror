import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Sidebar, Menu, Segment, Header, Image, Input} from 'semantic-ui-react'

class SideNavbar extends Component {
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
        },
        visible: false
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
                            <Menu.Item onClick={this.sign_out} name='Sign out' icon='sign out' position='right'/>
                        </Sidebar>
                        <Sidebar.Pusher dimmed={this.state.visible}>
                            {this.props.content}
                        </Sidebar.Pusher>
                    </Sidebar.Pushable>
                </div>
            )
        }
    }

    sign_out = () => {
        // TODO: Steps to sign out from firebase
        this.load(this.LOGIN)
    }
}

export default SideNavbar;