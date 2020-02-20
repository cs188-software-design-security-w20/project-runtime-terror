import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Grid, Search, Header, Divider, Button, Menu, Image, Popup, Card } from 'semantic-ui-react'
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
      searchButton: 'songs',
      searchedTracks: [],
      searchedArtists: [],
      searchedAlbums: [],
      searchedPlaylists: [],
      value: '',
      results: [],
      newReleases: [],
      recentlyPlayed: [],
      topTracks: [],
      _token: (token) ? token : getToken,
      deviceId: "",
      error: "",
      trackName: undefined,
      artistName: undefined,
      albumName: undefined,
      playing: false,
      position: 0,
      duration: 1,
      albumArt: "",
      player_connected: false,
      account_type: 'free',
    }

    this.getAccountType();
    this.getNewReleases();
    this.getRecentSongs();
    this.getTopTracks();
    this.playerCheckInterval = null;
  }
  
  componentDidMount() {
    this.props.history.listen(this.onRouteChange.bind(this));
  }

  onRouteChange(route) {
    if(this.state.player_connected){
      this.player.disconnect();
    }
  }

  getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getAccountType(){
    spotifyApi.getMe()
      .then((data) => {
        this.setState({account_type: data.product});
        return data;
      }, function(err) {
        console.log("Something went wrong!", err);
        if (err.status === 401)
          if (window.confirm("Token Expired! Please re-login to Spotify!")) 
            window.location.href = 'http://localhost:8888';
      });
  }

  getNewReleases(){
    spotifyApi.getNewReleases({ limit : 5, offset: 0, country: 'US' })
      .then((data) => {
        this.setState({newReleases: data.albums.items});
        return data;
      }, function(err) {
        console.log("Something went wrong!", err);
      });
  }
  
  getRecentSongs(){
    spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 })
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
    spotifyApi.getMyTopTracks({ limit: 5 })
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

  searchAlbums(keyword){
    spotifyApi.searchAlbums(keyword)
      .then((data) => {
        this.setState({searchedAlbums: data});
        return data;
      }, function(err) {
        console.error(err);
      });
  }

  searchArtists(keyword){
    spotifyApi.searchArtists(keyword)
      .then((data) => {
        this.setState({searchedArtists: data});
        return data;
      }, function(err) {
        console.error(err);
      });
  }

  searchPlaylists(keyword){
    spotifyApi.searchPlaylists(keyword)
      .then((data) => {
        this.setState({searchedPlaylists: data});
        return data;
      }, function(err) {
        console.error(err);
      });
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState({value: '', results: []})

      switch(this.state.searchButton) {
        case 'songs':
          this.searchTracks(value)
          this.setState({
            results: (this.state.searchedTracks !== [] && this.state.searchedTracks.tracks && this.state.searchedTracks.tracks.items) ? this.state.searchedTracks.tracks.items : []
          })
          break;

        case 'artists':
          this.searchArtists(value)
          this.setState({
            results: (this.state.searchedArtists !== [] && this.state.searchedArtists.artists && this.state.searchedArtists.artists.items) ? this.state.searchedArtists.artists.items : []
          })
          break;
          
        case 'albums':
          this.searchAlbums(value)
          this.setState({
            results: (this.state.searchedAlbums !== [] && this.state.searchedAlbums.albums && this.state.searchedAlbums.albums.items) ? this.state.searchedAlbums.albums.items : []
          })
          break;

        case 'playlists':
          this.searchPlaylists(value)
          this.setState({
            results: (this.state.searchedPlaylists !== [] && this.state.searchedPlaylists.playlists && this.state.searchedPlaylists.playlists.items) ? this.state.searchedPlaylists.playlists.items : []
          })
          break;

        default:
          this.setState({
            results: []
          }) 
          break;
      }
    }, 20)

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
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 10);
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

  onPrevClick = () => {
    if(this.state.player_connected){
      this.player.previousTrack();
    }
  }
  
  onPlayClick = () => {
    if(this.state.player_connected){
      this.player.togglePlay();
    }
  }
  
  onNextClick = () => {
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
    const { value, results, recentlyPlayed, topTracks, newReleases, trackName, artistName, albumName, albumArt, playing, _token, deviceId, account_type, player_connected } = this.state

    // Adds token to user's database
    // TODO: Update only when token is changed. Right now it updates everytime discover is loaded
    if (this.props.auth && !this.props.auth.isEmpty && this.props.location && this.props.location.hash !== '')
      this.props.updateToken(this.props.auth.uid, this.props.location.hash)

    let searchResults = []
    let newAlbums = []
    const recents = []
    const top = []
    let i;

    if (results !== 'undefined') {
      for (i = 0; i < Math.min(results.length, 5); i++) {
        let title = results[i].name
        let artist = results[i].type === 'track' ? results[i].artists[0].name : results[i].type === 'playlist' ? results[i].owner.display_name : results[i].type === 'album' ? results[i].artists[0].name : ''
        let album = results[i].type === 'track' ? results[i].album.name : ''
        let art_url = results[i].type === 'artist' || results[i].type === 'playlist' || results[i].type === 'album' ? (results[i].images.length > 0 ? results[i].images[0].url : '') : results[i].album.images[0].url
        let url = results[i].external_urls.spotify
        let access_token = _token
        let uri = results[i].uri
        let deviceid = deviceId
        let type = results[i].type
        let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
        searchResults.push(new SongInfo(title, artist, album, art_url, url, create_url, access_token, uri, deviceid, type, account_type, player_connected))
      }
    } 

    if (recentlyPlayed !== 'undefined') {
      for (i = 0; i < Math.min(recentlyPlayed.length, 5); i++) {
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
        recents.push(new SongInfo(title, artist, album, art_url, url, create_url, access_token, uri, deviceid, type, account_type, player_connected))
      }
    }

    if (topTracks !== 'undefined') {
    for (i = 0; i < Math.min(topTracks.length, 5); i++) {
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
        top.push(new SongInfo(title, artist, album, art_url, url, create_url, access_token, uri, deviceid, type, account_type, player_connected))
      }
    }

    if (newReleases !== 'undefined') {
      for (i = 0; i < Math.min(newReleases.length, 5); i++) {
        let title = newReleases[i].name
        let artist = newReleases[i].artists[0].name
        let art_url = newReleases[i].images[0].url
        let url = newReleases[i].external_urls.spotify
        let access_token = _token
        let uri = newReleases[i].uri
        let deviceid = deviceId
        let type = newReleases[i].type
        let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
        newAlbums.push(new SongInfo(title, artist, "", art_url, url, create_url, access_token, uri, deviceid, type, account_type, player_connected))
      }
    }

    let player = [
    <Button key={0} inverted icon='backward' onClick={this.onPrevClick}></Button>,
    <Button key={1} inverted icon={(playing) ? 'pause' : 'play'} onClick={this.onPlayClick}></Button>,
    <Button key={2} inverted icon='forward' onClick={this.onNextClick}></Button>,
    <Popup key={3} trigger={<Menu.Item>{trackName}</Menu.Item>} position='bottom center'>
    <Popup.Content>
      <Card centered raised>
      <Card.Content>
          <Card.Header>{trackName}</Card.Header>
          <Card.Meta>{albumName + ' - ' + artistName}</Card.Meta>
          <Image src={albumArt}/>
      </Card.Content>
      </Card>
    </Popup.Content>
  </Popup>,
  ]
    
    return (
      <div className='Discover'>
        { // Top bar for player
          <Menu inverted>
            {
            (this.state.loggedIn && !(this.state.player_connected && trackName !== undefined)) ? // Show "button" when logged in and either we have not started the web player, or the webplayer hasn't loaded yet (checked based on song name)
              <Menu.Item onClick={() => this.checkForPlayer_driver()}>
                Launch Web Player
              </Menu.Item>
              :
              player
            }
            <Menu.Item href='http://localhost:8888' target='noreferrer noopener' position='right'>
              Sign In To Spotify
            </Menu.Item>
          </Menu>
        }

        <Divider hidden />
        <Grid centered>
          <Search fluid
            showNoResults={false}
            size='large'
            onSearchChange={_.debounce(this.handleSearchChange, 20)}
            value={value}
            placeholder={'Search for ' + this.state.searchButton + '..'}
            />
        </Grid>
        <Divider hidden />
        <Grid centered>
          <Button.Group labeled >
            <Button positive={this.state.searchButton === 'songs'} secondary content='Song' onClick={() => this.setState({value: '', results: [], searchButton: 'songs'})} />
            <Button positive={this.state.searchButton === 'artists'} secondary content='Artist' onClick={() => this.setState({value: '', results: [], searchButton: 'artists'})} />
            <Button positive={this.state.searchButton === 'albums'} secondary content='Album' onClick={() => this.setState({value: '', results: [], searchButton: 'albums'})} />
            <Button positive={this.state.searchButton === 'playlists'} secondary content='Playlist' onClick={() => this.setState({value: '', results: [], searchButton: 'playlists'})} />
          </Button.Group>
        </Grid>

        <br/>

        {(searchResults.length !== 0) ? 
          <SongSection
          title='Search Results'
          song_info={searchResults}
          expand={this.expandSection}
        /> : null
        }

        {(recents.length !== 0) ?
        <SongSection
          title='Recent Songs'
          song_info={recents}
        /> : null
        }

        {(top.length !== 0) ?
        <SongSection
          title='Your Top Picks'
          song_info={top}
        /> : null
        }
        
        {(newAlbums.length !== 0) ?
        <SongSection
          title='New Releases'
          song_info={newAlbums}
        /> : null
        }

        <br/>

      </div>

    )
  }
}


class SongSection extends Component {
  render() {
    const {title, song_info} = this.props

    return (
      <div>
        <br/>
          <Container fluid>
            <Header as='h2' textAlign='center'>{title}</Header>
            <Divider/>
            <SongGrid song_info={song_info}/>
            <Divider hidden/>
            <Divider hidden/>
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
