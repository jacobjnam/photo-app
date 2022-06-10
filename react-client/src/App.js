import './starter-client.css';
import React from 'react';
import NavBar from './NavBar';
import Profile from './Profile';
import Stories from './Stories';
import Suggestions from './Suggestions';
import Posts from './Posts';
import {getHeaders} from './utils';

/* TODO: Break up the HTML below into a series of React components. */
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: {}
        };
        console.log('App component created');
        this.getProfile();
    }

    getProfile() {
        fetch('http://127.0.0.1:5000/api/profile', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    currentUser: data
                })
            })
    }

    render () {
        return (
            <div>

            {/* <nav className="main-nav">
                <h1>Photo App</h1>
            </nav> */}
                <NavBar title="Photo App" username={this.state.currentUser.username} />

                <aside>
                    <Profile currentUser={this.state.currentUser}/>
                    {/* <div className="suggestions">
                        <p className="suggestion-text">Suggestions for you</p>
                        <div>
                            Suggestions
                        </div>
                    </div> */}
                    <Suggestions />
                </aside>

                <main className="content">
                    <Stories />
                    <div id="posts">
                        <Posts />
                    </div>
                </main>

            </div>
        );
    }
}

export default App;