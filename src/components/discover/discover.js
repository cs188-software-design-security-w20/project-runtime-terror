import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import filler from '../layout/filler'

export class Discover extends Component {
  render() {
    return (
      <div>
        <Container text>
          <h1>Discover</h1>
          {filler}
        </Container>
      </div>
    )
  }
}

export default Discover