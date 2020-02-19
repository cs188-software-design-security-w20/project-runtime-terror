import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom'
import { Grid, GridRow, Image, Button, Segment, Tab, GridColumn, Label, Modal, Form } from 'semantic-ui-react'
import { addFriend, removeFriend, acceptFriend } from '../../store/actions/authActions'
import CreatePost from '../createPost';
import PostList from '../feed/postList'
import FriendList from './friendList'
import UploadPicture from './modalUploadPicture';
import { updateProfile } from '../../store/actions/authActions'

export class Profile extends Component {

  state = {
    posts_content: null,
    friends_content: null,
    navigate: null,
    open: false,
    name: '',
    privacy: null,
    profile: null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let data = {}
    if ((prevState.profile === null || prevState.profile.isLoading) && nextProps.profile) {
      if (nextProps.profile.privacy !== undefined) {
        Object.assign(data,
          {
            privacy: nextProps.profile.privacy,
            profile: nextProps.profile
          }
        )
      }

      if (nextProps.profile.name !== undefined) {
        Object.assign(data,
          {
            name: nextProps.profile.name
          }
        )
      }
    }
    return data
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

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    this.handleSubmitPrivacy(e, this.state.privacy)
  }

  handleSubmitPrivacy = (e, privacy) => {
    e.preventDefault()
    this.props.updateProfile(this.props.auth.uid, {name: this.state.name, privacy: privacy, profile: this.state.profile})
    this.props.history.push('/profile/' + this.props.auth.uid)
    this.setState({open: false})
  }

  togglePrivacy = (e) => {
    let new_privacy = (this.state.privacy === 'private') ? 'public' : 'private'
    this.setState({
      privacy: new_privacy
    })
    this.handleSubmitPrivacy(e, new_privacy)
  }

  render() {
    const { auth, users, profile, match, curProfilePosts, currentFriendsList} = this.props;
    const curProfileUser = users && auth ? users.filter(user => user.id === match.params.id)[0] : null
    const imageUrl = curProfileUser ? curProfileUser.imageUrl : null
    
    const isUser = auth.uid && match.params && auth.uid === match.params.id;

    var friendButton = match && auth ? <Button onClick={() => {this.props.addFriend(match.params.id, auth.uid)}}>Add Friend</Button> : null
    if (auth && curProfileUser && curProfileUser.friends_pending && curProfileUser.friends_pending.includes(auth.uid))
      friendButton = <Button>Friend Request Sent</Button>
    else if (auth && curProfileUser && curProfileUser.friends.includes(auth.uid) && match)
      friendButton = <Button onClick={() => {this.props.removeFriend(match.params.id, auth.uid)}}>Remove Friend</Button>
    else if (profile && profile.friends_pending && auth && match && profile.friends_pending.includes(match.params.id))
      friendButton = <Button onClick={() => {this.props.acceptFriend(match.params.id, auth.uid)}}>Accept Friend Request</Button>
    
      
    this.state.posts_content = <div> <PostList posts={curProfilePosts} users={users} /> </div>
    this.state.friends_content = curProfileUser ? 
          ((currentFriendsList && match && match.params && match.params.id && currentFriendsList.includes(match.params.id)) 
            || (auth && match && match.params && match.params.id && auth["uid"] === match.params.id) ? 
            <div> <FriendList users={users} friends={curProfileUser.friends} /> </div> :
            <div> <FriendList users={users} friends={[]} /> </div>)
             : null

    if (this.state.navigate === '/createpost') {
      return (
        <div><Redirect to={this.state.navigate}/><CreatePost/></div>
      )
    }

    
    return (
      <div>
        <Grid centered padded='vertically'>
          <GridRow>
            <Segment>
              { isUser ?
                <UploadPicture uId={auth.uid} previousImageUrl={imageUrl} /> :
                <Image src={imageUrl} size='medium' circular bordered/>
              }
              <br/>
              <Button as='div' labelPosition='left'>
                <Label basic>
                  {curProfileUser ? curProfileUser.name : null }
                </Label>
                { isUser ?
                <Modal
                  trigger={<Button compact icon='edit'/>}
                  open={this.state.open}
                  onOpen={() => this.setState({open: true})}
                  closeOnDimmerClick={false}
                  closeOnDocumentClick={false}
                  size='small'
                  >
                    <Modal.Content>
                      <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                          <label>New Name</label>
                          <Form.Input id='name' onChange={this.handleChange} placeholder={curProfileUser ? curProfileUser.name : ''}/>
                        </Form.Field>
                        <Button type='submit' color='green'>Change name</Button>
                        <Button floated='right' color='red'  onClick={() => this.setState({open: false})}>Cancel</Button>
                      </Form>
                    </Modal.Content>
                  </Modal>
                : null
                }
              </Button>

              { isUser ?  // If the current profile is logged in user's profile
                <div>
                  <Grid>
                    <Grid.Column floated='left'>
                      <Button onClick={this.togglePrivacy} basic size='small' color={(this.state.privacy === 'private') ? 'red' : 'green'}>{(this.state.privacy === 'private') ? 'Private' : 'Public'}</Button>
                    </Grid.Column>
                    <Grid.Column floated='right'>
                      <Button floated='right' icon='plus' onClick={() => {this.navigate('/createpost')}}/>
                    </Grid.Column>
                  </Grid>
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
    //creates the friends list for the current user
    let currentFriendsList = ["0"]; //This is the dummy value
    for(let key in state.firestore.ordered.users)
    {
      if(state.firebase.auth["uid"] === state.firestore.ordered.users[key]["id"])
      {
        currentFriendsList = state.firestore.ordered.users[key]["friends"];
      }
    }
    
    //This creates the posts on the profile that we are looking at
    let curProfilePosts = [];
    if(state.firestore.ordered.curPrivatePosts != null && state.firestore.ordered.curPublicPosts != null){
      curProfilePosts = state.firestore.ordered.curPrivatePosts.concat(state.firestore.ordered.curPublicPosts).sort(function (a, b) {
        return b.createdAt["seconds"] - a.createdAt["seconds"];
    })
    }
    else if(state.firestore.ordered.curPublicPosts != null){
      curProfilePosts = state.firestore.ordered.publicPosts;
    }
    else if(state.firestore.ordered.curPrivatePosts != null){
      curProfilePosts = state.firestore.ordered.curPrivatePosts;
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
    acceptFriend: (friend_user_id, logged_in_user_id) => dispatch(acceptFriend(friend_user_id, logged_in_user_id)),
    updateProfile: (uId, newInfo) => dispatch(updateProfile(uId, newInfo))
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => [
    { collection: 'users' },
      { 
      collection: 'posts',
      storeAs: 'curPrivatePosts',
      where: [
        ['authorId', '==', props.match.params.id],
        [
        'privacy', '==', 
        //get the private posts if they are friends OR they are the current user
        //Otherwise we can only see their public posts
        props.currentFriendsList === null || (props.match.params.id !== props.auth["uid"] && !props.currentFriendsList.includes(props.match.params.id))?
        '0':'private'
        ],
      ],
     },
     { 
      collection: 'posts',
      storeAs: 'curPublicPosts',
      where: [
      //Alway just get the public posts, and we will add them together and sort them by their start time
        ['authorId', '==', props.match.params.id],
        ['privacy', '==','public'],
      ],
     },
      
  ])
)(Profile);
