import React from 'react';
import PostSummary from './postSummary';


const PostList = ({posts, users}) => {
  return (
    <div>
        {(posts && (posts.length === 0)) ? <h3>No Posts Yet!</h3> : null}
        { posts && posts.map(post => {
          return (
            <PostSummary key={post.id} post={post} users={users} />
          )
        })}
    </div>
  )
}


export default PostList;