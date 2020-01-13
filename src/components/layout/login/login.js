import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import LoginForm from './loginForm'


export class Login extends Component {

  render() {

    const Image = styled.img`
      width: 100%;
    `;

    const PaddedBottom = styled.div`
      padding-bottom: 3em;
      min-height: 120%;
    `;

    const { auth } = this.props;
    if (auth.isLoaded && auth.uid) return <Redirect to='/' />   // Redirect to home if signed in
  
    return (

      <div className="valing-wrapper center-align login_BG">           {/* Align vertically, horizontally */}
        <div className="container">
          <Image className="responsive-img" src="/img/silhouette_2.png" alt="" />
          <PaddedBottom />
          <LoginForm />
        </div>
      </div>
    )
 
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}


export default connect(mapStateToProps)(Login)
