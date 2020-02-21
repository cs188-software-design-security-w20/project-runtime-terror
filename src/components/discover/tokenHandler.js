import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Loader } from 'semantic-ui-react'
import { updateToken } from '../../store/actions/authActions'


export class TokenHandler extends Component {

  constructor(){
    super();

    const params = this.getHashParams();
    const token = params.access_token;
    this.state = {
      token: token ? token : ''
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
        <Loader active size='massive'>Redirecting...</Loader> 
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


export default connect(mapStateToProps, mapDispatchToProps)(TokenHandler)
