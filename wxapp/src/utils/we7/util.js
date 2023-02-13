import Taro from '@tarojs/taro'
import { base64_encode, base64_decode } from './base64';
import configStore from '../../store';
import md5 from './md5';
import _ from './underscore';
import {setUserInfo} from "../../store/actions";
import context from "../context";
import winktConfig from '../../winkt.config';
import { SERVICE_WINKT_MEMBER_HEADER } from '../request';
import {Tabs} from "../../global";

export const PLATFORM = 'wink-cloud';
export const KEY_USERINFO = 'userInfo';
const util = {};

util.indexOf = (arr, value) => {
    let exists = false;
    arr.forEach(v => {
        if(value.match(v)) {
            exists = true;
        }
    })
    return exists;
}
/*函数防抖*/

util.debounce = function(func, wait) {
    let timer;
    return function() {
        let context = this; // 注意 this 指向
        let args = arguments; // arguments中存着e
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args)
        }, wait)
    }
}

util.base64Encode = function (str) {
	return base64_encode(str)
};

util.base64Decode = function (str) {
	return base64_decode(str)
};

util.md5 = function (str) {
	return md5(str)
};
util.getContext = function () {
    return context;
}
util.getStore = function () {
    return configStore();
}
/**
	构造地址,
	@params action 微擎系统中的controller, action, do，格式为 'wxapp/home/navs'
	@params querystring 格式为 {参数名1 : 值1, 参数名2 : 值2}
*/
util.url = function (action, querystring) {
    let url = action;
    if(PLATFORM === 'we7') {
        const siteInfo = util.getContext().siteInfo;
        url = siteInfo.siteroot + '?i=' + siteInfo.uniacid + '&t=' + siteInfo.multiid + '&v=' + siteInfo.version + '&from=wxapp&';

        if (action) {
            action = action.split('/');
            if (action[0]) {
                url += 'c=' + action[0] + '&';
            }
            if (action[1]) {
                url += 'a=' + action[1] + '&';
            }
            if (action[2]) {
                url += 'do=' + action[2] + '&';
            }
            if (action[3]) {
                url += 'controller=' + action[3] + '&';
            }
        }
        if (querystring && typeof querystring === 'object') {
            for (let param in querystring) {
                if (param && querystring.hasOwnProperty(param) && querystring[param]) {
                    url += param + '=' + querystring[param] + '&';
                }
            }
        }
    }
	else if(PLATFORM === 'wink-cloud'){
        const siteInfo = util.getContext().siteInfo;
		url = siteInfo.siteroot+"/"+action;
	}
	return url;
}

