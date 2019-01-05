import React, { Component } from 'react'
import CheckButton from './checkButton';
import {
    healthCheckNewsBackend,
    healthCheckStockBackend,
    healthCheckDirectoryBackend,
} from './service';
import './index.css';

export default class BackendHealth extends Component {
    state = {
        newsHealth: null,
        stockHealth: null,
        directoryHealth: null
    };

    checkNewsBackend = async () => {
        const healthy = await healthCheckNewsBackend();
        this.setState({
            newsHealth: {
                healthy,
                checked: true
            }
        })
    }

    checkStockBackend = async () => {
        const healthy = await healthCheckStockBackend();
        this.setState({
            stockHealth: {
                healthy,
                checked: true
            }
        })
    }

    checkDirectoryBackend = async () => {
        const healthy = await healthCheckDirectoryBackend();
        this.setState({
            directoryHealth: {
                healthy,
                checked: true
            }
        })
    }

    render() {
        return (
            <div className="backend-health">
                <CheckButton name="News Backend" status={this.state.newsHealth} check={this.checkNewsBackend} />
                <CheckButton name="Stock Backend" status={this.state.stockHealth} check={this.checkStockBackend} />
                <CheckButton name="Directory Backend" status={this.state.directoryHealth} check={this.checkDirectoryBackend} />
            </div>
        )
    }
}