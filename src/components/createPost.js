import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createPost } from '../store/actions/postActions'
import { Form, Radio, Header, Container, Divider } from 'semantic-ui-react'

// Semantic-UI
// https://react.semantic-ui.com/
// https://medium.com/@a.carreras.c/using-semantic-ui-react-your-react-js-app-523ddc9abeb3


export class CreatePost extends Component {

  constructor(props) {
    super();

    const params = this.getHashParams();
    const songName = params.SongName;
    const songUrl = params.SongUrl;
    
    this.state = {
      song: songName ? songName : '',
      comment: '',
      rating: '',
      url: songUrl ? songUrl : '',
      privacy: props.profile.privacy,
      error: false,
    }
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

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
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
    if (this.state.rating) {
      this.props.createPost({
        song: this.state.song,
        comment: this.state.comment,
        rating: this.state.rating,
        privacy: this.state.privacy,
        url: this.state.url
      })
      this.props.history.push('/')
    }
    else {
        this.setState({ error: 'Rating is required!' })
    }
  }

  toggle = () => {
    this.setState({
      privacy: (this.state.privacy === 'private') ? 'public' : 'private',
    })
  }

  render() {

    return (
      <Container text>
        <Divider hidden />
        <Header as='h2'>Create Post</Header>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group widths='equal'>
            <Form.Input
              id='song'
              label='Song'
              name='Song'
              required={this.state.song ? false : true}
              readOnly={this.state.url ? true : false}
              placeholder={this.state.song}
              onChange={this.handleChange}
            />
            <Form.Input
              id='url'
              label='URL'
              name='URL'
              readOnly
              disabled={this.state.url ? false : true}
              placeholder={this.state.url}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Field
              control={Radio}
              toggle
              label={this.state.privacy === 'private' ? 'This post will be Private' : 'This post will be Public'}
              defaultChecked={this.state.privacy === 'private'}
              onClick={this.toggle}
            />
          <Form.Dropdown
            id='rating'
            label='Rating'
            placeholder='Select'
            required
            inline
            error={this.state.error}
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
