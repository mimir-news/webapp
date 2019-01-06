import React, { Component } from 'react';
import { Card, Input, Button } from 'antd';
import AuthLayout from '../../components/auth/authLayout';
import AuthError from '../../components/auth/error';

class Signup extends Component {
    state = {
        email: null,
        password: null,
        passwordRepeat: null
    };

    updateEmail = event => {
        this.setState({ email: event.target.value });
    };

    updatePassword = event => {
        this.setState({ password: event.target.value });
    };

    updatePasswordRepeat = event => {
        this.setState({ passwordRepeat: event.target.value });
    };

    submit = event => {
        const { email, password, passwordRepeat } = this.state;
        this.setState({ loading: true });
        this.props.submitNewUser(email, password, passwordRepeat);
    }

    render() {
        const { email, password, passwordRepeat, loading } = this.state;
        const { error } = this.props;
        return (
            <AuthLayout linkRoute="/login" linkText="Login">
                <Card>
                    <h2>Sign Up</h2>
                    <div className="auth-form-input">
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={this.updateEmail}
                        />
                    </div>
                    <div className="auth-form-input">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={this.updatePassword}
                        />
                    </div>
                    <div className="auth-form-input">
                        <Input
                            type="password"
                            placeholder="Repeat Password"
                            value={passwordRepeat}
                            onChange={this.updatePasswordRepeat}
                        />
                    </div>
                    <Button
                        type="primary" block
                        onClick={this.submit}
                        loading={!this.props.error && loading}>
                        Sign Up
                    </Button>
                    {(error) ? <AuthError message={error} /> : <div />}
                </Card>
            </AuthLayout>
        );
    };
};

export default Signup;