import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignupContainer from '../../scenes/signup';
import LoginContainer from '../../scenes/login';
import AppRoutes from './appRoutes';

const Routes = () => (
    <Switch>
        <Route path="/signup" component={SignupContainer} />
        <Route path="/login" component={LoginContainer} />
        <Route path="/" component={AppRoutes} />
    </Switch>
);

export default Routes;