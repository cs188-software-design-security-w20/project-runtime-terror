export const createPost = (post) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()
    const profile = getState().firebase.profile
    const authorId = getState().firebase.auth.uid

    firestore.collection('posts').add({
      ...post, 
      author: profile.name,
      authorId: authorId,
      createdAt: new Date()
    }).then(() => {
      dispatch({ type: 'CREATE_POST', post: post })
    }).catch((err) => {
      dispatch({ type: 'CREATE_POST_ERROR', err: err })
    })
  }
}
