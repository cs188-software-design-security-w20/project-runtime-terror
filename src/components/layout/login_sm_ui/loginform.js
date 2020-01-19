import React, { Component } from 'react'
import { Button, ButtonContent, Icon, Segment } from 'semantic-ui-react'
import SignUp from './signup.js'
import SignIn from './signin.js'

// TODO: A lot of code overlap with SignUp/SignIn. Refactor into one class

class LoginForm extends Component {
    state = {
        signing_up: false
    }

    switch = (word) => {
        this.setState( {signing_up: word})
    }

    render() {
        const signing_area = this.state.signing_up ? <SignUp/> : <SignIn/>
        return (
            <div>
                <Button.Group>
                    <Button color='yellow' onClick={() => {this.switch(true)}}>
                        <ButtonContent>
                            <Icon name='plus'/>
                            Sign Up
                        </ButtonContent>
                    </Button>
                    <Button.Or/>
                    <Button color='yellow' onClick={() => {this.switch(false)}}>
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