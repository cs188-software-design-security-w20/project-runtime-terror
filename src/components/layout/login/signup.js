import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Form, ButtonContent, Icon } from 'semantic-ui-react'
import { signUp } from '../../../store/actions/authActions'


class SignUp extends Component {
    state = {
        email: '',
        password: '',
        name: ''
    }

    submit = () => {
        this.props.signUp(this.state)
    }

    change = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        const { authError } = this.props
        return (
            <Form onSubmit={this.submit}>
                <Form.Field>
                    <Form.Input label='Email' id='email' placeholder='Enter your email' onChange={this.change}/>
                </Form.Field>
                <Form.Field>
                    <Form.Input label='Password' id='password' placeholder='Enter your password' type='password' onChange={this.change}/>
                </Form.Field>
                <Form.Field>
                    <Form.Input label='Name' id='name' placeholder='Enter your name' onChange={this.change}/>
                </Form.Field>
                {authError ? <p style={{color: 'red'}}>{authError}</p> : null}
                <Form.Field control={Button}>
                    <ButtonContent>
                        <Icon name='headphones'/>
                        Sign Up
                    </ButtonContent>
                </Form.Field>
            </Form>
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
