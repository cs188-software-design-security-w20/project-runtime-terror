import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import SignedInLinks from './signedInLinks'


const Navbar = (props) => {
  
  const { auth, profile } = props
  const links = <SignedInLinks profile={profile} auth={auth} />

  return (
    <nav className="nav-wrapper grey darken-3">
      <div className="container">
        <Link to='/' className="brand-logo">Runtime Teror</Link>
        {auth.isLoaded && links}
      </div>
    </nav>
  )
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}


export default connect(mapStateToProps)(Navbar)