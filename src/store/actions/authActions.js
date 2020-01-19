import firebase from '../../config/fbConfig'


export const signIn = (credentials) => {
  return (dispatch, getState) => {

    // Make async call to database
    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(() => {
        dispatch({type: 'LOGIN_SUCCESS'})
    }).catch((err) => {
        dispatch({type: 'LOGIN_ERROR', err})
    })
  }
}


export const signUp = (newUser) => {
  return (dispatch, getState, {getFirestore}) => {

    const firestore = getFirestore()

    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    ).then((resp) => {
      firestore.collection('users').doc(resp.user.uid).set({
        name: newUser.name,
        friends: [],
        privacy: 'public',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/runtime-terror-1d144.appspot.com/o/profile_images%2Fdefault_pic.png?alt=media&token=74c12ae4-d4ca-4ad2-af25-c38c2206ee43'
      })
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' })
    }).catch(err => {
      dispatch({ type: 'SIGNUP_ERROR', err})
    })
  }
}


export const signOut = () => {
  return (dispatch, getState) => {
    firebase.auth().signOut().then(() => {
      dispatch({type: 'SIGNOUT_SUCCESS'})
    })
  }
}


export const updateImage = (uId, imageUrl) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()

    firestore.collection('users').doc(uId).update({
      imageUrl: imageUrl
    }).then(() => {
      dispatch({ type: 'USER_IMAGE', uId, imageUrl })
    }).catch((err) => {
      dispatch({ type: 'USER_IMAGE_ERROR', err })
    })
  }
}


export const updateProfile = (uId, newInfo) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    // Make async call to database
    const firestore = getFirestore()
    const {name, privacy} = newInfo

    firestore.collection('users').doc(uId).update({
      name: name,
      privacy: privacy
    }).then(() => {
      dispatch({ type: 'USER_UPDATE', uId, newInfo })
    }).catch((err) => {
      dispatch({ type: 'USER_UPDATE_ERROR', err })
    })
  }
}
