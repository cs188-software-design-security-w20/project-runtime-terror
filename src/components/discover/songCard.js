import React, { Component } from 'react';
import { Card, Button, Image, Icon, Popup } from 'semantic-ui-react'



class SongCard extends Component {

    playSong(){
        // TODO: start song on player
        let { _token, uri, deviceid, type } = this.props;

        if(type === "track"){
            fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${_token}`,
            },
            query:{
                "device_id":deviceid
            },
            body: JSON.stringify({
                uris:[uri]
            }),
        });
        }
        if(type === "album"){
            fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${_token}`,
            },
            query:{
                "device_id":deviceid
            },
            body: JSON.stringify({
                context_uri:uri
            }),
        });
        }        
    }

    makePost = () => {
        let { create_url } = this.props;
        window.location.href = create_url;
    }

    render() {
        let { title, artist, album, art_url, rating } = this.props;
        rating = Math.min(rating, 5)    // Do we need this check?

        const full = Array(Math.floor(rating)).fill().map((currVal, index) => <Icon color='yellow' name='star' key={index}/>)
        const trailing = (Number.isInteger(rating)) ? null : <Icon color='yellow' name='star half'/>

        return (
            <Card centered raised>
                <Card.Content>
                    <Popup content='Create a post' position='top center' trigger={<Button floated='right' icon='plus' onClick={this.makePost}/>}/>
                    <Card.Header>{title}</Card.Header>
                    <Card.Meta>{album + ' - ' + artist}</Card.Meta>
                    <Image src={art_url}/>
                    {full}
                    {trailing}
                </Card.Content>
                <Card.Content extra>
                    <Button fluid positive onClick={() => this.playSong()}>Listen!</Button>
                </Card.Content>
            </Card>
        )
    }
}

export default SongCard;