import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Image, Grid, Segment } from 'semantic-ui-react'
import LoginForm from './loginform.js'

class Login extends Component {

    render() {
        const { auth } = this.props
        if (auth.isLoaded && auth.uid)
            return <Redirect to='/'/>
        else
            return (
                <Grid padded centered>
                    <Image src="/img/silhouette_2.png"/>
                    <LoginForm/>
                </Grid>
            )
    }
}

const mapStateToProps = (state) => {
    return {
      auth: state.firebase.auth
    }
  }
  
  
export default connect(mapStateToProps)(Login)
  