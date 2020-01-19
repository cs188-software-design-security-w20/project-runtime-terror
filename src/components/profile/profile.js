import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import styled from 'styled-components';


export class Profile extends Component {

  render() {

    const { auth, users } = this.props;
    this.user = users && auth ? users.filter(user => user.id === auth.uid)[0] : null

    const imageUrl = this.user ? this.user.imageUrl : null
    const ProfileImg = styled.img`
			width: 100px;
			max-height: 100px;
			margin-top: 5px;
			margin-bottom: 0;
			vertical-align: text-bottom;
    `;
    
    return (
      <div className="container">
        <h1>Profile</h1>
        
        {/*Profile Header block*/}
        <div className="profile-header center-align">
          <a href={imageUrl} ><ProfileImg src={imageUrl} alt="" className="circle responsive-img" /> </a>
          <p className="profile-name">{ this.user ? this.user.name : null }</p>
				</div>

        { auth.uid && this.user && auth.uid === this.user.id ?
          <div>
            <a href="/editprofile"><button>Edit Profile</button></a>
            <div className="postBtn">
              <Link to="/createpost" className="btn-floating btn-large waves-effect waves-light yellow darken-4"><i className="material-icons">add</i></Link>
            </div>
          </div> : null }

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
