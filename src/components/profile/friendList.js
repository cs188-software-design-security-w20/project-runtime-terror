import React from 'react';
import { Feed, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom';


const FriendList = ({friends, users}) => {
  return (
    <div>
        {(friends && friends.length === 0) ? <h3>No Friends Yet :(</h3> : null }
        { friends && users && friends.map(friend => {
          const friend_info = users.filter(user => user.id === friend)[0]
          const summary = friend_info ? <Link to={'/profile/' + friend}> {friend_info.name} </Link> : null
          return (
            <Feed key={friend}>
              <Feed.Event
                image={friend_info ? friend_info.imageUrl : null}
                summary={summary}
              />
              <Divider fitted/>
            </Feed>
          )
        })}
        
    </div>
  )
}


export default FriendList;