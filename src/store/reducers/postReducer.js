
const initState = {
  posts: [
    {'song': null}
  ]
}
  
const postReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_POST': 
      console.log('Created post:', action.post);
      return state;

    case 'CREATE_POST_ERROR': 
      console.log('Create post error:', action.err);
      return state;

    //TODO: add functionality for deleting and editing
    /*
    case 'DELETE_POST': 
      console.log('Deleted post:', action.project);
      return state;
    case 'DELETE_POST_ERROR': 
      console.log('Delete post error:', action.err);
      return state;

    case 'EDIT_POST': 
      console.log('Edited post:', action.project);
      return state;
    case 'EDIT_POST_ERROR': 
      console.log('Edit post error:', action.err);
      return state;
    */

    default: 
      return state;
  }
}

export default postReducer
