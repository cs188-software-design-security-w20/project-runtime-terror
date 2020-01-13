import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'


const SignedInLinks = () => {
  return (
    <div>
      <ul className="right">
        <li><NavLink to='/discover'>Discover</NavLink></li>
        <li><NavLink to='/feed'>Feed</NavLink></li>
        <li><NavLink to='/profile' className="btn btn-floating pink lighten-1">PS</NavLink></li>
        {/* <li><a href='/login' onClick={this.props.signOut}>Log Out</a></li> */}
      </ul>
    </div>
  )
}


const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}


export default  connect(null, mapDispatchToProps)(SignedInLinks)