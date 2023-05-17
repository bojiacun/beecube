var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 # Clocker
 计时器，可用于正计时、倒计时

 @param targetDate : Date     目标时间，在正计时中，目标时间是计时的起始时间；在倒计时中，目标时间为结束时间；默认为当前时间
 @param countDown : boolean      是否是倒计时，默认为 false


 # 使用示例
 ```
 let startDate = new Date();
 let clocker = new Clocker(startDate);

 // 获得计时器的 时、分、秒
 let hours = clocker.hours;
 let minutes = clocker.minutes;
 let seconds = clocker.seconds;
 ```
 */

var Clocker = function () {

    /**
     * 构造器
     * @param targetDate : Date     目标时间，在正计时中，目标时间是计时的起始时间；在倒计时中，目标时间为结束时间；默认为当前时间
     * @param countDown : boolean      是否是倒计时，默认为 false
     * @memberof Clocker
     */
    function Clocker() {
        var targetDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
        var countDown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, Clocker);

        this.targetDate = targetDate;
        this.countDown = countDown;
    }

    /**
     * 已计的时间间隔
     *
     * @readonly : number
     * @memberof Clocker
     */


    _createClass(Clocker, [{
        key: "_interval",
        get: function get() {
            var currentDate = new Date();
            var factor = this.countDown ? -1 : 1;
            var interval = (currentDate.getTime() - this.targetDate.getTime()) * factor;
            return interval;
        }

        /**
         * 计时是否正在正常地进行中
         * @readonly : boolean
         * @memberof Clocker
         *
         * 注意：
         * 在正计时中，返回 `false` 表示：还未到达开始计时时间；
         * 在倒计时中，返回 `false` 表示：已经到达结束时间；
         */

    }, {
        key: "isCounting",
        get: function get() {
            return this._interval >= 0;
        }

        /**
         * 计时的因数
         *
         * @readonly : number
         * @memberof Clocker
         */

    }, {
        key: "_countFactor",
        get: function get() {
            return this.isCounting ? 1 : -1;
        }

        /**
         * 获得计时的 Date 对象 (以世界标准时间(UTC)计时)
         * @readonly  : Date
         */

    }, {
        key: "dateObj",
        get: function get() {
            var interval = Math.abs(this._interval);
            return new Date(interval);
        }

        /**
         * 获得计时的年数
         * @readonly : number
         */

    }, {
        key: "year",
        get: function get() {
            return (this.dateObj.getUTCFullYear() - 1970) * this._countFactor;
        }

        /**
         * 获得计时的月数
         * @readonly : number
         */

    }, {
        key: "month",
        get: function get() {
            return this.dateObj.getUTCMonth() * this._countFactor;
        }

        /**
         * 获得计时的天数
         * @readonly : number
         */

    }, {
        key: "date",
        get: function get() {
            var interval = Math.abs(this._interval);
            // return (this.dateObj.getUTCDate() - 1) * this._countFactor;
            return interval / 3600000 / 24 * this._countFactor;
        }

        /**
         * 获得计时的小时数
         * @readonly : number
         */

    }, {
        key: "hours",
        get: function get() {
            return this.dateObj.getUTCHours() * this._countFactor;
        }

        /**
         * 获得计时的分钟数
         * @readonly : number
         */

    }, {
        key: "minutes",
        get: function get() {
            return this.dateObj.getUTCMinutes() * this._countFactor;
        }

        /**
         * 获得计时的秒钟数
         * @readonly : number
         */

    }, {
        key: "seconds",
        get: function get() {
            return this.dateObj.getUTCSeconds() * this._countFactor;
        }

        /**
         * 获得计时的毫秒数
         * @readonly : number
         */

    }, {
        key: "milliseconds",
        get: function get() {
            return this.dateObj.getUTCMilliseconds() * this._countFactor;
        }
    }]);

    return Clocker;
}();

export default Clocker;
export {Clocker};
