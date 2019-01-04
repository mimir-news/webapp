import uuid from 'uuid/v4';
import axios from 'axios';
import {
    NEWS_BACKEND,
    STOCK_BACKEND,
    DIRECTORY_BACKEND,
    MAX_RETRIES,
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
    const { url, useAuth, retries, method = "get", body = null, headers = null } = options;
    const requestHeaders = (headers) ? headers : createHeaders(useAuth);
    try {
        const timeout = computeTimeout(retries);
        const { data } = await axios({ method, url, timeout, data: body, headers: requestHeaders });
        return { response: data, error: null };
    } catch (error) {
        if (error.response) {
            const { data } = error.response;
            return { error: new Error(data) };
        } else if (error.request) {
            return retryRequest(options, requestHeaders);
        }
        return { error };
    }
}

export const createNewsUrl = route => `${NEWS_BACKEND}/${route}`;
export const createStockUrl = route => `${STOCK_BACKEND}/${route}`;
export const createDirectoryUrl = route => `${DIRECTORY_BACKEND}/${route}`;

const retryRequest = async (options, headers) => {
    const { url, retries = MAX_RETRIES } = options;
    const retryNo = MAX_RETRIES - retries + 1;
    if (retryNo === MAX_RETRIES) {
        const requestId = getRequestId(headers);
        return { error: new Error(`Max retries reached. url=${url} requestId=${requestId}`) };
    }
    console.log(`Request failed retrying. requestId: ${getRequestId(headers)}`);
    await sleep(RETRY_DELAY_MS * retryNo);
    return makeRequest({ ...options, headers, retries: (retries - 1) });
}

export const createHeaders = (useAuth = true) => {
    const baseHeaders = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Client-ID": getClientId(),
        "X-Request-ID": uuid(),
    };

    return (useAuth)
        ? { "Authorization": `Bearer ${localStorage.authToken}`, ...baseHeaders }
        : baseHeaders;
}

const getClientId = () => {
    let clientId = localStorage.clientId;
    if (!clientId) {
        clientId = uuid();
        localStorage.setItem("clientId", clientId);
    }

    return clientId;
}

const getRequestId = headers => headers["X-Request-ID"];

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const computeTimeout = retriesLeft => (retriesLeft)
    ? (MAX_RETRIES - retriesLeft) * RETRY_DELAY_MS + TIMEOUT_MS
    : TIMEOUT_MS;