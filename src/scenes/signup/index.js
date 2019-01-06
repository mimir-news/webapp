import React, { Component } from 'react';
import { createNewUser } from '../../services/auth';
import Signup from './component';

export default class SignupContainer extends Component {
    state = {
        error: null
    };

    submitNewUser = async (email, password, repeatPassword) => {
        const { user, error } = await createNewUser(email, password, repeatPassword);
        this.setState({ error });
        if (error) {
            return;
        }

        console.log(user);
    };

    render() {
        return (
            <Signup error={this.state.error} submitNewUser={this.submitNewUser} />
        )
    }
};