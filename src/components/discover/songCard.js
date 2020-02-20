import React, { Component } from 'react';
import { Card, Button, Image, Icon, Popup } from 'semantic-ui-react'


const timeoutLength = 1500

class SongCard extends Component {

    state = { isOpen: false }

    handleOpen = () => {
        this.setState({ isOpen: true })

        this.timeout = setTimeout(() => {
        this.setState({ isOpen: false })
        }, timeoutLength)
    }

    handleClose = () => {
        this.setState({ isOpen: false })
        clearTimeout(this.timeout)
    }

    playSong(){
        // TODO: start song on player
        let { _token, url, uri, deviceid, type, account_type } = this.props;

        if (account_type === 'premium') {          
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
            if(type === "album" || type === "artist" || type === "playlist"){
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
        } else if (account_type === 'free') {
            window.open(url, '_blank noreferrer noopener')
        }        
    }

    makePost = () => {
        let { create_url } = this.props;
        window.location.href = create_url;
    }

    render() {
        let { title, artist, album, art_url, type, account_type, player_connected } = this.props;

        const listen_button = (account_type === 'premium' && !player_connected) ? 
            <Popup
            trigger={<Button fluid basic color='green'>Listen!</Button>}
            content={'Please launch Web Player first!'}
            on='click'
            open={this.state.isOpen}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            position='bottom center'
            /> :
            <Button fluid positive onClick={() => this.playSong()}>Listen!</Button>

        return (
            <Card centered raised>
                <Card.Content>
                    {type === 'track' ? <Popup content='Create a post' position='top center' trigger={<Button floated='right' icon='plus' onClick={this.makePost}/>}/> : null}
                    <Card.Header>{title}</Card.Header>
                    <Card.Meta>{album + ' - ' + artist}</Card.Meta>
                    <Image src={art_url}/>
                </Card.Content>
                <Card.Content extra>
                    {listen_button}
                </Card.Content>
            </Card>
        )
    }
}

export default SongCard;