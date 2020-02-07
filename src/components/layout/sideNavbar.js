import React, {Component} from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { Sidebar, Menu, Segment, Label } from 'semantic-ui-react'
import { signOut } from '../../store/actions/authActions'


class SideNavbar extends Component {
    LOGIN = 'LOGIN'
    PROFILE = 'PROFILE'
    DISCOVER = 'DISCOVER'
    FEED = 'FEED'
    REQUESTS = 'REQUESTS'
    
    state = {
        redirect_target: null,
        targets: {
            FEED: '/',
            LOGIN: '/login',
            PROFILE: ('/profile/' + this.props.auth.uid),
            DISCOVER: '/discover/' + '',
            REQUESTS: '/requests'
        },
        visible: false,
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.profile.isLoaded && ('/discover/' + nextProps.profile.spotify_token) !== prevState.targets.DISCOVER)
            return {targets: {DISCOVER: '/discover/' + nextProps.profile.spotify_token}}
    }
    
    load = (target) => {
        this.setState({
            redirect_target: target,
            visible: false
        })
    }

    render() {
        const { profile } = this.props;
        let image = profile ? <img src={profile.imageUrl} alt=""/> : null
        let requests_num = profile && profile.friends_pending ? profile.friends_pending.length : 0
        const requests = (requests_num > 0) ? 
            <Menu.Item onClick={() => {this.load(this.REQUESTS)}}>Friend Requests:
                <Label color='teal'>{requests_num} </Label>
            </Menu.Item> : null

        const output = (
            <div className='fullsize_div' id='sidebar_2'>
                <Menu fixed='top'>
                    <Menu.Item icon='th list' onClick={() => {this.setState({visible: !this.state.visible})}}/>
                    <Menu.Item header onClick={() => {this.load(this.FEED)}}>Runtime Terror</Menu.Item>
                    <Menu.Item onClick={() => {this.load(this.PROFILE)}}>{image}</Menu.Item>
                    {requests}
                </Menu>
                <div id='sidebar'>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar as={Menu} animation={'slide along'} direction={'left'} icon='labeled' inverted vertical visible={this.state.visible} width='thin'>
                        <Menu.Item onClick={() => {this.load(this.PROFILE)}} name='Profile'>{image}Profile</Menu.Item>,
                        <Menu.Item onClick={() => {this.load(this.DISCOVER)}} icon='map' name='Discover'/>,
                        <Menu.Item onClick={() => {this.load(this.FEED)}} icon='sitemap' name='Feed'/>,
                        <Menu.Item onClick={this.props.signOut} name='Sign out' icon='sign out' position='right'/>
                    </Sidebar>
                    <Sidebar.Pusher dimmed={this.state.visible}>
                            {this.props.content}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
                </div>
            </div>
        )

        if (this.state.redirect_target != null) {
            let to_link = this.state.targets[this.state.redirect_target]
            return (<div className='fullsize_div'><Redirect to={to_link}/>{output}</div>)
        }
        else {            
            return output
        }
    }

    // Clear redirect_target after render
    componentDidUpdate() {
        if (this.state.redirect_target != null) {
            this.setState({
                redirect_target: null
            })
        }
    }
}


const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}
  

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SideNavbar)