function getQuery(url) {
	var theRequest = [];
	if (url.indexOf("?") != -1) {
		var str = url.split('?')[1];
		var strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			if (strs[i].split("=")[0] && unescape(strs[i].split("=")[1])) {
				theRequest[i] = {
					'name': strs[i].split("=")[0],
					'value': unescape(strs[i].split("=")[1])
				}
			}
		}
	}
	return theRequest;
}
/*
* 获取链接某个参数
* url 链接地址
* name 参数名称
*/
function getUrlParam(url, name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = url.split('?')[1].match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
/**
 * 获取签名 将链接地址的所有参数按字母排序后拼接加上token进行md5
 * url 链接地址
 * date 参数{参数名1 : 值1, 参数名2 : 值2} *
 * token 签名token 非必须
 */
function getSign(url, data, token) {
    const siteInfo = util.getContext().siteInfo;
	var querystring = '';
	var sign = getUrlParam(url, 'sign');
	if (sign || (data && data.sign)) {
		return false;
	} else {
		if (url) {
			querystring = getQuery(url);
		}
		if (data) {
			var theRequest = [];
			for (let param in data) {
				if (param && data[param]) {
					theRequest = theRequest.concat({
						'name': param,
						'value': data[param]
					})
				}
			}
			querystring = querystring.concat(theRequest);
		}
		//排序
		querystring = _.sortBy(querystring, 'name');
		//去重
		querystring = _.uniq(querystring, true, 'name');
		var urlData = '';
		for (let i = 0; i < querystring.length; i++) {
			if (querystring[i] && querystring[i].name && querystring[i].value) {
				urlData += querystring[i].name + '=' + querystring[i].value;
				if (i < (querystring.length - 1)) {
					urlData += '&';
				}
			}
		}
		token = token ? token : (siteInfo.token ? siteInfo.token : '');
		console.log('sign string is:', urlData + token);
		sign = md5(urlData + token);
		return sign;
	}
}
util.getSign = function (url, data, token) {
	return getSign(url, data, token);
};
let cachedToken;
util.getToken = function() {
	if(!cachedToken) {
        cachedToken = Taro.getStorageSync(KEY_USERINFO)?.token;
	}
	return cachedToken;
}
/**
	二次封装微信Taro.request函数、增加交互体全、配置缓存、以及配合微擎格式化返回数据

	@params option 弹出参数表，
	{
		url : 同微信,
		data : 同微信,
		header : 同微信,
		method : 同微信,
		success : 同微信,
		fail : 同微信,
		complete : 同微信,

		cachetime : 缓存周期，在此周期内不重复请求http，默认不缓存
	}
*/
util.request = function (option) {
    const store = util.getStore();
	option = option ? option : {};
	option.cachetime = option.cachetime ? option.cachetime : 0;
    option.resonseType = option.responseType || 'text';

	let url = option.url;
	if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
		url = util.url(url);
	}


	let header = option.header ? option.header : {};
	if(!header['content-type']) {
        header['content-type'] = 'application/json';
    }
	header['X-Requested-With'] = 'XMLHttpRequest';
	let token = util.getToken();
	if(token && option.token === true) {
		header['Authorization'] = 'Bearer '+token;
	}
    else if(option.token) {
        header['Authorization'] = 'Bearer '+option.token;
    }

    if(option.responseType == 'arraybuffer') {
        header['content-type'] = null;
    }

    Taro.request({
		'url': url,
		'data': option.data ? option.data : {},
		'header': header,
		'method': option.method ? option.method : 'GET',
        'responseType': option.responseType,
		'success': function (response) {

            let statusCode = parseInt(response.statusCode);
            if (statusCode === 401) {
                Taro.removeStorageSync(KEY_USERINFO);
                cachedToken = null;
                // store.dispatch(setUserInfo(null));
                Taro.login().then(res => {
                    util.getUserInfo(function (userInfo) {
                        //设置当前用户
                        Taro.setStorageSync(KEY_USERINFO, userInfo);
                        store.dispatch(setUserInfo(userInfo));
                        util.request(option)
                    }, null, res.code);
                })
                return;
            } else if (statusCode !== 200) {
                //自动捕获错误并显示错误信息
                if (option.catchError) {
                    let redirect = '';
                    if (response.data.data != null && response.data.data.redirect) {
                        redirect = response.data.data.redirect;
                    }
                    util.message(response.data.message||'服务器内部错误', redirect, 'error');
                }
                if (option.fail && typeof option.fail == 'function') {
                    option.fail(response);
                }
                return;
            }
            if (option.success && typeof option.success == 'function') {
                option.success(response);
            }
        },
		'fail': function (response) {
            Taro.hideNavigationBarLoading();
            Taro.hideLoading();
            if (parseInt(response.statusCode) === 401) {
                Taro.removeStorageSync(KEY_USERINFO);
                cachedToken = null;
                // store.dispatch(setUserInfo(null));
                Taro.login().then(res=>{
                    util.getUserInfo(function (userInfo) {
                        //设置当前用户
                        Taro.setStorageSync(KEY_USERINFO, userInfo);
                        store.dispatch(setUserInfo(userInfo));
                        util.request(option)
                    }, null, res.code);
                })
                return;
            } else {
                //自动捕获错误并显示错误信息
                if (option.catchError && response.data.message) {
                    let redirect = '';
                    if (response.data.data != null && response.data.data.redirect) {
                        redirect = response.data.data.redirect;
                    }
                    util.message(response.data.message, redirect, 'error');
                }
                if (option.fail && typeof option.fail == 'function') {
                    option.fail(response);
                }
                return;
            }
		},
		'complete': function (response) {
			// Taro.hideNavigationBarLoading();
			// Taro.hideLoading();
			if (option.complete && typeof option.complete == 'function') {
				option.complete(response);
			}
		}
	});
}
let cachedUserInfo;
util.getWe7User = function (cb, code) {
    const userInfo = Taro.getStorageSync(KEY_USERINFO) || {};
    const referenceId = Taro.getStorageSync('reference_id') || '';
    util.request({
		url: 'wxapp/openid',
		data: { code: code ? code : '', 'reference_id': referenceId === 'undefined' ? '': referenceId},
		header: {'X-Requested-Service': SERVICE_WINKT_MEMBER_HEADER},
		cachetime: 0,
		showLoading: false,
		success: function (session) {
			if (session.data.data) {
				userInfo.token = session.data.data.token;
                userInfo.openid = session.data.data.openid;
                userInfo.unionid = session.data.data.unionid;
				userInfo.memberInfo = session.data.data.userinfo;
                cachedUserInfo = userInfo;
                // Taro.setStorageSync(KEY_USERINFO, userInfo);
                // store.dispatch(setUserInfo(userInfo));
			}
			typeof cb == "function" && cb(userInfo);
		},
        fail: function() {
            cachedUserInfo = null;
            Taro.showModal({title: '错误提醒', content: '登录失败，请重试'}).then();
        }
	});
}
util.updateMobile = function(wxInfo, cb) {
    const userInfo = cachedUserInfo;
    if (!wxInfo) {
        return typeof cb == "function" && cb(userInfo);
    }
    wxInfo.openid = userInfo.openid;
    wxInfo.unionid = userInfo.unionid;
    util.request({
        url: 'wxapp/phone',
        data: wxInfo,
        method: 'POST',
        token: cachedUserInfo.token,
        header: {'X-Requested-Service': SERVICE_WINKT_MEMBER_HEADER},
        cachetime: 0,
        success: function (res) {
            if (res.data.data) {
                userInfo.memberInfo = res.data.data;
                // Taro.setStorageSync(KEY_USERINFO, userInfo);
                // store.dispatch(setUserInfo(userInfo));
            }
            typeof cb == "function" && cb(userInfo);
        },
        fail: function() {
            cachedUserInfo = null;
            Taro.showModal({title: '错误提醒', content: '登录失败，请重试'}).then();
        }
    });
}
util.updateUser = function (wxInfo, cb) {
    const userInfo = cachedUserInfo;
    if (!wxInfo) {
		return typeof cb == "function" && cb(userInfo);
	}
	wxInfo.openid = userInfo.openid;
	wxInfo.unionid = userInfo.unionid;
	util.request({
		url: 'wxapp/userinfo',
		data: wxInfo,
		method: 'POST',
        token: cachedUserInfo.token,
		header: {'X-Requested-Service': SERVICE_WINKT_MEMBER_HEADER},
		cachetime: 0,
		success: function (res) {
			if (res.data.data) {
				userInfo.memberInfo = res.data.data;
                // Taro.setStorageSync(KEY_USERINFO, userInfo);
                // store.dispatch(setUserInfo(userInfo));
			}
			typeof cb == "function" && cb(userInfo);
		},
        fail: function() {
            cachedUserInfo = null;
            Taro.showModal({title: '错误提醒', content: '登录失败，请重试'}).then();
        }
	});
}
util.checkSession = function(option) {
	util.request({
		url: 'auth/session/check',
		method: 'POST',
		cachetime: 0,
		showLoading: false,
		success: function (res) {
			if (!res.data.errno) {
				typeof option.success == "function" && option.success();
			} else {
				typeof option.fail == "function" && option.fail();
			}
		},
		fail: function() {
			typeof option.fail == "function" && option.fail();
		}
	})
}
/*
* 获取用户信息
*/
util.getUserInfo = function (cb, wxInfo, code) {
    const login = function () {
        util.getWe7User(function (userInfo) {
            if (wxInfo) {
                util.updateUser(wxInfo, function (userInfo) {
                    typeof cb == "function" && cb(userInfo);
                })
            } else {
                typeof cb == "function" && cb(userInfo);
            }
        }, code)
    };

    const userInfo = Taro.getStorageSync(KEY_USERINFO) || {};
    if (userInfo.sessionid) {
		util.checkSession({
			success: function(){
				if (wxInfo) {
					util.updateUser(wxInfo, function(res) {
						typeof cb == "function" && cb(res);
					})
				} else {
					typeof cb == "function" && cb(userInfo);
				}
			},
			fail: function(){
				userInfo.sessionid = '';
                Taro.removeStorageSync(KEY_USERINFO);
				login();
			}
		})
	} else {
		//调用登录接口
		login();
	}
}

