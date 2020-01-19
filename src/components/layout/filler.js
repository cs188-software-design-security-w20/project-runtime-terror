import React from 'react'
import {Segment, Header, Image} from 'semantic-ui-react'

const filler = () => {
    return (
        <Segment basic>
            <Header as='h3'>Application Content</Header>
            <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
        </Segment>
    )
}

export default filler()