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

    return { error };
};

const handleFailureResponse = (options, headers, error) => {
    const { data, status } = error.response;
    if (status === 503) {
        return retryRequest(options, headers, status);
    }

    return { error: new Error(data) };
};

const retryRequest = async (options, headers, status) => {
    const { url, retries = MAX_RETRIES } = options;
    const retryNo = MAX_RETRIES - retries + 1;
    if (retryNo === MAX_RETRIES) {
        const requestId = getRequestId(headers);
        return { error: new Error(`Max retries reached. url=${url} requestId=${requestId}`) };
    }

    console.log(`Request failed retrying. requestId: ${getRequestId(headers)}`);
    const delayFactor = (status === 503) ? retryNo * 2 : retryNo
    await sleep(RETRY_DELAY_MS * delayFactor);
    return makeRequest({ ...options, headers, retries: (retries - 1) });
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

const computeTimeout = retriesLeft => (retriesLeft)
    ? (MAX_RETRIES - retriesLeft) * RETRY_DELAY_MS + TIMEOUT_MS
    : TIMEOUT_MS;