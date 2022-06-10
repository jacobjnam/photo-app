import React from 'react';
import { getHeaders } from './utils';

class Stories extends React.Component {  

    constructor(props) {
        super(props);
        // constructor logic
        console.log('Stories component created');
        this.state = { stories: [] };
        this.fetchStories = this.fetchStories.bind(this);
    }

    fetchStories() {
        fetch('/api/stories', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(data => {
                this.setState({stories: data});
            })
    }

    componentDidMount() {
        // fetch posts
        console.log('Stories component mounted');
        this.fetchStories();
    }

    render () {
        var story_array = []
        this.state.stories.map(story => {
            story_array.push(<div><img src={ story.user.thumb_url } className="pic"/><p>{ story.user.username }</p></div>)
        });
        return (
            <header className="stories">
                {story_array}
            </header>
        );
    }
}

export default Stories;