
const initState = {
  authError: null
}

const authReducer = (state = initState, action) => {
  
  switch(action.type){
    case 'LOGIN_ERROR':
      console.log('login error')
      return {
        ...state,
        authError: 'Login Failed!'
      }

    case 'LOGIN_SUCCESS':
      console.log('login success')
      return {
        ...state,
        authError: null
      }

    case 'SIGNOUT_SUCCESS':
      console.log('signout success')
      return state

    case 'SIGNUP_SUCCESS':
      console.log('signup success')
      return {
        ...state,
        authError: null
      }

    case 'SIGNUP_ERROR':
      console.log('signup error')
      return {
        ...state,
        authError: action.err.message
      }

    case 'USER_IMAGE': 
      console.log('Updated user image', action.uId, action.imageUrl)
      return state

    case 'USER_IMAGE_ERROR': 
      console.log('Update user image error', action.err)
      return state

    case 'USER_UPDATE': 
      console.log('Updated user profile', action.uId, action.newInfo)
      return state

    case 'USER_UPDATE_ERROR': 
      console.log('Update user profile error', action.err)
      return state

    default:
      return state
  }
}


export default authReducer