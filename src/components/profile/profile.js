import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect, Route } from 'react-router-dom'
import { Grid, GridRow, Image, Button, Segment, Tab, GridColumn, Icon } from 'semantic-ui-react'
import EditProfile from './editProfile';
import { CreatePost } from '../createPost';


export class Profile extends Component {
  state = {
    posts_content: null,
    friends_content: null,
    navigate: null
  }


  profile_panes = [
    {
      menuItem: 'Posts',
      render: () => <Tab.Pane>{this.state.posts_content}hello</Tab.Pane>
    },
    {
      menuItem: 'Friends',
      render: () => <Tab.Pane>{this.state.friends_content}hello</Tab.Pane>
    }
  ]

  navigate = (destination) => {
    this.setState({
      navigate: destination
    })
  }

  render() {

    const { auth, users } = this.props;
    this.user = users && auth ? users.filter(user => user.id === auth.uid)[0] : null
    const imageUrl = this.user ? this.user.imageUrl : null
    console.log(this.state.navigate)
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
              <p className="profile-name">{ this.user ? this.user.name : null }</p>
          
              {
              auth.uid && this.user && auth.uid === this.user.id ?
                <div>
                  <Button floated='left' onClick={() => {this.navigate('/editprofile')}}>Edit profile</Button>
                  <Button floated='right' icon='plus' onClick={() => {this.navigate('/createpost')}}/>
                </div> :
                null
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
    posts: state.firestore.ordered.posts,
    auth: state.firebase.auth,
    users: state.firestore.ordered.users
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    { collection: 'posts', orderBy: ['createdAt', 'desc'] },
    { collection: 'users' }
  ])
)(Profile);
