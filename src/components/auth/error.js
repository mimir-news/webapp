import React from 'react';
import { Alert } from 'antd';
import "./style.css";

const AuthError = props => (
    <div className="auth-form-error">
        <Alert message={props.message} type="error" showIcon />
    </div>
);

export default AuthError;