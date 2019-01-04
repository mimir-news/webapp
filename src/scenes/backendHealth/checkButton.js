import React from 'react';
import { Alert, Button } from 'antd';
import './checkButton.css';

const CheckButton = props => {
    const { status, check, name } = props;
    const isHealthy = (status && status.healthy);
    const healthComponent = (isHealthy)
        ? <Alert message="Healty" type="success" showIcon />
        : <Alert message="Unhealthy" type="error" showIcon />;

    return (
        <div>
            <Button className="health-button" type="primary" onClick={() => check()} block>{name}</Button>
            <div className="health-indicator">{(status) ? healthComponent : <div />}</div>
        </div>
    );
};

export default CheckButton;