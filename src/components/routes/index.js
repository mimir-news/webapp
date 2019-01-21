import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignupContainer from '../../scenes/signup';
import LoginContainer from '../../scenes/login';
import AppRoutesContainer from './appRoutesContainer';

const Routes = () => (
    <Switch>
        <Route path="/signup" component={SignupContainer} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/" component={AppRoutesContainer} />
    </Switch>
);

export default Routes;