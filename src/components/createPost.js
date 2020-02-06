import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createPost } from '../store/actions/postActions'
import { Form, Header, Container } from 'semantic-ui-react'

// Semantic-UI
// https://react.semantic-ui.com/
// https://medium.com/@a.carreras.c/using-semantic-ui-react-your-react-js-app-523ddc9abeb3


export class CreatePost extends Component {

  state = {
    song: '',
    comment: '',
    rating: '',
    privacy: this.props.profile ? this.props.profile.privacy : 'private',
    url: '',
    toggleState: 'private'    // TODO: set initial state of toggle based on whether or not privacy !== 'private' or not and remove toggleState
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.profile && nextProps.profile.isLoaded && nextProps.profile.privacy !== undefined && prevState.privacy === undefined) {
      return {
        privacy: nextProps.profile.privacy
      }
    }
    else {
      return null
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleRating = (e, {value}) => {
    this.setState({
      'rating': value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.createPost({
      song: this.state.song,
      comment: this.state.comment,
      rating: this.state.rating,
      privacy: this.state.toggleState,
      url: this.state.url
    })
    this.props.history.push('/')
  }

  toggle = () => {
    this.setState({
      toggleState: (this.state.toggleState === 'private') ? 'public' : 'private',
    })
  }

  render() {

    return (
      <Container text>
        <Header as='h2'>Create Post</Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group widths='equal'>
            <Form.Input
              id='song'
              label='Song'
              name='Song'
              onChange={this.handleChange}
            />
            <Form.Input
              id='url'
              label='URL'
              name='URL'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Radio
              label={this.state.toggleState === 'private' ? 'Private' : 'Public'}
              toggle
              onClick={this.toggle}
            />
          <Form.Select
            id='rating'
            label='Rating'
            onChange={this.handleRating}
            options={
              [
                {text: '1', value: 1},
                {text: '2', value: 2},
                {text: '3', value: 3},
                {text: '4', value: 4},
                {text: '5', value: 5}
              ]
            }
          />

          <Form.TextArea
            id='comment'
            label='Comment'
            name='Comment'
            onChange={this.handleChange}
          />
          <Form.Button type='submit' color='green'>Create Post</Form.Button>
        </Form>
      </Container>
    )
  }
}
 

const mapStateToProps = (state) => {
  return {
      profile: state.firebase.profile
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (Post) => dispatch(createPost(Post))
  }
}


export default  connect(mapStateToProps, mapDispatchToProps)(CreatePost);
