import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Grid, GridRow, Image, Icon } from 'semantic-ui-react'


export class Profile extends Component {

  render() {

    const { auth, users } = this.props;
    this.user = users && auth ? users.filter(user => user.id === auth.uid)[0] : null
    const imageUrl = this.user ? this.user.imageUrl : null
        
    return (
      <div>
        <Grid container centered padded='vertically'>

          <GridRow> <a href={imageUrl} ><Image src={imageUrl} size='medium' circular /> </a> </GridRow>
          <GridRow> <p className="profile-name">{ this.user ? this.user.name : null }</p> </GridRow>
          
          { auth.uid && this.user && auth.uid === this.user.id ?
            <div>
              <GridRow> <a href="/editprofile"><button>Edit Profile</button></a> </GridRow>
              <div className="postBtn">
                <a href="/createpost"><Icon name="add" /></a>
              </div>
            </div> : null }

        </Grid>
      </div>
    )
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
