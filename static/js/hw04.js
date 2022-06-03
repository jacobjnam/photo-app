const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

const profile2Html = current_user => {
    return `
        <div id="current-user">
            <img src="${ current_user.thumb_url }" alt="Current user profile picture">
            <h2>${ current_user.username }</h2>
        </div>
    `;
};

const renderFollowUserButton = suggested_user => {
    return `
        <button
            aria-label="Follow / Unfollow"
            aria-checked="false"
            onclick="followUser(event);">
            follow
        </button>`;
};

const suggestion2Html = suggestion => {
    return `
        <div class="suggestion-card">
            <img src="${ suggestion.thumb_url }" alt="${ suggestion.username }'s profile picture">
            <div class="suggested-user">
                <p class="suggested-username">${ suggestion.username }</p>
                <p class="suggested-for-you"> suggested for you</p>
            </div>
            ${ renderFollowUserButton(suggestion) }
            <button onclick="followUser(${suggestion});">follow</button>
        </div>
    `;
};

const renderLikePost = post => {
    if (post.current_user_like_id) {
        return `
            <button
                data-post-id="${post.id}"
                data-like-id="${post.current_user_like_id}"
                aria-label="Like / Unlike"
                aria-checked="true"
                onclick="handleLike(event);"
                <i class="fas fa-heart" style="color:red"></i>
            </button>`;
    } else {
        return `
            <button
                data-post-id="${post.id}"
                aria-label="Like / Unlike"
                aria-checked="false"
                onclick="handleLike(event);"
                <i class="far fa-heart"></i>
            </button>`;
    }
}

const renderBookmarkPost = post => {
    if (post.current_user_bookmark_id) {
        return `
            <button
                data-post-id="${post.id}"
                data-bookmark-id="${post.current_user_bookmark_id}"
                aria-label="Bookmark / Unbookmark"
                aria-checked="true"
                onclick="handleBookmark(event);"
                <i class="fas fa-bookmark"></i>
            </button>`;
    } else {
        return `
            <button
                data-post-id="${post.id}"
                aria-label="Bookmark / Unbookmark"
                aria-checked="false"
                onclick="handleBookmark(event);"
                <i class="far fa-bookmark"></i>
            </button>`;
    }
};

const renderComments = post => {
    var comment = ``;
    if (post.comments.length > 1) {
        comment += `<button href="" class="view-all-comments" onclick="showAllComments(event);">View all ${ post.comments.length } comments</button>`;
    }
    if (post.comments.length > 0) {
        comment += `
            <div class="post-comment">
                <p><b>${ post.comments[comments.length-1].user.username }</b> ${ post.comments[comments.length-1].text }</p>
            </div>
        `;
    }

    return comment;
};

const addComment = (postId, text) => {
    // console.log("add comment");
    const commentData = {
        "post_id": postId,
        "text": text
    };
    fetch("/api/comments", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            redrawPost(postId);
        });
};

const post2Html = post => {
    return `
    <section id="post_${post.id}" class="card">
        <div class="post-header">
            <p class="post-username">${ post.user.username }</p>
            <!-- POST OPTIONS HERE (the ... button) -->
            <button><i class="fa fa-ellipsis-h"></i></button>
        </div>
        <img src="${ post.image_url }" alt="">
        <div class="post-buttons">
            <!-- ICONS HERE -->
            <div class="post-buttons-left">
                ${ renderLikePost(post) }
                <button><i class="far fa-comment"></i></button>
                <button><i class="far fa-paper-plane"></i></button>
            </div>
            ${ renderBookmarkPost(post) }
        </div>
        <div class="post-body">
            <p class="post-likes"><b>${ post.likes.length } likes</b></p>
            <div class="post-user-info">
                <!-- USERNAME, CAPTION, "more" BUTTON HERE -->
                <p><b>${ post.user.username }</b> ${ post.caption }... <!-- <a class="expand-text" href="">more</a></p> -->
            </div>
            ${ renderComments(post) }
            <p class="post-date">${ post.display_time }</p>
        </div>
        <div class="post-footer">
            <div class="post-footer-comment">
                <button><i class="far fa-smile"></i></button>
                <input type="text" placeholder="Add a comment..." id="add_comment_${post.id}"></p>
            </div>
            <button class="post-comment-button" id="post_comment_${post.id}" onclick="addComment(${post.id}, document.getElementById('add_comment_${post.id}').value);">Post</button>
        </div>
    </section>
    `;
};

const stringToHTML = htmlString => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstChild;
}

const redrawPost = postId => {
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(updatedPost => {
            const html = post2Html(updatedPost);
            const postHTML = stringToHTML(html);
            const postElement = document.querySelector(`#post_${postId}`);
            postElement.innerHTML = postHTML.innerHTML;
        })
};

const handleLike = ev => {
    // if aria-checked == 'true': delete Like object
    // else: issue a POST request to create Like object
    // console.log("Handle like functionality"); 
    const likeButton = ev.currentTarget;
    const postId = Number(likeButton.dataset.postId);
    if (likeButton.getAttribute('aria-checked') === 'true') {
        console.log('unlike post');
        fetch(`/api/posts/likes/${likeButton.dataset.likeId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // here is where we ask to redraw the post
            redrawPost(postId);
        })
        likeButton.setAttribute('aria-checked', 'false');
    }
    else {
        console.log('like post');
        const postData = {
            "post_id": postId
        };
        fetch(`/api/posts/likes/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // here is where we ask to redraw the post
            redrawPost(postId);
        });
        likeButton.setAttribute('aria-checked', 'true');
    }
};

const handleBookmark = ev => {
        // if aria-checked == 'true': delete Like object
    // else: issue a POST request to create Like object
    // console.log("Handle like functionality"); 
    const bookmarkButton = ev.currentTarget;
    const postId = Number(bookmarkButton.dataset.postId);
    if (bookmarkButton.getAttribute('aria-checked') === 'true') {
        console.log('unbookmark post');
        fetch(`/api/bookmarks/${bookmarkButton.dataset.bookmarkId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRF-TOKEN': getCookie('csrf_access_token')
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // here is where we ask to redraw the post
            redrawPost(postId);
        })
        bookmarkButton.setAttribute('aria-checked', 'false');
    }
    else {
        console.log('bookmark post');
        const postData = {
            "post_id": postId
        };
        fetch(`/api/bookmarks/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRF-TOKEN': getCookie('csrf_access_token')
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // here is where we ask to redraw the post
            redrawPost(postId);
        });
        bookmarkButton.setAttribute('aria-checked', 'true');
    }
};

// fetch data from your API endpoint:
const getCookie = key => {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    console.log(decodedCookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        console.log(c);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};


const displayStories = () => {
    fetch('/api/stories', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const displayCurrentUserProfile = () => {
    fetch('/api/profile', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
        .then(response => response.json())
        .then(current_user => {
            const html = profile2Html(current_user);
            document.querySelector('#user-profile').innerHTML = html;
        })
};

const displaySuggestions = () => {
    fetch('/api/suggestions', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
        .then(response => response.json())
        .then(suggestions => {
            const html = suggestions.map(suggestion2Html).join('\n');
            document.querySelector('#suggestions-list').innerHTML = html;
        })
};

const displayPosts = () => {
    fetch('/api/posts', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            // 'X-CSRF-TOKEN': getCookie('csrf_access_token')
        }
    })
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            const html = posts.map(post2Html).join('\n');
            document.querySelector('#posts').innerHTML = html;
        })
};

const initPage = () => {
    displayStories();
    displayCurrentUserProfile();
    displaySuggestions();
    displayPosts();
};

// invoke init page to display stories:
initPage();