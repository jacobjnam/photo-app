import React from 'react';
import {getHeaders} from './utils';

class BookmarkButton extends React.Component {  

    constructor(props) {
        super(props);
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.bookmark = this.bookmark.bind(this);
        this.unbookmark = this.unbookmark.bind(this);
        this.state = {
            bookmarkId: this.props.bookmarkId
        };
    }

    toggleBookmark(ev) {
        if (this.state.bookmarkId) {
            console.log('unbookmark');
            this.unbookmark();
        } else {
            console.log('bookmark');
            this.bookmark();
        }
    }

    bookmark() {
        // console.log('bookmark!');
        // issue fetch request and then afterwards requery for the post:
        const postData = {"post_id": this.props.postId};
        fetch(`/api/bookmarks`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(postData)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({bookmarkId: Number(data.id)});
            })
        this.props.requeryPost();
    }

    unbookmark() {
        // console.log('unbookmark!');
        // issue fetch request and then afterwards requery for the post:
        fetch(`/api/bookmarks/${this.state.bookmarkId}`, {
            method: "DELETE",
            headers: getHeaders(),
            })
            .then(response => response.json())
            .then(data => this.setState({bookmarkId: null}))
        this.props.requeryPost();
    }

    render () {
        const bookmarkId = this.state.bookmarkId;
        return (
            <button role="switch"
                aria-label="Bookmark Button" 
                aria-checked={bookmarkId ? true : false}
                onClick={this.toggleBookmark}>
                <i className={bookmarkId ? 'fas fa-bookmark' : 'far fa-bookmark'}></i>                        
            </button>
        ) 
    }
}

export default BookmarkButton;