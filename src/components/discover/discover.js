import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Grid, Search, Header, Divider, Button } from 'semantic-ui-react'
import SongGrid, { SongInfo } from './songGrid'
import { updateToken } from '../../store/actions/authActions'
import SpotifyWebApi from 'spotify-web-api-js';
import {makeCancellable} from '../../cancellablePromise';

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

      nowPlayingPromise: null,
      newReleasesPromise: null,
      recentSongsPromise: null,
      topTracksPromise: null,
      searchTracksPromise: null
    }
  }

  componentDidMount() {
    this.getNewReleases();
    this.getRecentSongs();
    this.getTopTracks();
    console.log('discover')
  }

  componentWillUnmount() {
    const {nowPlayingPromise, newReleasesPromise, recentSongsPromise, topTracksPromise, searchTracksPromise} = this.state
    const promises = [nowPlayingPromise, newReleasesPromise, recentSongsPromise, topTracksPromise, searchTracksPromise]
    console.log(promises)
    for (let i = 0; i < promises.length; i++) {
      console.log(promises[i])
      if (promises[i]) {
        promises[i].cancel()
      }
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

  getNowPlaying(){

    let playbackStatus = makeCancellable(spotifyApi.getMyCurrentPlaybackState())
    this.setState({nowPlayingPromise: playbackStatus})

    playbackStatus.promise.then((response) => {
        if (response === '' || response.item.name === null) {
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

    let newReleases = makeCancellable(spotifyApi.getNewReleases({ limit : 5, offset: 0, country: 'US' }))
    this.setState({newReleasesPromise: newReleases})

    newReleases.promise.then((data) => {
        this.setState({newReleases: data.albums.items});
        return data;
      }, function(err) {
        console.log("Something went wrong!", err);
        if (err.status === 401) {
          if (window.confirm("Token Expired! Please re-login to Spotify!")) {
            window.location.href = 'http://localhost:8888';
          }
        }
      });
  }
  
  getRecentSongs(){
    let recentSongs = makeCancellable(spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 }))
    this.setState({recentSongsPromise: recentSongs})

    recentSongs.promise.then((data) => {
        this.setState({
          recentlyPlayed: data.items
        });
        return data;
      }, function(err) {
        console.log("Something went wrong!", err);
      });
  }

  getTopTracks(){
    let topTracks = makeCancellable(spotifyApi.getMyTopTracks({ limit: 5 }))
    this.setState({topTracksPromise: topTracks})

    topTracks.promise.then((data) => {
        this.setState({
          topTracks: data.items
        });
        return data;
      }, function(err) {
        console.log("Something went wrong!", err);
      });
  }

  searchTracks(keyword){

    let tracks = makeCancellable(spotifyApi.searchTracks(keyword))
    this.setState({searchTracksPromise: tracks})

    tracks.promise.then((data) => {
        this.setState({searchedTracks: data});
        return data;
      }, function(err) {
        console.error(err);
      });
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
  
  render() {
    const { value, results, recentlyPlayed, topTracks, newReleases } = this.state

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
      for (i = 0; i < Math.min(results.length, 5); i++) {
        let title = results[i].name
        let artist = results[i].artists[0].name
        let album = results[i].album.name
        let art_url = results[i].album.images[0].url
        let url = results[i].external_urls.spotify
        let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
        searchResults.push(new SongInfo(title, artist, album, art_url, 0, url, create_url))
      }
    } 

    if (recentlyPlayed !== 'undefined') {
      for (i = 0; i < Math.min(recentlyPlayed.length, 5); i++) {
          let title = recentlyPlayed[i].track.name
          let artist = recentlyPlayed[i].track.artists[0].name
          let album = recentlyPlayed[i].track.album.name
          let art_url = recentlyPlayed[i].track.album.images[0].url
          let url = recentlyPlayed[i].track.external_urls.spotify
          let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          recents.push(new SongInfo(title, artist, album, art_url, 0, url, create_url))
      }
    } 


    if (topTracks !== 'undefined') {
      for (i = 0; i < Math.min(topTracks.length, 5); i++) {
          let title = topTracks[i].name
          let artist = topTracks[i].artists[0].name
          let album = topTracks[i].album.name
          let art_url = topTracks[i].album.images[0].url
          let url = topTracks[i].external_urls.spotify
          let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          top.push(new SongInfo(title, artist, album, art_url, 0, url, create_url))
      }
    } 

    if (newReleases !== 'undefined') {
      for (i = 0; i < Math.min(newReleases.length, 5); i++) {
          let title = newReleases[i].name
          let artist = newReleases[i].artists[0].name
          let art_url = newReleases[i].images[0].url
          let url = newReleases[i].external_urls.spotify
          let create_url = base_url + "/createpost/#SongName=" + title + "&SongUrl=" + url + "&access_token=" + spotifyApi.getAccessToken()
          newAlbums.push(new SongInfo(title, artist, "", art_url, 0, url, create_url))
      }
    } 
    

    return (
      <div>
        <Divider hidden />
        <Grid centered>
          <Search fluid
            showNoResults={false}
            size='large'
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
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} alt='' />
        </div>

        { this.state.loggedIn ?
          <Button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </Button>
          :
          null
        }
        
        {(searchResults.length !== 0) ? 
          <SongSection
          title='Search Results'
          song_info={searchResults}
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
