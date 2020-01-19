import React, { Component } from 'react'
import filler from './layout/filler'

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        {filler}
      </div>
    )
  }
}

export default Home
