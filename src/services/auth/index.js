import { makePostRequest, createDirectoryUrl } from '../api';
import { TIMEOUT_MS } from '../api/constants';

const AUTH_TIMEOUT = TIMEOUT_MS * 2;

export const createNewUser = async (email, password, repeat) => {
    const { ok, error } = passwordOk(password, repeat);
    if (!ok) {
        return { error };
    }

    const url = createDirectoryUrl("v1/users");
    const body = { email, password, repeat };
    const { error: userErr } = await makePostRequest({ url, body, useAuth: false, timeout: AUTH_TIMEOUT });
    if (userErr) {
        logError(error);
        return { error: "A user with that email already exists" };
    }

    const loginResult = await login(email, password);
    return loginResult;
};

export const login = async (email, password) => {
    const url = createDirectoryUrl("v1/login");
    const body = { email, password };
    const { response, error } = await makePostRequest({ url, body, useAuth: false, timeout: AUTH_TIMEOUT });
    if (error) {
        logError(error)
        return { error: "Login failed" };
    }

    const { user, token } = response;
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", user.id);
    return { user };
}

const logError = error => {
    console.log(JSON.stringify(error));
}

const passwordOk = (password, repeat) => {
    if (password.length < 10) {
        return { ok: false, error: "Password must be at least 10 characters." };
    }

    if (password !== repeat) {
        return { ok: false, error: "Passwords do not match." };
    }

    if (passwordIsCommon(password)) {
        return { ok: false, error: "The given password is to week." };
    }

    return { ok: true };
};

const passwordIsCommon = password => {
    return false;
}