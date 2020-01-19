import React, { Component } from 'react'
import SideNavbar from '../sideNavbar'
import {Header, Image, Segment} from 'semantic-ui-react'

export class Home extends Component {
  render() {
    return (
      <div>
        <SideNavbar content={<Segment basic><Header as='h3'>Application Content</Header><Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /><Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /></Segment>}/>
      </div>
    )
  }
}

export default Home
