import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createPost } from '../store/actions/postActions'
import { Dropdown } from 'semantic-ui-react'

// Semantic-UI
// https://react.semantic-ui.com/
// https://medium.com/@a.carreras.c/using-semantic-ui-react-your-react-js-app-523ddc9abeb3


export class CreatePost extends Component {

  state = {
    song: '',
    comment: '',
    rating: '',
    privacy: 'public',
    url: ''
  }

  handleChange = (e, opt) => {
    opt ? this.setState({['privacy']: opt.value}) :
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.createPost(this.state)
    this.props.history.push('/feed')
  }

  render() {

    
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Create Post</h5>

            <div className="input-field">
              <label htmlFor="song">Song</label>
              <input type="text" value={this.state.song} id="song" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <label htmlFor="rating">Rating (1 - 5)</label>
              <input type="number" min="1" max="5" id="rating" className="materialize-textarea" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <label htmlFor="comment">Comment</label>
              <input type="text" id="comment" className="materialize-textarea" onChange={this.handleChange} />
            </div>
            
            <div className="input-field">
              <label htmlFor="URL">URL</label>
              <input type="text" value={this.state.url} id="url" className="materialize-textarea" onChange={this.handleChange} />
            </div>

            <span>
              Make my post {' '}
              <Dropdown
                inline
                onChange={this.handleChange}
                options={[
                  {text:'public', value:'public'},
                  {text:'private', value:'private'}
                ]}
                value={this.state.privacy} />
            </span>

            <div className="input-field">
              <button id="create_btn" className="btn pink lighten-1 z-depth-0">Create</button>
            </div>

        </form>
      </div>
    )
  }
}
 

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (Post) => dispatch(createPost(Post))
  }
}


export default  connect(null, mapDispatchToProps)(CreatePost);
