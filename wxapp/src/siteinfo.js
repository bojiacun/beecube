// eslint-disable-next-line import/no-commonjs
let baseUrl = "";
if(process.env.NODE_ENV === 'development') {
    baseUrl = "http://localhost:9999";
    // baseUrl = "https://mdmx.winkt.cn";
}
else {
    baseUrl = "https://localhost:9999";
}
module.exports = {
    name: "汇智拍卖",
    appId: '1604495135656910850',
    version: "1.0.0",
    siteroot: baseUrl,
    design_method: "3"
};
