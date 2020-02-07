import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import SongCard from './songCard'

class SongGrid extends Component {

    render() {
        const { song_info } = this.props

        if (!Array.isArray(song_info)) {
            return null;
        }
        else {            
            const song_cards = song_info.map((info, index) => <Grid.Column stretched key={index}><SongCard title={info.title} artist={info.artist} album={info.album} art_url={info.art_url} rating={info.rating} url={info.url} create_url={info.create_url}/></Grid.Column>)
            const rows = Array(Math.ceil(song_info.length / 4)).fill().map((currValue, index) => <Grid.Row key={index}>{song_cards.slice(index*4, index*4 + 4)}</Grid.Row>)
            return (
                <Grid columns='equal'>
                    {rows}
                </Grid>
            )
        }
    }

}

export class SongInfo {
    title;
    artist;
    album;
    art_url;
    rating;
    url;
    create_url;

    constructor(title, artist, album, art_url, rating, url, create_url) {
        this.title = title
        this.artist = artist
        this.album = album
        this.art_url = art_url
        this.rating = rating
        this.url = url
        this.create_url = create_url
    }

    updateRating = (newRating) => {
        this.rating = newRating
    }
}

export default SongGrid;