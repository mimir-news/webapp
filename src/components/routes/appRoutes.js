import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';
import BackendHealth from '../../scenes/backendHealth';
import WatchlistContainer from '../../scenes/watchlist';
import SideMenu from '../menu';
const { Content, Sider } = Layout

const AppRoutes = () => (
    <Layout className="AppLayout">
        <Sider>
            <SideMenu />
        </Sider>
        <Layout>
            <Content>
                <Route path="/" exact component={WatchlistContainer} />
                <Route path="/health" component={BackendHealth} />
            </Content>
        </Layout>
    </Layout>
);

export default AppRoutes;