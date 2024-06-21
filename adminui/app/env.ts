let ServerEnv = {
    BASE_URL: 'http://beecube.winkt.cn:9999',
    LOGIN_URL: '/login',
    LOGOUT_URL: '/auth/logout',
    USER_INFO_URL: '/auth/user',
    LOGIN_SUCCESS_URL: '/',
    SESSION_SECRET: 'bojinhong',
    COOKIE_NAME: 'RSESSIONID',
    API_BASE_URL: 'http://beecube.winkt.cn:9999',
    AXIOS_BASE_URL: 'http://localhost:3001',
};

if (process.env.NODE_ENV === 'development') {
    // ServerEnv.BASE_URL = 'http://localhost:9999';
    // ServerEnv.API_BASE_URL = 'http://localhost:9999';
} else {
    ServerEnv.AXIOS_BASE_URL = 'https://beecube.winkt.cn';
}


export default ServerEnv;
