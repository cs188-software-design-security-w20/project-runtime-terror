import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Form, ButtonContent, Icon } from 'semantic-ui-react'
import { signIn } from '../../../store/actions/authActions'


class SignIn extends Component {
    state = {
        email: '',
        password: ''
    }

    submit = () => {
        this.props.signIn(this.state)
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
                {authError ? <p style={{color: 'red'}}>{authError}</p> : null}
                <Form.Field control={Button} fluid>
                    <ButtonContent>
                        <Icon name='headphones'/>
                        Sign In
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
        signIn: (creds) => dispatch(signIn(creds))
    }
}
  

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
