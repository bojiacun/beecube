let baseUrl = "";
if(process.env.NODE_ENV === 'development') {
    // baseUrl = "http://localhost";
    baseUrl = "https://static3.winkt.cn";
}
else {
    baseUrl = "https://static3.winkt.cn";
}
export default {
    staticBaseUrl: baseUrl
}
