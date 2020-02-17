import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Grid, Search, Header, Divider, Breadcrumb, Button } from 'semantic-ui-react'
import SongGrid, { SongInfo } from './songGrid'
import { updateToken } from '../../store/actions/authActions'
import SpotifyWebApi from 'spotify-web-api-js';
import _ from 'lodash'

const spotifyApi = new SpotifyWebApi();
const base_url = "http://localhost:3000"

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
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      searchedTracks: [],
      value: '',
      results: [],
      newReleases: [],
      recentlyPlayed: [],
      topTracks: [],
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
      player_connected: false,
    }

    this.getNewReleases();
    this.getRecentSongs();
    this.getTopTracks();
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

  getNewReleases(){
    spotifyApi.getNewReleases({ limit : 4, offset: 0, country: 'US' })
      .then((data) => {
        this.setState({newReleases: data.albums.items});
        return data;
      }, function(err) {
        console.log("Something went wrong!", err);
      });
  }
  
  getRecentSongs(){
    spotifyApi.getMyRecentlyPlayedTracks({ limit: 4 })
      .then((data) => {
        this.setState({
          recentlyPlayed: data.items
        });
        return data;
      }, function(err) {
        console.log("Something went wrong!", err);
      });
  }

  getTopTracks(){
    spotifyApi.getMyTopTracks({ limit: 4 })
      .then((data) => {
        this.setState({
          topTracks: data.items
        });
        return data;
      }, function(err) {
        console.log("Something went wrong!", err);
      });
  }

  searchTracks(keyword){
    spotifyApi.searchTracks(keyword)
      .then((data) => {
        this.setState({searchedTracks: data});
        return data;
      }, function(err) {
        console.error(err);
      });
  }

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title })
    //TODO: redirect to /createpost with song name & URL filled
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState({value: '', results: []})

      this.searchTracks(value)
      this.setState({
        results: (this.state.searchedTracks !== [] && this.state.searchedTracks.tracks && this.state.searchedTracks.tracks.items) ? this.state.searchedTracks.tracks.items : []
      })
    }, 20)

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
      const player_connected = true;
      this.setState({player_connected});
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
    if(this.state.player_connected){
      this.player.previousTrack();
    }
  }
  
  onPlayClick() {
    if(this.state.player_connected){
      this.player.togglePlay();
    }
  }
  
  onNextClick() {
    if(this.state.player_connected){
      this.player.nextTrack();
    }
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
    const { value, results, recentlyPlayed, topTracks, newReleases, trackName, artistName, albumName, albumArt, playing, _token, deviceId } = this.state

    // Adds token to user's database
    // TODO: Update only when token is changed. Right now it updates everytime discover is loaded
    if (this.props.auth && !this.props.auth.isEmpty && this.props.location && this.props.location.hash !== '')
      this.props.updateToken(this.props.auth.uid, this.props.location.hash)


    var searchResults = []
    var newAlbums = []
    const recents = []
    const top = []
    var i;

    // TODO: get number of stars and place for last argument
    if (results !== 'undefined') {
      for (i = 0; i < 4; i++) {
        if (results.length > i) {
          let title = results[i].name
          let artist = results[i].artists[0].name
          let album = results[i].album.name
          let art_url = results[i].album.images[0].url
          let url = results[i].external_urls.spotify
          let access_token = _token
          let uri = results[i].uri
          let deviceid = deviceId
          let type = results[i].type
          let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          searchResults.push(new SongInfo(title, artist, album, art_url, 0, url, create_url, access_token, uri, deviceid, type))
        }
      }
    } 

    if (recentlyPlayed !== 'undefined') {
      for (i = 0; i < 4; i++) {
        if (recentlyPlayed.length > i) {
          let title = recentlyPlayed[i].track.name
          let artist = recentlyPlayed[i].track.artists[0].name
          let album = recentlyPlayed[i].track.album.name
          let art_url = recentlyPlayed[i].track.album.images[0].url
          let url = recentlyPlayed[i].track.external_urls.spotify
          let access_token = _token
          let uri = recentlyPlayed[i].track.uri
          let deviceid = deviceId
          let type = recentlyPlayed[i].track.type
          let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          recents.push(new SongInfo(title, artist, album, art_url, 0, url, create_url, access_token, uri, deviceid, type))
        }
      }
    } 


    if (topTracks !== 'undefined') {
      for (i = 0; i < 4; i++) {
        if (topTracks.length > i) {
          let title = topTracks[i].name
          let artist = topTracks[i].artists[0].name
          let album = topTracks[i].album.name
          let art_url = topTracks[i].album.images[0].url
          let url = topTracks[i].external_urls.spotify
          let access_token = _token
          let uri = topTracks[i].uri
          let deviceid = deviceId
          let type = topTracks[i].type
          let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          top.push(new SongInfo(title, artist, album, art_url, 0, url, create_url, access_token, uri, deviceid, type))
        }
      }
    } 

    if (newReleases !== 'undefined') {
      for (i = 0; i < 4; i++) {
        if (newReleases.length > i) {
          let title = newReleases[i].name
          let artist = newReleases[i].artists[0].name
          let art_url = newReleases[i].images[0].url
          let url = newReleases[i].external_urls.spotify
          let access_token = _token
          let uri = newReleases[i].uri
          let deviceid = deviceId
          let type = newReleases[i].type
          let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          newAlbums.push(new SongInfo(title, artist, "", art_url, 0, url, create_url, access_token, uri, deviceid, type))
        }
      }
    } 
    

    return (
      <div>
        <Header as='h1'>Discover</Header>
          <Grid centered>
            <Search fluid
              onSearchChange={_.debounce(this.handleSearchChange, 20)}
              value={value}
              placeholder='Search For Songs..'
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
            
          
          {(searchResults.length !== 0) ? 
            <SongSection
            title='Search Results'
            song_info={searchResults}
            expand={this.expandSection}
          /> : null
          }

          <SongSection
            title='Recent Songs'
            song_info={recents}
            expand={this.expandSection}
          />

          <SongSection
            title='Your Top Picks'
            song_info={top}
            expand={this.expandSection}
          />
          
          <SongSection
            title='New Releases'
            song_info={newAlbums}
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
