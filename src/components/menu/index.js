import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu } from 'antd';

class SideMenu extends Component {
    navigate = route => {
        this.props.history.push(route);
    }

    render() {
        return (
            <Menu
                style={{ minHeight: "100vh" }}
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="light">
                <Menu.Item key="1" onClick={() => this.navigate("/")}>
                    Watchlists
                </Menu.Item>
                <Menu.Item key="2">
                    News
                </Menu.Item>
                <Menu.Item key="3">
                    Price
                </Menu.Item>
                <Menu.Item key="4" onClick={() => this.navigate("/health")}>
                    Health
                </Menu.Item>
                <Menu.Item key="5" onClick={() => this.navigate("/signup")}>
                    Settings
                </Menu.Item>
            </Menu>
        )
    }
}

export default withRouter(SideMenu);