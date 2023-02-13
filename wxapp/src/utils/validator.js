const numberReg = /^-?[1-9][0-9]?.?[0-9]*$/    //数字正则
const phoneReg = /^1[0-9]{10,10}$/  //手机号正则

// 策略对象
let strategys = new Map([
    //判断是否为空
    ['isEmpty', (value, errorMsg) => {
        if (value === '' || value === undefined || value === null || value.length === 0) {
            return errorMsg;
        }
    }],
    // 限制最小长度
    ['minLength', (value, length, errorMsg) => {
        if (value.length < length) {
            return errorMsg;
        }
    }],
    // 限制最大长度
    ['maxLength', (value, length, errorMsg) => {
        if (value.length > length) {
            return errorMsg;
        }
    }],
    // 手机号码格式
    ['phone', (value, errorMsg) => {
        if (!phoneReg.test(value)) {
            return errorMsg;
        }
    }],
    //判断数字
    ['number', (value, errorMsg) => {
        if (!numberReg.test(value)) {
            return errorMsg;
        }
    }]
])

class Validator {
    constructor() {
        this.cache = []; //保存校验规则
    }

    addRule(data, rules) {
        var self = this;
        for (let rule of rules) {
            if (!rule || !rule.name || !rule.strategy) {
                continue
            }
            let strategyAry = rule.strategy.split(":");
            self.cache.push(function () {
                let strategy = strategyAry.shift();
                let errmsg = rule.errmsg;
                strategyAry.unshift(data[rule.name]);
                strategyAry.push(errmsg);
                return strategys.get(strategy).apply(data, strategyAry);
            });
        }
    }

    check() {
        let res = {
            isOk: true,
            errmsg: ''
        }
        for (let i = 0, fn; fn = this.cache[i++];) {
            let msg = fn(); // 开始效验 并取得效验后的返回信息
            if (msg) {
                res = {
                    isOk: false,
                    errmsg: msg
                };
                break;
            }
        }
        return res
    }
}

/**
 * 工厂模式，便于后期维护
 */
function getValidator() {
    let validator = new Validator()
    return validator
}

export default getValidator
