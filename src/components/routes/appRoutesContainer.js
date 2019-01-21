import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isLoggedIn, getUserId, loadAnonymousUser } from '../../services/auth';
import { fetchUser, loadUser } from '../../state/user';
import AppRoutes from './appRoutes';

class AppRoutesContainer extends Component {
    componentDidMount() {
        const { fetchUser, loadUser } = this.props.actions;
        if (isLoggedIn()) {
            const userId = getUserId();
            fetchUser(userId);
        } else {
            const user = loadAnonymousUser();
            console.log(user);
            loadUser(user);
        }
    };

    render() {
        return (
            <AppRoutes />
        )
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        fetchUser,
        loadUser
    }, dispatch)
});

export default connect(
    state => ({}),
    dispatch => mapDispatchToProps(dispatch)
)(AppRoutesContainer);