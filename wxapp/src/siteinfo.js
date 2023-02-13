// eslint-disable-next-line import/no-commonjs
let baseUrl = "";
if(process.env.NODE_ENV === 'development') {
    // baseUrl = "http://localhost:5891";
    baseUrl = "https://mdmx.winkt.cn";
}
else {
    baseUrl = "https://mdmx.winkt.cn";
}
module.exports = {
    name: "图书借阅系统",
    uniacid: "2",
    acid: "2",
    multiid: "0",
    version: "1.0.0",
    siteroot: baseUrl,
    design_method: "3"
};
