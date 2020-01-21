import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom'
import { Grid, GridRow, Image, Button, Segment, Tab, GridColumn } from 'semantic-ui-react'
import { addFriend } from '../../store/actions/authActions'
import EditProfile from './editProfile';
import CreatePost from '../createPost';
import PostList from '../feed/postList'
import FriendList from './friendList'


export class Profile extends Component {
  state = {
    posts_content: null,
    friends_content: null,
    navigate: null
  }


  profile_panes = [
    {
      menuItem: 'Posts',
      render: () => <Tab.Pane>{this.state.posts_content}</Tab.Pane>
    },
    {
      menuItem: 'Friends',
      render: () => <Tab.Pane>{this.state.friends_content}</Tab.Pane>
    }
  ]

  navigate = (destination) => {
    this.setState({
      navigate: destination
    })
  }

  render() {

    const { auth, users, match, curProfilePosts } = this.props;
    const curProfileUser = users && auth ? users.filter(user => user.id === match.params.id)[0] : null
    const imageUrl = curProfileUser ? curProfileUser.imageUrl : null
    
    this.state.posts_content = <div> <PostList posts={curProfilePosts} users={users} /> </div>
    this.state.friends_content = curProfileUser ? <div> <FriendList users={users} friends={curProfileUser.friends} /> </div> : null


    if (this.state.navigate === '/editprofile') {
      return (
        <div><Redirect to={this.state.navigate}/><EditProfile/></div>
      )
    }
    else if (this.state.navigate === '/createpost') {
      return (
        <div><Redirect to={this.state.navigate}/><CreatePost/></div>
      )
    }

    return (
      <div>
        <Grid centered padded='vertically'>
          <GridRow>
            <Segment>
              <a href={imageUrl} ><Image src={imageUrl} size='medium' circular /> </a>
              <p className="profile-name">{ curProfileUser ? curProfileUser.name : null }</p>

              { auth.uid && match.params && auth.uid === match.params.id ?  // If the current profile is logged in user's profile
                <div>
                  <Button floated='left' onClick={() => {this.navigate('/editprofile')}}>Edit profile</Button>
                  <Button floated='right' icon='plus' onClick={() => {this.navigate('/createpost')}}/>
                </div> :
                  <Button onClick={() => {this.props.addFriend(match.params.id, auth.uid)}}>Add Friend</Button>
              }
            </Segment>
          </GridRow>
          <GridRow> <GridColumn width={16}> <Tab panes={this.profile_panes}/> </GridColumn> </GridRow>
        </Grid>
      </div>
    )
  }

  componentDidUpdate() {
    if (this.state.navigate != null)
      this.navigate(null)
  }
}


const mapStateToProps = (state) => {
  return {
    curProfilePosts: state.firestore.ordered.curProfilePosts,
    auth: state.firebase.auth,
    users: state.firestore.ordered.users
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    addFriend: (profile_user_id, logged_in_user_id) => dispatch(addFriend(profile_user_id, logged_in_user_id))
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => [
      { collection: 'posts', where: [ ['authorId', '==', props.match.params.id] ], storeAs: 'curProfilePosts'},
      { collection: 'users' }
  ])
)(Profile);
