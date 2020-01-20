import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Button, Form } from 'semantic-ui-react'
import { Container } from 'semantic-ui-react'
import UploadPicture from './uploadPicture';
import { updateProfile } from '../../store/actions/authActions'


export class EditProfile extends Component {

  state = {
    name: '',
    privacy: ''
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.profile !== prevState.profile && nextProps.profile.name) {
      return {
        name: nextProps.profile.name,
        privacy: nextProps.profile.privacy
      }
    }
    else {
      return null;
    }
  }

  handleChange = (e, opt) => {
    opt ? this.setState({['privacy']: opt.value}) :
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.updateProfile(this.props.auth.uid, this.state)
    this.props.history.push('/profile/' + this.props.auth.uid)
  }

  render() {

    return (
      <div>
        <Container text>
          
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>Name</label>
              <input id="name" onChange={this.handleChange} placeholder={this.state.name} />
            </Form.Field>

            <span>
              Make my profile {' '}
              <Dropdown
                inline
                onChange={this.handleChange}
                options={[
                  {text:'public', value:'public'},
                  {text:'private', value:'private'}
                ]}
                value={this.state.privacy} />
            </span>
            <br />
            <Button type='submit'>Submit</Button>
          </Form>
          
          <br />
          <UploadPicture uId={this.props.auth.uid} />

        </Container>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (uId, newInfo) => dispatch(updateProfile(uId, newInfo))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
