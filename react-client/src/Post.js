import React from 'react';
import LikeButton from './LikeButton.js';
import BookmarkButton from './BookmarkButton.js';
import AddComment from './AddComment.js';
import {getHeaders} from './utils';

class Post extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            post: this.props.post
        }
        this.requeryPost = this.requeryPost.bind(this);
    }

    requeryPost() {
        fetch(`/api/posts/${this.state.post.id}`, {
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                this.setState({ 
                    post: data
                });
            });
    }
    
    render () {
        const post = this.state.post;
        if (!post) {
            return (
                <div></div>  
            );
        }

        var comment = [];
        if (post.comments.length > 1) {
            comment.push(<button href="" className="view-all-comments">View all { post.comments.length } comments</button>);
        }
        if (post.comments.length > 0) {
            comment.push(<div className="post-comment"><p><b>{ post.comments[post.comments.length-1].user.username }</b> { post.comments[post.comments.length-1].text }</p></div>);
        }
        
        return (
            <section id={'post_' + post.id} className="card">
                <div className="post-header">
                    <p className="post-username">{ post.user.username }</p>
                    <button><i className="fa fa-ellipsis-h"></i></button>
                </div>
                <img src={ post.image_url } alt=""/>
                <div className="post-buttons">
                    <div className="post-buttons-left">
                        <LikeButton postId={post.id} likeId={post.current_user_like_id} requeryPost={this.requeryPost} />
                        <button><i className="far fa-comment"></i></button>
                        <button><i className="far fa-paper-plane"></i></button>
                    </div>
                    <BookmarkButton postId={post.id} bookmarkId={post.current_user_bookmark_id} requeryPost={this.requeryPost} />
                </div>
                <div className="post-body">
                    <p className="post-likes"><b>{ post.likes.length } likes</b></p>
                    <div className="post-user-info">
                        <b>{ post.user.username }</b> { post.caption }
                    </div>
                    {/* ${ renderComments(post) } */}
                    {comment}
                    <p className="post-date">{ post.display_time }</p>
                </div>
                <AddComment post={post} requeryPost={this.requeryPost}/>
                {/* <div className="post-footer">
                    <div className="post-footer-comment">
                        <button><i className="far fa-smile"></i></button>
                        <input type="text" placeholder="Add a comment..." id="add_comment_${post.id}"/>
                    </div>
                    <button className="post-comment-button" id="post_comment_${post.id}" onclick="addComment(${post.id}, document.getElementById('add_comment_${post.id}').value);">Post</button>
                </div> */}
            </section>
        );     
    }
}

export default Post;