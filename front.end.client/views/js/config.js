export const config_variables = {
    BASE_URL: window.location.origin, // Dynamically get the deployed domain
    API_URL: `${window.location.origin}/api`,
    INFO_URL: `${window.location.origin}/info.html`,
    LOGIN_URL: `${window.location.origin}/index.html`,
    REGISTER_URL: `${window.location.origin}/register.html`,
    CHAT_URL: `${window.location.origin}/chat.html`,
    USER_URL: `${window.location.origin}/api/user`,
    USER_LOGIN: `${window.location.origin}/api/user/login`,
    USER_REGISTER: `${window.location.origin}/api/user`,
    CREATE_CHAT_URI: `${window.location.origin}/api/chat`,
};