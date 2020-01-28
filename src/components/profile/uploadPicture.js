import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import { updateImage } from '../../store/actions/authActions'


export class UploadPicture extends Component {

  constructor(uId) {
    super()
    this.uId = uId.uId
  }

  state = {
    image: '',
    isUploading: false,
    progress: 0,
    imageURL: ''
  };

  handleUploadStart = () => this.setState({isUploading: true, progress: 0});
  handleProgress = (progress) => this.setState({progress});
  handleUploadError = (error) => {
    this.setState({isUploading: false});
    console.error(error);
  }
  handleUploadSuccess = (filename) => {
    this.setState({image: filename, progress: 100, isUploading: false});
    firebase.storage().ref('users').child(filename).getDownloadURL().then(url => {
      this.setState({imageURL: url})
      this.props.updateImage(this.uId, url)
    });
  }

    
  render() {

    return (
      <div>
        
          <label>Change Profile Picture</label><br />
          {this.state.isUploading && <p>Progress: {this.state.progress}</p> }
          {this.state.imageURL && <p>Uploaded!</p> }
          
          <FileUploader
            accept="image/*"
            name="image"
            filename={ this.uId }
            storageRef={firebase.storage().ref('profile_images')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
            />
       
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    updateImage: (uId, imageUrl) => dispatch(updateImage(uId, imageUrl))
  }
}


export default connect(null, mapDispatchToProps)(UploadPicture)
