import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom'
import { Grid, GridRow, Image, Button, Segment, Tab, GridColumn } from 'semantic-ui-react'
import { addFriend, removeFriend, acceptFriend } from '../../store/actions/authActions'
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
    const { auth, users, profile, match, curProfilePosts, currentFriendsList} = this.props;
    const curProfileUser = users && auth ? users.filter(user => user.id === match.params.id)[0] : null
    const imageUrl = curProfileUser ? curProfileUser.imageUrl : null
    
    

    var friendButton = match && auth ? <Button onClick={() => {this.props.addFriend(match.params.id, auth.uid)}}>Add Friend</Button> : null
    if (auth && curProfileUser && curProfileUser.friends_pending && curProfileUser.friends_pending.includes(auth.uid))
      friendButton = <Button>Friend Request Sent</Button>
    else if (auth && curProfileUser && curProfileUser.friends.includes(auth.uid) && match)
      friendButton = <Button onClick={() => {this.props.removeFriend(match.params.id, auth.uid)}}>Remove Friend</Button>
    else if (profile && profile.friends_pending && auth && match && profile.friends_pending.includes(match.params.id))
      friendButton = <Button onClick={() => {this.props.acceptFriend(match.params.id, auth.uid)}}>Accept Friend Request</Button>
    
      
    this.state.posts_content = <div> <PostList posts={curProfilePosts} users={users} /> </div>
    this.state.friends_content = curProfileUser ? 
          ((currentFriendsList && match && currentFriendsList.includes(match.params.id)) || (auth && match && auth["uid"] == match.params.id) ? 
            <div> <FriendList users={users} friends={curProfileUser.friends} /> </div> :
            <div> <FriendList users={users} friends={[]} /> </div>)
             : null
//props.match.params.id != props.auth["uid"] && ?
if(curProfileUser && curProfileUser.friends)
  console.log(curProfileUser.friends)

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
                  friendButton
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
    //creates the friends list for us to query
    var currentFriendsList = ["0"]; //This is the dummy value
    for(var key in state.firestore.ordered.users)
    {
      if(state.firebase.auth["uid"] === state.firestore.ordered.users[key]["id"])
      {
        currentFriendsList = state.firestore.ordered.users[key]["friends"];
      }
    }
    if(state.firestore.ordered.curPrivatePosts != null && state.firestore.ordered.curPublicPosts != null){
      var curProfilePosts = state.firestore.ordered.curPrivatePosts.concat(state.firestore.ordered.curPublicPosts).sort(function (a, b) {
        return b.createdAt["seconds"] - a.createdAt["seconds"];
    })
    }
    else if(state.firestore.ordered.curPublicPosts != null){
      var curProfilePosts = state.firestore.ordered.publicPosts;
    }
    else if(state.firestore.ordered.curPrivatePosts != null){
      var curProfilePosts = state.firestore.ordered.curPrivatePosts;
    }
    else{
      var curProfilePosts = [];
    }
  return {
    curProfilePosts: curProfilePosts,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    users: state.firestore.ordered.users,
    currentFriendsList: currentFriendsList
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    addFriend: (profile_user_id, logged_in_user_id) => dispatch(addFriend(profile_user_id, logged_in_user_id)),
    removeFriend: (profile_user_id, logged_in_user_id) => dispatch(removeFriend(profile_user_id, logged_in_user_id)),
    acceptFriend: (friend_user_id, logged_in_user_id) => dispatch(acceptFriend(friend_user_id, logged_in_user_id))
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => [
    //get the private posts if they are friends OR they are the current user
    { collection: 'users' },
      { 
      collection: 'posts',
      storeAs: 'curPrivatePosts',
      where: [
        ['authorId', '==', props.match.params.id],
        [
        'privacy', '==', 
        props.currentFriendsList == null || (props.match.params.id != props.auth["uid"] && !props.currentFriendsList.includes(props.match.params.id))?
        '0':'private'
        ],
      ],
     },
     { 
      collection: 'posts',
      storeAs: 'curPublicPosts',
      where: [
        ['authorId', '==', props.match.params.id],
        ['privacy', '==','public'],
      ],
     },
      
  ])
)(Profile);
