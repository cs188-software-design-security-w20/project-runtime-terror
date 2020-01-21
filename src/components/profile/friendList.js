import React from 'react';
import { Feed, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom';


const FriendList = ({friends, users}) => {
  return (
    <div>
        {(friends && friends.length === 0) ? <h3>No Friends Yet :(</h3> : null }
        { friends && users && friends.map(friend => {
          const friend_info = users.filter(user => user.id === friend)[0]
          const summary = <Link to={'/profile/' + friend}> {friend_info.name} </Link>
          return (
            <Feed key={friend}>
              <Feed.Event
                image={friend_info.imageUrl}
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