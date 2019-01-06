import { makePostRequest, createDirectoryUrl } from '../api';
import { TIMEOUT_MS } from '../api/constants';

const AUTH_TIMEOUT = TIMEOUT_MS * 5;

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

    const { user, token } = response;
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", user.id);
    return { user };
}

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