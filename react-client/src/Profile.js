import React from 'react';

class Profile extends React.Component {  

    constructor(props) {
        super(props);
        // constructor logic
        console.log('Profile component created');
    }

    componentDidMount() {
        // fetch posts
        console.log('Profile component mounted');
    }

    render () {
        return (
            <div id="user-profile">
                <img src={ this.props.currentUser.thumb_url } alt="Current user profile picture"/>
                <h2>{ this.props.currentUser.username }</h2>
            </div>
        );
    }
}

export default Profile;