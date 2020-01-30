import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Grid, Search, Header, Divider, Breadcrumb, Button } from 'semantic-ui-react'
import SongGrid, { SongInfo } from './songGrid'
import { updateToken } from '../../store/actions/authActions'
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


export class Discover extends Component {
    
  shouldComponentUpdate(prevProps, prevState) {
    if (this.state.searchedTracks !== prevState.searchedTracks) {
      console.log('true')
      return true;
    }
    return false;
  }

  constructor(){
    super();

    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.searchTracks('Love');
  }

  state = {
    loggedIn: this.token ? true : false,
    nowPlaying: { name: 'Not Checked', albumArt: '' },
    searchedTracks: [],
    value: ''
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

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  searchTracks(keyword){
    spotifyApi.searchTracks(keyword)
      .then((data) => {
        console.log('Search by ', keyword, data);
        this.setState({searchedTracks: data});
        return;
      }, function(err) {
        console.error(err);
      });
  }
  

  expandSection = (e, data) => {
    // TODO: Handle user choosing to see more from a section
  }

  render() {

    // Adds token to user's database
    // TODO: Update only when token is changed. Right now it updates everytime discover is loaded
    if (this.props.auth && !this.props.auth.isEmpty && this.props.location && this.props.location.hash !== '')
      this.props.updateToken(this.props.auth.uid, this.props.location.hash)

    // TODO: Replace with actual data
    let fake_songs = [
      new SongInfo('hello world 0', 'David Smallberg', 'CS 31', '/img/silhouette_1.png', 3),
      new SongInfo('hello world 1', 'David Smallberg', 'CS 31', '/img/silhouette_1.png', 4.5),
      new SongInfo('hello world 2', 'David Smallberg', 'CS 31', '/img/silhouette_1.png', 2),
      new SongInfo('hello world 3', 'David Smallberg', 'CS 31', '/img/silhouette_1.png', 5)
    ]
    const recents = fake_songs
    const trending = fake_songs
    const top = fake_songs
    console.log(this.state)
    return (
      <div>
        <h1>Discover</h1>
          <Grid centered>
            <Search fluid
              
              placeholder='search  for songs'
            />
          </Grid>

          <a href='http://localhost:8888' > Login to Spotify </a>
          <div>
            Now Playing: { this.state.nowPlaying.name }
          </div>
          <div>
            <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
          </div>
          { this.state.loggedIn ?
            <Button onClick={() => this.getNowPlaying()}>
              Check Now Playing
            </Button>
            :
            null
          }

          <SongSection
            title='Recent Songs'
            song_info={recents}
            expand={this.expandSection}
          />

          <SongSection
            title='Top Picks'
            song_info={top}
            expand={this.expandSection}
          />

        <br/>
      </div>

    )
  }
}

class SongSection extends Component {
  render() {
    const {title, song_info, expand} = this.props

    return (
      <div>
        <br/>
          <Container>
            <Header as='h2' textAlign='left'>{title}</Header>
            <Divider/>
            <SongGrid song_info={song_info}/>
            <br/>
            <Container textAlign='right'>
              <Breadcrumb floated='right' size='huge'>
                <Breadcrumb.Section link onClick={expand}>See more</Breadcrumb.Section>
              </Breadcrumb>
            </Container>
          </Container>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    updateToken: (uId, token) => dispatch(updateToken(uId, token))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Discover)
