import React from 'react';
import {getHeaders} from './utils';

class LikeButton extends React.Component {  

    constructor(props) {
        super(props);
        this.toggleLike = this.toggleLike.bind(this);
        this.like = this.like.bind(this);
        this.unlike = this.unlike.bind(this);
        this.state = {
            likeId: this.props.likeId
        };
    }

    toggleLike(ev) {
        if (this.state.likeId) {
            console.log('unlike');
            this.unlike();
        } else {
            console.log('like');
            this.like();
        }
    }

    like() {
        // console.log('code to like the post');
        // issue fetch request and then afterwards requery for the post:
        const postData = {"post_id": this.props.postId};
        fetch(`/api/posts/likes`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(data => this.setState({likeId: Number(data.id)}))
        this.props.requeryPost();
    }

    unlike() {
        // console.log('code to unlike the post');
        // issue fetch request and then afterwards requery for the post:
        fetch(`/api/posts/likes/${this.state.likeId}`, {
            method: "DELETE",
            headers: getHeaders(),
        })
            .then(response => response.json())
            .then(data => this.setState({likeId: null}))
        this.props.requeryPost();
    }

    render () {
        const likeId = this.state.likeId;
        return (
            <button role="switch"
                // className="like" 
                aria-label="Like Button" 
                aria-checked={likeId ? true : false}
                onClick={this.toggleLike}>
                <i className={likeId ? 'fas fa-heart' : 'far fa-heart'}></i>                        
            </button>
        ) 
    }
}

export default LikeButton;