util.navigateBack = function (obj) {
	let delta = obj.delta ? obj.delta : 1;
	if (obj.data) {
		let pages = Taro.getCurrentPages()
		let curPage = pages[pages.length - (delta + 1)];
		if (curPage.pageForResult) {
			curPage.pageForResult(obj.data);
		} else {
			curPage.setData(obj.data);
		}
	}
    Taro.navigateBack({
		delta: delta, // 回退前 delta(默认为1) 页面
		success: function (res) {
			// success
			typeof obj.success == "function" && obj.success(res);
		},
		fail: function (err) {
			// fail
			typeof obj.fail == "function" && obj.fail(err);
		},
		complete: function () {
			// complete
			typeof obj.complete == "function" && obj.complete();
		}
	})
};

util.footer = function ($this) {
	let app = getApp();
	let that = $this;
	let tabBar = app.tabBar;
	for (let i in tabBar['list']) {
		tabBar['list'][i]['pageUrl'] = tabBar['list'][i]['pagePath'].replace(/(\?|#)[^"]*/g, '')
	}
	that.setData({
		tabBar: tabBar,
		'tabBar.thisurl': that.__route__
	})
};
/*
 * 提示信息
 * type 为 success, error 当为 success,  时，为toast方式，否则为模态框的方式
 * redirect 为提示后的跳转地址, 跳转的时候可以加上 协议名称
 * navigate:/we7/pages/detail/detail 以 navigateTo 的方法跳转，
 * redirect:/we7/pages/detail/detail 以 redirectTo 的方式跳转，默认为 redirect
*/
util.message = function(title, redirect, type) {
	if (!title) {
		return true;
	}
	if (typeof title == 'object') {
		redirect = title.redirect;
		type = title.type;
		title = title.title;
	}
	if (redirect) {
		var redirectType = redirect.substring(0, 9), url = '', redirectFunction = '';
		if (redirectType == 'navigate:') {
			redirectFunction = 'navigateTo';
			url = redirect.substring(9);
		} else if (redirectType == 'redirect:') {
			redirectFunction = 'redirectTo';
			url = redirect.substring(9);
		} else {
			url = redirect;
			redirectFunction = 'redirectTo';
		}
	}
	if (!type) {
		type = 'success';
	}

	if (type == 'success') {
        Taro.showToast({
			title: title,
			icon: 'success',
			duration: 2000,
			mask : url ? true : false,
			complete : function() {
				if (url) {
					setTimeout(function(){
						wx[redirectFunction]({
							url: url,
						});
					}, 1800);
				}

			}
		});
	} else if (type == 'error') {
		Taro.showModal({
			title: '系统信息',
			content : title,
			showCancel : false,
			complete : function() {
				if (url) {
					wx[redirectFunction]({
						url: url,
					});
				}
			}
		});
	}
}

util.user = util.getUserInfo;

//封装微信等待提示，防止ajax过多时，show多次
util.showLoading = function() {
	var isShowLoading = Taro.getStorageSync('isShowLoading');
	if (isShowLoading) {
		Taro.hideLoading();
		Taro.setStorageSync('isShowLoading', false);
	}

	Taro.showLoading({
		title : '加载中',
		complete : function() {
			Taro.setStorageSync('isShowLoading', true);
		},
		fail : function() {
			Taro.setStorageSync('isShowLoading', false);
		}
	});
}

util.showImage = function(event) {
	var url = event ? event.currentTarget.dataset.preview : '';
	if (!url) {
		return false;
	}
	Taro.previewImage({
		urls: [url]
	});
}

/**
 * 转换内容中的emoji表情为 unicode 码点，在Php中使用utf8_bytes来转换输出
*/
util.parseContent = function(string) {
	if (!string) {
		return string;
	}

	var ranges = [
			'\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
			'\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
			'\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
		];
	var emoji = string.match(
		new RegExp(ranges.join('|'), 'g'));

	if (emoji) {
		for (var i in emoji) {
			string = string.replace(emoji[i], '[U+' + emoji[i].codePointAt(0).toString(16).toUpperCase() + ']');
		}
	}
	return string;
}

util.resolveUrl = (path) => {
    if(!path) return path;
	if(path.startsWith('http')) {
		return path;
	}
	return winktConfig.staticBaseUrl + '/' + path;
}

util.date = function(){
	/**
	 * 判断闰年
	 * @param date Date日期对象
	 * @return boolean true 或false
	 */
	this.isLeapYear = function(date){
		return (0==date.getYear()%4&&((date.getYear()%100!=0)||(date.getYear()%400==0)));
	}

	/**
	 * 日期对象转换为指定格式的字符串
	 * @param f 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
	 * @param date Date日期对象, 如果缺省，则为当前时间
	 *
	 * YYYY/yyyy/YY/yy 表示年份
	 * MM/M 月份
	 * W/w 星期
	 * dd/DD/d/D 日期
	 * hh/HH/h/H 时间
	 * mm/m 分钟
	 * ss/SS/s/S 秒
	 * @return string 指定格式的时间字符串
	 */
	this.dateToStr = function(formatStr, date){
		formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
		date = arguments[1] || new Date();
		var str = formatStr;
		var Week = ['日','一','二','三','四','五','六'];
		str=str.replace(/yyyy|YYYY/,date.getFullYear());
		str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));
		str=str.replace(/MM/,date.getMonth()>9?(date.getMonth() + 1):'0' + (date.getMonth() + 1));
		str=str.replace(/M/g,date.getMonth());
		str=str.replace(/w|W/g,Week[date.getDay()]);

		str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());
		str=str.replace(/d|D/g,date.getDate());

		str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());
		str=str.replace(/h|H/g,date.getHours());
		str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());
		str=str.replace(/m/g,date.getMinutes());

		str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());
		str=str.replace(/s|S/g,date.getSeconds());

		return str;
	}


	/**
	* 日期计算
	* @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
	* @param num int
	* @param date Date 日期对象
	* @return Date 返回日期对象
	*/
	this.dateAdd = function(strInterval, num, date){
		date =  arguments[2] || new Date();
		switch (strInterval) {
			case 's' :return new Date(date.getTime() + (1000 * num));
			case 'n' :return new Date(date.getTime() + (60000 * num));
			case 'h' :return new Date(date.getTime() + (3600000 * num));
			case 'd' :return new Date(date.getTime() + (86400000 * num));
			case 'w' :return new Date(date.getTime() + ((86400000 * 7) * num));
			case 'm' :return new Date(date.getFullYear(), (date.getMonth()) + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
			case 'y' :return new Date((date.getFullYear() + num), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
		}
	}

	/**
	* 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串
	* @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
	* @param dtStart Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
	* @param dtEnd Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
	*/
	this.dateDiff = function(strInterval, dtStart, dtEnd) {
		switch (strInterval) {
			case 's' :return parseInt((dtEnd - dtStart) / 1000);
			case 'n' :return parseInt((dtEnd - dtStart) / 60000);
			case 'h' :return parseInt((dtEnd - dtStart) / 3600000);
			case 'd' :return parseInt((dtEnd - dtStart) / 86400000);
			case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));
			case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);
			case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();
		}
	}

	/**
	* 字符串转换为日期对象 // eval 不可用
	* @param date Date 格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制
	*/
	this.strToDate = function(dateStr){
		var data = dateStr;
		var reCat = /(\d{1,4})/gm;
		var t = data.match(reCat);
		t[1] = t[1] - 1;
		eval('var d = new Date('+t.join(',')+');');
		return d;
	}

	/**
	* 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
	*
	*/
	this.strFormatToDate = function(formatStr, dateStr){
		var year = 0;
		var start = -1;
		var len = dateStr.length;
		if((start = formatStr.indexOf('yyyy')) > -1 && start < len){
			year = dateStr.substr(start, 4);
		}
		var month = 0;
		if((start = formatStr.indexOf('MM')) > -1  && start < len){
			month = parseInt(dateStr.substr(start, 2)) - 1;
		}
		var day = 0;
		if((start = formatStr.indexOf('dd')) > -1 && start < len){
			day = parseInt(dateStr.substr(start, 2));
		}
		var hour = 0;
		if( ((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len){
			hour = parseInt(dateStr.substr(start, 2));
		}
		var minute = 0;
		if((start = formatStr.indexOf('mm')) > -1  && start < len){
			minute = dateStr.substr(start, 2);
		}
		var second = 0;
		if((start = formatStr.indexOf('ss')) > -1  && start < len){
			second = dateStr.substr(start, 2);
		}
		return new Date(year, month, day, hour, minute, second);
	}


	/**
	* 日期对象转换为毫秒数
	*/
	this.dateToLong = function(date){
		return date.getTime();
	}

	/**
	* 毫秒转换为日期对象
	* @param dateVal number 日期的毫秒数
	*/
	this.longToDate = function(dateVal){
		return new Date(dateVal);
	}

	/**
	* 判断字符串是否为日期格式
	* @param str string 字符串
	* @param formatStr string 日期格式， 如下 yyyy-MM-dd
	*/
	this.isDate = function(str, formatStr){
		if (formatStr == null){
			formatStr = "yyyyMMdd";
		}
		var yIndex = formatStr.indexOf("yyyy");
		if(yIndex==-1){
			return false;
		}
		var year = str.substring(yIndex,yIndex+4);
		var mIndex = formatStr.indexOf("MM");
		if(mIndex==-1){
			return false;
		}
		var month = str.substring(mIndex,mIndex+2);
		var dIndex = formatStr.indexOf("dd");
		if(dIndex==-1){
			return false;
		}
		var day = str.substring(dIndex,dIndex+2);
		if(!isNumber(year)||year>"2100" || year< "1900"){
			return false;
		}
		if(!isNumber(month)||month>"12" || month< "01"){
			return false;
		}
		if(day>getMaxDay(year,month) || day< "01"){
			return false;
		}
		return true;
	}

	this.getMaxDay = function(year,month) {
		if(month==4||month==6||month==9||month==11)
			return "30";
		if(month==2)
			if(year%4==0&&year%100!=0 || year%400==0)
				return "29";
			else
				return "28";
		return "31";
	}
	/**
	*	变量是否为数字
	*/
	this.isNumber = function(str)
	{
		var regExp = /^\d+$/g;
		return regExp.test(str);
	}

	/**
	* 把日期分割成数组 [年、月、日、时、分、秒]
	*/
	this.toArray = function(myDate)
	{
		myDate = arguments[0] || new Date();
		var myArray = Array();
		myArray[0] = myDate.getFullYear();
		myArray[1] = myDate.getMonth();
		myArray[2] = myDate.getDate();
		myArray[3] = myDate.getHours();
		myArray[4] = myDate.getMinutes();
		myArray[5] = myDate.getSeconds();
		return myArray;
	}

	/**
	* 取得日期数据信息
	* 参数 interval 表示数据类型
	* y 年 M月 d日 w星期 ww周 h时 n分 s秒
	*/
	this.datePart = function(interval, myDate)
	{
		myDate = arguments[1] || new Date();
		var partStr='';
		var Week = ['日','一','二','三','四','五','六'];
		switch (interval)
		{
			case 'y' :partStr = myDate.getFullYear();break;
			case 'M' :partStr = myDate.getMonth()+1;break;
			case 'd' :partStr = myDate.getDate();break;
			case 'w' :partStr = Week[myDate.getDay()];break;
			case 'ww' :partStr = myDate.WeekNumOfYear();break;
			case 'h' :partStr = myDate.getHours();break;
			case 'm' :partStr = myDate.getMinutes();break;
			case 's' :partStr = myDate.getSeconds();break;
		}
		return partStr;
	}

	/**
	* 取得当前日期所在月的最大天数
	*/
	this.maxDayOfDate = function(date)
	{
		date = arguments[0] || new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() + 1);
		var time = date.getTime() - 24 * 60 * 60 * 1000;
		var newDate = new Date(time);
		return newDate.getDate();
	}
};
util.px2rpx = (px) => {
    return Taro.pxTransform(px);
}
util.convertWebStyle = (style) => {
    style = {...style};
    if(style.paddingLeft) {
        style.paddingLeft = util.px2rpx(style.paddingLeft);
    }
    if(style.paddingRight) {
        style.paddingRight = util.px2rpx(style.paddingRight);
    }
    if(style.paddingBottom) {
        style.paddingBottom = util.px2rpx(style.paddingBottom);
    }
    if(style.paddingTop) {
        style.paddingTop = util.px2rpx(style.paddingTop);
    }


    if(style.marginLeft) {
        style.marginLeft = util.px2rpx(style.marginLeft);
    }
    if(style.marginRight) {
        style.marginRight = util.px2rpx(style.marginRight);
    }
    if(style.marginBottom) {
        style.marginBottom = util.px2rpx(style.marginBottom);
    }
    if(style.marginTop) {
        style.marginTop = util.px2rpx(style.marginTop);
    }

    if(style.fontSize) {
        style.fontSize = util.px2rpx(style.fontSize);
    }
    if(style.borderRadius && !'%'.match(style.borderRadius)) {
        style.borderRadius = util.px2rpx(style.borderRadius);
    }

    if(style.width && !'%'.match(style.width)) {
        style.width = util.px2rpx(style.width);
    }
    if(style.height && !'%'.match(style.height)) {
        style.height = util.px2rpx(style.height);
    }

    return style;
}
util.rpx2px = (rpx) => {
    let context = util.getContext();
    let systemInfo = context.systemInfo;
    return rpx / 750 * systemInfo.windowWidth;
}
util.gotoLink = (link) => {
    if(!util.indexOf(Tabs, link)) {
        Taro.navigateTo({url: link}).then();
    }
    else {
        Taro.switchTab({url: link}).then();
    }
}
export default util;
