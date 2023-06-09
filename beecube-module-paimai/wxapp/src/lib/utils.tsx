import Taro from "@tarojs/taro";
import SystemTabs from '../tabs';

const indexOf = (arr, value) => {
    let exists = false;
    arr.forEach(v => {
        if (value.match(v)) {
            exists = true;
        }
    })
    return exists;
}

export default {
    resolveUrl: (url: string) => {
        return url;
    },
    convertWebStyle: (style) => {
        style = {...style};
        if (style.paddingLeft) {
            style.paddingLeft = Taro.pxTransform(style.paddingLeft);
        }
        if (style.paddingRight) {
            style.paddingRight = Taro.pxTransform(style.paddingRight);
        }
        if (style.paddingBottom) {
            style.paddingBottom = Taro.pxTransform(style.paddingBottom);
        }
        if (style.paddingTop) {
            style.paddingTop = Taro.pxTransform(style.paddingTop);
        }


        if (style.marginLeft) {
            style.marginLeft = Taro.pxTransform(style.marginLeft);
        }
        if (style.marginRight) {
            style.marginRight = Taro.pxTransform(style.marginRight);
        }
        if (style.marginBottom) {
            style.marginBottom = Taro.pxTransform(style.marginBottom);
        }
        if (style.marginTop) {
            style.marginTop = Taro.pxTransform(style.marginTop);
        }

        if (style.fontSize) {
            style.fontSize = Taro.pxTransform(style.fontSize);
        }
        if (style.borderRadius && !'%'.match(style.borderRadius)) {
            style.borderRadius = Taro.pxTransform(style.borderRadius);
        }

        if (style.width && !'%'.match(style.width)) {
            style.width = Taro.pxTransform(style.width);
        }
        if (style.height && !'%'.match(style.height)) {
            style.height = Taro.pxTransform(style.height);
        }

        return style;
    },
    gotoLink: (link) => {
        if (!indexOf(SystemTabs, link)) {
            Taro.navigateTo({url: link}).then();
        } else {
            Taro.switchTab({url: link}).then();
        }
    },
    indexOf,
    compareVersion: (v1, v2) => {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
    },
    navigateBack: () => {
        let pageCount = Taro.getCurrentPages().length;
        if (pageCount > 1) {
            Taro.navigateBack().then();
        } else {
            Taro.reLaunch({url: '/pages/index/index'}).then();
        }
    },
    showSuccess: (autoBack = false, msg = '保存成功') => {
        Taro.showToast({title: msg, icon: 'success'}).then();
        if (autoBack) {
            setTimeout(() => {
                let pageCount = Taro.getCurrentPages().length;
                if (pageCount > 1) {
                    Taro.navigateBack().then();
                } else {
                    Taro.reLaunch({url: '/pages/index/index'}).then();
                }
            }, 1000);
        }
    },
    showError: (msg = '保存失败') => {
        Taro.showToast({title: msg, icon: 'none', duration: 1500}).then();
    },
    showLoading: (msg = '加载中') => {
        Taro.showLoading({title: msg}).then();
    },
    showMessage: (content: string, callback: Function = () => {
    }, showCancel = false, cancelCallback: Function = () => {
    }, title = '友情提示', confirmText = '确定', cancelText = '取消') => {
        return Taro.showModal({title: title, content: content, showCancel: showCancel, confirmText: confirmText, cancelText: cancelText}).then(res => {
            if (res.confirm) {
                callback();
            } else {
                cancelCallback && cancelCallback();
            }
        });
    },
    hideLoading() {
        Taro.hideLoading();
    },
    randomString(len) {
        len = len || 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    resolveHtmlImageWidth(html: string) {
        if (html) {
            html = html.replace(/style\s*=\s*"[^"]+"/ig, '');
            html = html.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;" ');
            html = html.replace(/\n/ig, '<br />');
            html = html.replace(/\r/ig, '<br />');
        }
        // html = html.replace(/ /ig, '<span style="margin-left: 8px"></span>');
        return html;
    },
    calcPageHeaderHeight(systemInfo: any) {
        const barTop = systemInfo.statusBarHeight;
        const menuButtonInfo = Taro.getMenuButtonBoundingClientRect();
        // 获取导航栏高度
        const barHeight = menuButtonInfo.height + (menuButtonInfo.top - barTop) * 2
        return barTop + barHeight;
    },
    calcSafeBottom(systemInfo: any) {
        return systemInfo.safeArea.bottom - systemInfo.safeArea.height;
    },
    delHtml(content) {
        if (content == null) return '';
        content = content.replace(/<\/?.+?>/g, "");
        return content.replace(/ /g, "");
    },
    /**
     * 数字格式化：万、亿单位
     * @param {*} val
     * @returns
     */
    numberFormat(val) {
        let num = 1000
        var sizesValue = ''
        /**
         * 判断取哪个单位
         */
        if (val < 1000) {
            // 如果小于1000则直接返回
            sizesValue = ''
            return val;
        } else if (val > 1000 && val < 9999) {
            sizesValue = '千'
        } else if (val > 10000 && val < 99999999) {
            sizesValue = '万'
        } else if (val > 100000000) {
            sizesValue = '亿'
        }
        /**
         * 大于一万则运行下方计算
         */
        let i = Math.floor(Math.log(val) / Math.log(num))
        /**
         * toFixed(0)看你们后面想要取值多少，我是不取所以填了0，一般都是取2个值
         */
        var sizes = ((val / Math.pow(num, i))).toFixed(0)
        sizes = sizes + sizesValue
        return sizes;// 输出
    }
}
