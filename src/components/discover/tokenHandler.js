import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Loader, Header, Icon, Divider } from 'semantic-ui-react'
import { updateToken } from '../../store/actions/authActions'


export class TokenHandler extends Component {

  constructor(){
    super();

    const params = this.getHashParams();
    const token = params.access_token;
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error')
    this.state = {
      token: token ? token : '',
      error: error ? error : ''
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

  componentDidMount() {
    if (!this.state.error)
      this.handleToken()
  }

  handleToken() {
    if (this.props.auth && !this.props.auth.isEmpty && this.state.token !== '') {
      this.props.updateToken(this.props.auth.uid, this.state.token, () => 
        this.props.history.push("/discover")
      )
    }
  }

  render() {
    return (
      <div className='fullsize_div'>
        { this.state.error ? 
          <Header as='h2' icon textAlign='center'>
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
            <Icon name='exclamation triangle' />
            An access error occured
          </Header>
          :
          <Loader active size='massive'>Redirecting...</Loader>
        }
         
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
    updateToken: (uId, token, callback) => dispatch(updateToken(uId, token, callback))
  }
}


export function redirectUrlToSpotifyForLogin() {
	const CLIENT_ID = '1811b81e027e4dd291a2505a456b74e8'
  const REDIRECT_URI = 
    process.env.NODE_ENV === "production"
    ? 'https://princes25.github.io/Mutter/tokenhandler'
    : 'http://localhost:3000/tokenhandler';

	const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'app-remote-control',
    'user-read-recently-played',
    'user-top-read',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming'
  ];
  
	return (
		"https://accounts.spotify.com/authorize?client_id=" +
		CLIENT_ID +
		"&redirect_uri=" +
		encodeURIComponent(REDIRECT_URI) +
		"&scope=" +
		encodeURIComponent(scopes.join(" ")) +
    "&response_type=token"
	);
}


export default connect(mapStateToProps, mapDispatchToProps)(TokenHandler)
