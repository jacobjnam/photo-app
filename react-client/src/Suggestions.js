import React from 'react';
import Suggestion from './Suggestion.js';
import {getHeaders} from './utils'

class Suggestions extends React.Component {  

    constructor(props) {
        super(props);
        // constructor logic
        console.log('Suggestions component created');
        this.state = { suggestions: [] };
        this.fetchSuggestions = this.fetchSuggestions.bind(this);
    }

    fetchSuggestions() {
        fetch('/api/suggestions', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(data => {
                this.setState({suggestions: data});
            })
    }

    componentDidMount() {
        // fetch posts
        console.log('Suggestions component mounted');
        this.fetchSuggestions();
    }

    render () {
        var suggestion_array = [];
        this.state.suggestions.map(suggestion => {
            suggestion_array.push(<Suggestion suggestion={suggestion} key={'suggestion-' + suggestion.id} />);
        });
        return (
            <div>
                {suggestion_array}
            </div>
        )
    }
}

export default Suggestions;