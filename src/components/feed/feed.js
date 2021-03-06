import React, { Component } from 'react'
import { Tab, Divider } from 'semantic-ui-react'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import PostList from './postList'

export class Feed extends Component {
  state = {
    friendsPosts: null,
    explorePosts: null,
    users: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newPosts = {}
    if (nextProps.explorePosts !== prevState.explorePosts) {
      Object.assign(newPosts, {explorePosts: nextProps.explorePosts})
    }
    if (nextProps.friendsPosts !== undefined && nextProps.friendsPosts !== prevState.friendsPosts) {
      Object.assign(newPosts, {friendsPosts: nextProps.friendsPosts})
    }
    if (nextProps.users !== undefined && nextProps.users !== prevState.users) {
      Object.assign(newPosts, {users: nextProps.users})
    }
    return (newPosts.length !== 0) ? newPosts : null;
  }

  render() {
    let feedPanes = [
      { menuItem: 'Friends', render: () => <Tab.Pane><PostList posts={this.state.friendsPosts} users={this.state.users}/></Tab.Pane> },
      { menuItem: 'Explore', render: () => <Tab.Pane><PostList posts={this.state.explorePosts} users={this.state.users}/></Tab.Pane> },
    ]
  
    return (
      <div>
        <Divider hidden />
        <Tab panes={feedPanes}/> 
      </div>
    )
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

  //sort friendsPosts, because the sortBy doesn't work
  if(state.firestore.ordered.friendsPosts != null){
  var sortedFriendsArray = state.firestore.ordered.friendsPosts.sort(function (a, b) {
    return b.createdAt["seconds"] - a.createdAt["seconds"];
  })
  }

  //This is if we wanted to allow personal private posts to be shown on explore page
  //find a way to combine publicPosts and privatePersonalPosts for the explore page 
  // if(state.firestore.ordered.publicPosts != null && state.firestore.ordered.privatePersonalPosts != null){
  // var sortedExploreArray = state.firestore.ordered.publicPosts.concat(state.firestore.ordered.privatePersonalPosts)
  //                                                   .sort(function (a, b) {
  //   return b.createdAt["seconds"] - a.createdAt["seconds"];
  // })
  // }
  if(state.firestore.ordered.publicPosts)
    var sortedExploreArray = state.firestore.ordered.publicPosts.sort(function (a, b) {return b.createdAt["seconds"] - a.createdAt["seconds"];})

  return {
    explorePosts: sortedExploreArray,
    friendsPosts: sortedFriendsArray,
    auth: state.firebase.auth,
    users: state.firestore.ordered.users,
    currentFriendsList: currentFriendsList
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
      { collection: 'users' },
      {
        collection: 'posts',
        storeAs: 'friendsPosts',
        where: ['authorId', 'in', props.currentFriendsList === null || props.currentFriendsList.length === 0 ? ['0'] : props.currentFriendsList]
      },
      { 
        collection: 'posts',
        storeAs: 'publicPosts',
        where: ['privacy', '==', 'public'],
      },
      // {
      //   collection: 'posts',
      //   storeAs: 'privatePersonalPosts',
      //   where: [
      //     ['authorId', '==', props.auth["uid"]
      //   ],
      //     ['privacy', '==', 'private']
      //   ]
      // },
  ])
)(Feed);