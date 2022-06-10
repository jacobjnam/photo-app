import React from 'react';
import { getHeaders } from './utils';

class Suggestion extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            suggestion: this.props.suggestion,
            isFollow: false,
            followId: null
        }
        this.handleFollow = this.handleFollow.bind(this);
    }

    handleFollow () {
        if (this.state.isFollow) {
            console.log("unfollow!");
            fetch(`/api/following/${this.state.followId}`, {
                method: "DELETE",
                headers: getHeaders(),
            })
                .then(response => response.json())
                .then(data => this.setState({
                    isFollow: false,
                    followId: null}))
        }
        else {
            console.log("follow!");
            const postData = {"user_id": this.state.suggestion.id};
            fetch(`/api/following`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(postData)
            })
                .then(response => response.json())
                .then(data => this.setState({
                    isFollow: true,
                    followId: Number(data.id)}))
        }
    }
    
    render () {
        const suggestion = this.state.suggestion;
        if (!suggestion) {
            return (
                <div></div>  
            );
        }
        return (
            <div className="suggestion-card">
                <img src={ suggestion.thumb_url }/>
                <div className="suggested-user">
                    <p className="suggested-username">{ suggestion.username }</p>
                    <p className="suggested-for-you"> suggested for you</p>
                </div>
                <button
                    aria-label="Follow suggested user"
                    aria-checked={this.state.isFollow? true : false}
                    onClick={this.handleFollow}>
                    {this.state.isFollow? "unfollow" : "follow"}
                </button>
            </div>
        );     
    }
}

export default Suggestion;