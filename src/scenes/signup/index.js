import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { createNewUser } from '../../services/auth';
import Signup from './component';

class SignupContainer extends Component {
    state = {
        error: null
    };

    submitNewUser = async (email, password, repeatPassword) => {
        const { error } = await createNewUser(email, password, repeatPassword);
        this.setState({ error });
        if (error) {
            return;
        }

        this.props.history.replace("/");
    };

    render() {
        return (
            <Signup error={this.state.error} submitNewUser={this.submitNewUser} />
        )
    }
};

export default withRouter(SignupContainer);