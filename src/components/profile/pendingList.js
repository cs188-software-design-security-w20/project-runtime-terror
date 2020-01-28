import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Divider, Container, List, Image, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { acceptFriend, rejectFriend } from '../../store/actions/authActions'


export class PendingList extends Component {

  render() {

    const { auth, users, profile, acceptFriend, rejectFriend } = this.props
    const friend_requests = profile ? profile.friends_pending : null

    return (
      <div>
        <Container text>
          <Divider hidden />
          {(friend_requests && friend_requests.length === 0) ? <h3>No Friends Requests</h3> : null }
          { friend_requests && users && friend_requests.map(friend => {
            const user_info = users.filter(user => user.id === friend)[0]
            const summary = user_info ? <Link to={'/profile/' + friend}> {user_info.name} </Link> : null
            
            return (
              <List divided animated relaxed verticalAlign='middle' size='big' key={friend}>
                <List.Item>
                  <Image avatar src={user_info ? user_info.imageUrl : null} />
                  <List.Content> <List.Header>{summary}</List.Header> </List.Content>
                  <List.Content floated='right'>
                    <List.Description as='a' onClick={() => acceptFriend(friend, auth.uid)}>
                      <Icon name='check' color='green'/>Accept
                    </List.Description>
                    <List.Description as='a' onClick={() => rejectFriend(friend, auth.uid)}>
                      <Icon name='close' color='red'/>Reject
                    </List.Description>
                  </List.Content>
                </List.Item>
                <Divider/>
              </List>
            )
          })}
        </Container>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    users: state.firestore.ordered.users
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    acceptFriend: (friend_user_id, logged_in_user_id) => dispatch(acceptFriend(friend_user_id, logged_in_user_id)),
    rejectFriend: (friend_user_id, logged_in_user_id) => dispatch(rejectFriend(friend_user_id, logged_in_user_id))
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: 'users' }])
)(PendingList)