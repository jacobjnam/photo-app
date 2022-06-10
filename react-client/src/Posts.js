import React from 'react';
import Post from './Post.js';
import {getHeaders} from './utils';

class Posts extends React.Component {
  
    constructor(props) {
        super(props);
        // initialization code here
        this.state = { posts: [] };
        this.fetchPosts = this.fetchPosts.bind(this);
    }

    fetchPosts() {
        fetch('/api/posts', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(data => {
                this.setState({posts: data});
            })
    }

    componentDidMount() {
        // fetch posts and then set the state...
        this.fetchPosts();
    }

    render () {
        if (!this.state.posts) {
            return (
                <div>Loading posts...</div>
            );
        }

        var post_array = [];
        this.state.posts.map(post => {
            post_array.push(<Post post={post} key={'post-' + post.id} />);
        });
        return (
            <div>
                {post_array}
            </div>
        );
    }
}

export default Posts;