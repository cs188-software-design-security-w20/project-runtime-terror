import React, { Component } from 'react'
import { Button, ButtonContent, Icon, Segment } from 'semantic-ui-react'
import SignUp from './signup'
import SignIn from './signin'


// TODO: A lot of code overlap with SignUp/SignIn. Refactor into one class
class LoginForm extends Component {
    state = {
        signing_up: false
    }

    sign_up = (word) => {
        this.setState( {signing_up: word})
    }

    render() {
        const signing_area = this.state.signing_up ? <SignUp/> : <SignIn/>
        return (
            <div>
                <Button.Group>
                    <Button color='yellow' onClick={() => {this.sign_up(true)}}>
                        <ButtonContent>
                            <Icon name='plus'/>
                            Sign Up
                        </ButtonContent>
                    </Button>
                    <Button.Or/>
                    <Button color='yellow' onClick={() => {this.sign_up(false)}}>
                        <ButtonContent>
                        <Icon name='music'/>
                            Sign In
                        </ButtonContent>
                    </Button>
                </Button.Group>
                <Segment>
                    {signing_area}
                </Segment>
                </div>
        )
    }

}


export default LoginForm
