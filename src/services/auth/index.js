import { makePostRequest, makePutRequest, makeGetRequest, createDirectoryUrl } from '../api';
import { TIMEOUT_MS, AUTH_TOKEN_KEY } from '../api/constants';

const AUTH_TIMEOUT = TIMEOUT_MS * 5;
const REFRESH_TOKEN_KEY = "refreshToken"
const USER_KEY = "user";
const USER_ID_KEY = `${USER_KEY}Id`;
const ROLE_KEY = `${USER_KEY}Role`;

export const createNewUser = async (email, password, repeat) => {
    const { error } = credentialsOk(email, password, repeat, true);
    if (error) {
        return { error };
    }

    const { error: userErr, status } = await makePostRequest({
        url: createDirectoryUrl("v1/users"),
        body: { email, password, repeat },
        useAuth: false,
        timeout: AUTH_TIMEOUT,
        retryOnFailure: false
    });

    if (userErr) {
        return handleSignupError(userErr, status);
    }

    return login(email, password);
};

export const getUserId = () => localStorage.getItem(USER_ID_KEY);

const handleSignupError = (error, status) => {
    logError(error);
    if (status === 409) {
        return { error: "A user with that email already exists" }
    }
    return { error: "Signup failed." };
}

export const login = async (email, password) => {
    const { error: credentialsError } = credentialsOk(email, password);
    if (credentialsError) {
        return { error: credentialsError };
    };

    const { response, error } = await makePostRequest({
        url: createDirectoryUrl("v1/login"),
        body: { email, password },
        useAuth: false,
        timeout: AUTH_TIMEOUT,
        retryOnFailure: false
    });

    if (error) {
        logError(error)
        return { error: "Email and password does not match." };
    };

    const { user, token, refreshToken } = response;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_ID_KEY, user.id);
    localStorage.setItem(ROLE_KEY, user.role);
    return { user };
}

export const getAnonymousTokenIfNotLoggedIn = async () => {
    if (isLoggedIn()) {
        console.log("Already logged in");
        return;
    }

    const { user, error } = await getAnonymousToken();
    if (error) {
        console.error(error);
        await sleep(1000);
        getAnonymousTokenIfNotLoggedIn();
    }

    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const getAnonymousToken = async () => {
    const { response, error } = await makeGetRequest({
        url: createDirectoryUrl("v1/login/anonymous"),
        useAuth: false,
        timeout: AUTH_TIMEOUT,
        retryOnFailure: false
    });

    if (error) {
        logError(error)
        return { error: "Failed to retrive anonymous token" };
    };

    const { user, token } = response;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, user.role);
    return { user };
}

export const refreshToken = async () => {
    const { response, error } = await makePutRequest({
        url: createDirectoryUrl("v1/login"),
        body: getRefreshBody(),
        useAuth: false,
        timeout: AUTH_TIMEOUT,
        retryOnFailure: false
    });

    if (error) {
        logError(error)
        return { error: "Failed to retrive refresh token" };
    };

    const { user, token, refreshToken } = response;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(ROLE_KEY, user.role);
    return { user };
}

export const isLoggedIn = () => localStorage.getItem(ROLE_KEY) === "USER";

export const loadAnonymousUser = () => JSON.parse(localStorage.getItem(USER_KEY))

const getRefreshBody = () => ({
    token: localStorage.getItem(AUTH_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY)
});

const logError = error => {
    console.log(JSON.stringify(error));
}

const credentialsOk = (email, password, repeat, checkRepeat = false) => {
    if (!emailIsValid(email)) {
        return { ok: false, error: "Invalid email" };
    }

    return (checkRepeat)
        ? passwordOk(email, password, repeat)
        : passwordLengthOk(password);
}

const passwordOk = (email, password, repeat) => {
    const { error } = passwordLengthOk(password);
    if (error) {
        return { error };
    }

    if (password === email) {
        return { error: "Passwords cannot be the same as email." };
    }

    if (password !== repeat) {
        return { error: "Passwords do not match." };
    }

    if (passwordIsCommon(password)) {
        return { error: "The given password is to weak." };
    }

    return { error: null };
};

const passwordLengthOk = password => {
    if (!password) {
        return { error: "Password cant be empty." };
    };

    if (password.length < 10) {
        return { error: "Password must be at least 10 characters." };
    };

    return { error: null };
};

const emailIsValid = email => {
    if (!email) {
        return false;
    }

    return true;
}

const passwordIsCommon = password => {
    return password === "password123";
};

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));