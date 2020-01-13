import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../../store/actions/authActions'


export class SignIn extends Component {

  state = {
    email: '',
    password: ''
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.signIn(this.state)
  }

  render() {
    const { authError } = this.props

    return (
        <form onSubmit={this.handleSubmit}>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" onChange={this.handleChange}/>
          </div>

          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={this.handleChange}/>
          </div>

          <div className="input-field ">

            <button id="signin_btn" className="btn-large waves-effect waves-light green" type="submit" name="action">Sign In
              <i className="small material-icons right">music_note</i>
            </button>
            <br />
            
            <div className="red-text center">
              { authError ? <p>{authError}</p> : null }
            </div>

          </div>
        </form>
        
    )
  }
}


const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (creds) => dispatch(signIn(creds))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
