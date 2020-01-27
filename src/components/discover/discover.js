import React, { Component } from 'react'
import { Container, Grid, Search, Header, Divider, Breadcrumb, Label } from 'semantic-ui-react'
import SongGrid, { SongInfo } from './songGrid'

import SpotifyWebApi from 'spotify-web-api-js';
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
      nowPlaying: { name: 'Not Checked', albumArt: '' }
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

  expandSection = (e, data) => {
    // TODO: Handle user choosing to see more from a section
  }

  render() {
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
            <Search fluid/>
          </Grid>

          <a href='http://localhost:8888' > Login to Spotify </a>
          <div>
            Now Playing: { this.state.nowPlaying.name }
          </div>
          <div>
            <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
          </div>
          { this.state.loggedIn &&
            <button onClick={() => this.getNowPlaying()}>
              Check Now Playing
            </button>
          }

          <SongSection
            title='Recent Songs'
            song_info={recents}
            expand={this.expandSection}
          />

          <SongSection
            title='Trending'
            song_info={trending}
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

export default Discover