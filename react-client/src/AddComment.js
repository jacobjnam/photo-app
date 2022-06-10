import React from 'react';
import {getHeaders} from './utils';

class AddComment extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            post: this.props.post
        }
        this.postComment = this.postComment.bind(this);
    } 

    postComment () {
        const comment = document.getElementById(`add_comment_${this.state.post.id}`).value;
        const postData = {
            "post_id": this.state.post.id,
            "text": comment
        };
        fetch(`/api/comments`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.props.requeryPost();
            })
        // this.props.requeryPost();
    }

    render () {
        return (
            <div className="post-footer">
                <div className="post-footer-comment">
                    <button><i className="far fa-smile"></i></button>
                    <input type="text" placeholder="Add a comment..." id={`add_comment_` + this.state.post.id}/>
                </div>
                <button className="post-comment-button" id={`post_comment_` + this.state.post.id} onClick={this.postComment}>Post</button>
            </div>
        );
    }
}

export default AddComment;