import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'

class songSearch extends Component {
    // TODO: Look up more about searching with Semantic-Ui
    state = {
        isLoading: false,
        results: [],
        value: ''
    }

    handleResultSearch = (e, {result}) => {
        this.setState({
            value: result.title
        })
    }

    handleSearchChange = (e, {value}) => {
        this.setState({
            isLoading: true, value
        })

        setTimeout(
            () => {
                // TODO: Fill in search information
            },
            300 // TODO: Decide on a timeout value
        )
    }

    render() {
        return (
            <Search
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={
                    _.debounce(this.handleSearchChange, 500, {
                        leading: true,
                    })
                }
                results={results}
                value={value}
                {...this.props}
            />
        )
    }
}