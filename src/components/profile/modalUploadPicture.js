import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import { updateImage } from '../../store/actions/authActions'
import { Grid, Progress, Header, Image, Button, Modal } from 'semantic-ui-react';


class ModalUploadPicture extends Component {

  constructor(uId) {
    super()
    this.uId = uId.uId
  }

  state = {
    image: '',
    isUploading: false,
    progress: 0,
    imageURL: '',
    open: false
  };

  handleUploadStart = () => {
    this.setState({isUploading: true, progress: 0, imageURL: null, image: null})
  }
  handleProgress = (progress) => this.setState({progress});
  
  handleUploadError = (error) => {
    this.setState({isUploading: false})
    console.error(error);
  }
 
  handleUploadSuccess = (filename) => {
    this.setState({image: filename, progress: 100, isUploading: false});
    firebase.storage().ref('profile_images').child(filename).getDownloadURL().then(url => {
        this.setState({imageURL: url})
        this.props.updateImage(this.uId, url)
        this.handleModalClose()
    });
  }

  handleModalClose = () => {
    this.setState({
      image: '',
      isUploading: false,
      progress: 0,
      imageURL: '',
      open: false
    })
  }
    
  render() {
    const previousImageUrl = this.props.previousImageUrl

    return (
      <Modal
        trigger={<Image src={previousImageUrl} size='medium' circular bordered/>}
        open={this.state.open}
        onOpen={() => this.setState({open: true})}
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
        size='small'
      >
        <Modal.Content>                
          <Grid divided stretched centered>
            <Grid.Row stretched>
              <Grid.Column stretched>
                <Header as='h2'>Current</Header>
                <Image src={previousImageUrl} wrapped size='medium' href={previousImageUrl} bordered/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column stretched>
              <Grid stretched columns={16}>
                <Grid.Row>
                <Grid.Column width={6}>
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
                  </Grid.Column>
                  <Grid.Column width={10}>
                    {

                      (this.state.imageURL) ? <Progress percent={100} success>Uploaded</Progress> :
                        this.state.isUploading ?
                          <Progress percent={this.state.progress} progress color='blue'/> :
                          null
                    }
                  </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={() => {this.setState({open: false})}}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    updateImage: (uId, imageUrl) => dispatch(updateImage(uId, imageUrl))
  }
}


export default connect(null, mapDispatchToProps)(ModalUploadPicture)
