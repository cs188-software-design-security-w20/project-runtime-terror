import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Grid, Search, Header, Segment, Divider, Breadcrumb, Button } from 'semantic-ui-react'
import SongGrid, { SongInfo } from './songGrid'
import { updateToken } from '../../store/actions/authActions'
import SpotifyWebApi from 'spotify-web-api-js';
import _ from 'lodash'

const spotifyApi = new SpotifyWebApi();

export class Discover extends Component {

  constructor(){
    super();

    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      searchedTracks: [],
      value: '',
      results: []
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

    console.log(this.state.results)  //why is this undefined??
  }
  

  expandSection = (e, data) => {
    // TODO: Handle user choosing to see more from a section
  }

  render() {
    const { value, results } = this.state
    const results_names = results ? results.map(x => x.name) : []
    console.log(results_names)

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
    var searchResults = []
    const recents = fake_songs
    const trending = fake_songs
    const top = fake_songs


    //TODO: replace image address with real data
    //TODO: get number of stars and place for last argument
    if (results !== 'undefined') {
      var i;
      for (i = 0; i < 4; i++) {
        if (results.length > i) {
          let title = results[i].name
          let artist = results[i].artists[0].name
          let album = results[i].album.name
          searchResults.push(new SongInfo(title, artist, album, '/img/silhouette_1.png', 0))
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
