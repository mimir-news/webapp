import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { login } from '../../services/auth';
import Login from './component';

class LoginContainer extends Component {
    state = {
        error: null
    };

    loginUser = async (email, password) => {
        const { error } = await login(email, password);
        this.setState({ error });
        if (error) {
            return;
        }

        this.props.history.replace("/");
    };

    render() {
        return (
            <Login error={this.state.error} loginUser={this.loginUser} />
        )
    }
};

export default withRouter(LoginContainer);