import React from 'react';
import moment from 'moment';
import { Feed, Divider } from 'semantic-ui-react'
import { Link } from 'react-router-dom';


const PostSummary = ({post, users}) => {
  const user = users && post ? users.filter(user => user.id === post.authorId)[0] : null

  const summary = 
    <div>
      <Link to={'/profile/' + post.authorId}> {post.author} </Link>
      rated song <b><a href={post.url ? post.url : null}> {post.song} </a></b>
      <span className={"fa fa-star " + (post.rating >= 1 ? 'star_checked' : '')}></span>
      <span className={"fa fa-star " + (post.rating >= 2 ? 'star_checked' : '')}></span>
      <span className={"fa fa-star " + (post.rating >= 3 ? 'star_checked' : '')}></span>
      <span className={"fa fa-star " + (post.rating >= 4 ? 'star_checked' : '')}></span>
      <span className={"fa fa-star " + (post.rating >= 5 ? 'star_checked' : '')}></span> 
    </div>
  

  return (

    user && post ?
    <div>
      <Feed size='large'>
        <Feed.Event
          image={user.imageUrl}
          date={moment(post.createdAt.toDate()).format('LLLL')}
          summary={summary}
          extraText={post.comment}
        />
      </Feed>
      <Divider />
    </div> : null
  )
}


export default PostSummary;