import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signUp } from '../../../store/actions/authActions'


export class SignUp extends Component {

  state = {
    email: '',
    password: '',
    name: ''
  }
  
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.signUp(this.state)
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

        <div className="input-field">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" onChange={this.handleChange}/>
        </div>

        <div className="input-field">

          <button className="btn-large waves-effect waves-light green" type="submit" name="action">Sign Up
            <i className="small material-icons right">add</i>
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
    signUp: (newUser) => dispatch(signUp(newUser))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
