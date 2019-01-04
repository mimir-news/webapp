import {
    makeGetRequest,
    createNewsUrl,
    createStockUrl,
    createDirectoryUrl
} from '../../services/api';

export const healthCheckNewsBackend = async () => await healthCheckBackend(createNewsUrl("health"));
export const healthCheckStockBackend = async () => await healthCheckBackend(createStockUrl("health"));
export const healthCheckDirectoryBackend = async () => await healthCheckBackend(createDirectoryUrl("health"));

const healthCheckBackend = async url => {
    const { response, error } = await makeGetRequest({ url, useAuth: false });
    if (error) {
        console.error(error);
        return false;
    }

    console.log(`Health ok for url=${url} response=${JSON.stringify(response)}`);
    return true;
}