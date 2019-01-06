import uuid from 'uuid/v4';
import axios from 'axios';
import {
    NEWS_BACKEND,
    STOCK_BACKEND,
    DIRECTORY_BACKEND,
    RETRY_DELAY_MS,
    TIMEOUT_MS
} from './constants';

export const makeGetRequest = options => makeRequest({
    ...options,
    method: "get"
});

export const makePostRequest = options => makeRequest({
    ...options,
    method: "post"
});

export const makePutRequest = options => makeRequest({
    ...options,
    method: "put"
});

export const makeDeleteRequest = options => makeRequest({
    ...options,
    method: "delete"
});

export const makeRequest = async options => {
    const { url, useAuth, method = "get", body = null, headers = null, timeout = TIMEOUT_MS } = options;
    const requestHeaders = (headers) ? headers : createHeaders(useAuth);
    try {
        const { data, status } = await axios({
            method,
            url,
            timeout,
            data: body,
            headers: requestHeaders
        });
        return { response: data, error: null, status };
    } catch (error) {
        return handleRequestFailure(options, requestHeaders, error);
    }
}

export const createNewsUrl = route => `${NEWS_BACKEND}/${route}`;
export const createStockUrl = route => `${STOCK_BACKEND}/${route}`;
export const createDirectoryUrl = route => `${DIRECTORY_BACKEND}/${route}`;

const handleRequestFailure = (options, headers, error) => {
    if (error.response) {
        return handleFailureResponse(options, headers, error);
    } else if (error.request) {
        return retryRequest(options, headers);
    }

    return { error, status: 503 };
};

const handleFailureResponse = (options, headers, error) => {
    const { data, status } = error.response;
    if (status === 503) {
        return retryRequest(options, headers, status);
    }

    return { error: new Error(data), status };
};

const retryRequest = async (options, headers, status) => {
    const { url, timeout = TIMEOUT_MS, retryOnFailure = true } = options;
    const requestId = getRequestId(headers);
    if (!retryOnFailure) {
        return {
            error: new Error(`Max retries reached. url=${url} requestId=${requestId}`),
            status: 503,
        };
    }

    console.log(`Request failed, retrying. requestId: ${requestId}`);
    const delay = RETRY_DELAY_MS * ((status === 503) ? 2 : 1);
    await sleep(delay);
    return makeRequest({ ...options, headers, timeout: (timeout + delay), retryOnFailure: false });
};

const createHeaders = (useAuth = true) => {
    const baseHeaders = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Client-ID": getClientId(),
        "X-Request-ID": uuid(),
    };

    return (useAuth)
        ? { "Authorization": `Bearer ${localStorage.authToken}`, ...baseHeaders }
        : baseHeaders;
};

const getClientId = () => {
    let clientId = localStorage.clientId;
    if (!clientId) {
        clientId = uuid();
        localStorage.setItem("clientId", clientId);
    }

    return clientId;
};

const getRequestId = headers => headers["X-Request-ID"];

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));