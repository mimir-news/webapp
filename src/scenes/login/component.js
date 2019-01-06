import React, { Component } from 'react';
import { Card, Input, Button } from 'antd';
import AuthLayout from '../../components/auth/authLayout';
import AuthError from '../../components/auth/error';

class Login extends Component {
    state = {
        email: null,
        password: null
    };

    updateEmail = event => {
        this.setState({ email: event.target.value });
    };

    updatePassword = event => {
        this.setState({ password: event.target.value });
    };

    submit = event => {
        const { email, password, passwordRepeat } = this.state;
        this.setState({ loading: true });
        this.props.loginUser(email, password, passwordRepeat);
    }

    render() {
        const { email, password, loading } = this.state;
        const { error } = this.props;
        return (
            <AuthLayout linkRoute="/signup" linkText="Sign Up">
                <Card>
                    <h2>Login</h2>
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
                    <Button
                        type="primary" block
                        onClick={this.submit}
                        loading={!this.props.error && loading}>
                        Login
                    </Button>
                    {(error) ? <AuthError message={error} /> : <div />}
                </Card>
            </AuthLayout>
        );
    };
};

export default Login;