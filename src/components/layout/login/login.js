import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Image, Grid, GridRow } from 'semantic-ui-react'
import LoginForm from './loginForm'


const path = process.env.NODE_ENV === "production" ? '' : '/';


class Login extends Component {

    render() {
        const { auth } = this.props
        if (auth.isLoaded && auth.uid) {
            return <Redirect to='/'/>
        }
        else {
            return (
                <Grid padded centered>
                    <Image src={path + "img/silhouette_2.png"}/>
                    <GridRow> <LoginForm/> </GridRow>
                </Grid>
            )
        }
    }
}


const mapStateToProps = (state) => {
    return {
      auth: state.firebase.auth
    }
  }
  

export default connect(mapStateToProps)(Login)
