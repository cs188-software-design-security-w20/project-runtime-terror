import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Grid, Search, Header, Segment, Divider, Breadcrumb, Button } from 'semantic-ui-react'
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
      topTracks: []
    }

    this.getNewReleases();
    this.getRecentSongs();
    this.getTopTracks();
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
        console.log('Search: ', keyword, data);
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
    }, 100)

  }
  

  expandSection = (e, data) => {
    // TODO: Handle user choosing to see more from a section
  }

  render() {
    const { value, results, recentlyPlayed, topTracks, newReleases } = this.state
    const recent_names = recentlyPlayed ? recentlyPlayed.map(x => x.name) : []

    // Adds token to user's database
    // TODO: Update only when token is changed. Right now it updates everytime discover is loaded
    if (this.props.auth && !this.props.auth.isEmpty && this.props.location && this.props.location.hash !== '')
      this.props.updateToken(this.props.auth.uid, this.props.location.hash)


    var searchResults = []
    var newAlbums = []
    const recents = []
    const top = []

    // TODO: get number of stars and place for last argument
    if (results !== 'undefined') {
      var i;
      for (i = 0; i < 4; i++) {
        if (results.length > i) {
          let title = results[i].name
          let artist = results[i].artists[0].name
          let album = results[i].album.name
          let art_url = results[i].album.images[0].url
          let url = results[i].external_urls.spotify
          let create_url = base_url + "/createpost/#SongName=\"" + title + "\"&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          searchResults.push(new SongInfo(title, artist, album, art_url, 0, url, create_url))
        }
      }
    } 

    if (recentlyPlayed !== 'undefined') {
      var i;
      for (i = 0; i < 4; i++) {
        if (recentlyPlayed.length > i) {
          let title = recentlyPlayed[i].track.name
          let artist = recentlyPlayed[i].track.artists[0].name
          let album = recentlyPlayed[i].track.album.name
          let art_url = recentlyPlayed[i].track.album.images[0].url
          let url = recentlyPlayed[i].track.external_urls.spotify
          let create_url = base_url + "/createpost/#SongName=\"" + title + "\"&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          recents.push(new SongInfo(title, artist, album, art_url, 0, url, create_url))
        }
      }
    } 


    if (topTracks !== 'undefined') {
      var i;
      for (i = 0; i < 4; i++) {
        if (topTracks.length > i) {
          let title = topTracks[i].name
          let artist = topTracks[i].artists[0].name
          let album = topTracks[i].album.name
          let art_url = topTracks[i].album.images[0].url
          let url = topTracks[i].external_urls.spotify
          let create_url = base_url + "/createpost/#SongName=\"" + title + "\"&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          top.push(new SongInfo(title, artist, album, art_url, 0, url, create_url))
        }
      }
    } 

    if (newReleases !== 'undefined') {
      var i;
      for (i = 0; i < 4; i++) {
        if (newReleases.length > i) {
          let title = newReleases[i].name
          let artist = newReleases[i].artists[0].name
          let art_url = newReleases[i].images[0].url
          let url = newReleases[i].external_urls.spotify
          let create_url = base_url + "/createpost/#SongName=\"" + title + "\"&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          newAlbums.push(new SongInfo(title, artist, "", art_url, 0, url, create_url))
        }
      }
    } 
    

    return (
      <div>
        <h1>Discover</h1>
          <Grid centered>
            <Search fluid
              onSearchChange={_.debounce(this.handleSearchChange, 100)}
              value={value}
              placeholder='search  for songs'
            />
          </Grid>

          <Button onClick={()=>console.log(this.state)}>Press to see state</Button> <br />

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
            title='Search Results'
            song_info={searchResults}
            expand={this.expandSection}
          />

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
