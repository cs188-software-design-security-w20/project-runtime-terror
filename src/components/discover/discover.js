import React, { Component } from 'react'
import { Container, Grid, Search, Header, Divider, Breadcrumb, Label } from 'semantic-ui-react'
import SongGrid, { SongInfo } from './songGrid'

export class Discover extends Component {

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