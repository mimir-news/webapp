import React from 'react';
import { Link } from 'react-router-dom';
import "./authLayout.css";

const AuthLayout = ({ linkRoute, linkText, children }) => (
    <div className="AuthLayout">
        <h1 className="LogoText">mimir</h1>
        <div className="AuthForm">
            {children}
        </div>
        <Link className="AuthLink" to={linkRoute} replace>
            {linkText}
        </Link>
    </div >
);

export default AuthLayout;