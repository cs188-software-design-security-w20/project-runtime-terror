import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Grid, Search, Header, Segment, Divider, Breadcrumb, Button } from 'semantic-ui-react'
import SongGrid, { SongInfo } from './songGrid'
import { updateToken } from '../../store/actions/authActions'
import SpotifyWebApi from 'spotify-web-api-js';
import _ from 'lodash'

const spotifyApi = new SpotifyWebApi();
const initialState = { results: [], value: '' }

export class Discover extends Component {
    
  constructor(){
    super();

    const params = this.getHashParams();
    const token = params.access_token;
    const getToken = spotifyApi.getAccessToken();
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    else if(getToken){
      spotifyApi.setAccessToken(getToken);

    }

    this.state = {
      loggedIn: (token || spotifyApi.getAccessToken()) ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      searchedTracks: [],
      value: '',
      results: [],
      _token: (token) ? token : getToken,
      deviceId: "",
      error: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 1,
      albumArt: "",
    }

    this.playerCheckInterval = null;



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
        if (response == '' || response.item.name == null) {
          this.setState({
            nowPlaying: { 
                name: 'Nothing is playing right now', 
                albumArt: ''
              }
          })
        }
        else {
          this.setState({
            nowPlaying: { 
                name: response.item.name, 
                albumArt: response.item.album.images[0].url
              }
          })
        }
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

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })

  }

  handleSearchChange = (e, { value }) => {
    this.setState({ value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      // const isMatch = (result) => re.test(result.title)

      this.setState({
        results: this.searchTracks(re)
      })
      
    }, 300)
  }
  

  expandSection = (e, data) => {
    // TODO: Handle user choosing to see more from a section
  }

  checkForPlayer() {
    const { _token } = this.state;
  
    if (window.Spotify !== null) {
      
      clearInterval(this.playerCheckInterval);

      this.player = new window.Spotify.Player({
        name: "Runtime Terror's Spotify Player",
        getOAuthToken: cb => { cb(_token); },
      });
      this.createEventHandlers();
  
     
      this.player.connect();
    }
  }

  checkForPlayer_driver(){
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
  }

  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });
  
    // Playback status updates
    this.player.on('player_state_changed', state => { console.log(state); });
  
    this.player.on('player_state_changed', state => this.onStateChanged(state));
    // Ready
    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });
  }

  onStateChanged(state) {
    // if we're no longer listening to music, we'll get a null state.
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      const albumArt = currentTrack.album.images[0].url;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing,
        albumArt
      });
    }
  }

  onPrevClick() {
    this.player.previousTrack();
  }
  
  onPlayClick() {
    this.player.togglePlay();
  }
  
  onNextClick() {
    this.player.nextTrack();
  }
  
  transferPlaybackHere() {
    const { deviceId, _token } = this.state;
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceId ],
        "play": true,
      }),
    });
  }





  render() {
    const { value, results, trackName, artistName, albumName, albumArt, playing } = this.state

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
    
    return (
      <div>
        <h1>Discover</h1>
          <Grid centered>
            <Search fluid
              onSearchChange={this.handleSearchChange}
              value={value}
              results={results}
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
          { this.state.loggedIn ? 
            <Button onClick={() => this.checkForPlayer_driver()}>
              Launch Web Player
            </Button>
            :
            null
          }
          <div>
              <p>Artist: {artistName}</p>
              <p>Track: {trackName}</p>
              <p>Album: {albumName}</p>
              <p>
                <button onClick={() => this.onPrevClick()}>Previous</button>
                <button onClick={() => this.onPlayClick()}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => this.onNextClick()}>Next</button>
              </p>
          </div>
          <div>
            <img src={albumArt} style={{ height: 150}}/>
          </div> 
            
          
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
