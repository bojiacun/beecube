Component({
  properties: {
    // ziyuan | daohang | tushuguan | paizhao | paizhao-xianxing | tupian-xianxing | tupian | saomiao | xianshikejian | haoping-yuankuang | chaping-yuankuang | chaping | haoping | jia-xianxingyuankuang | jia-yuankuang | jia | jian | cuowuguanbiquxiao-yuankuang | cuowuguanbiquxiao-xianxingyuankuang | cuowuguanbiquxiao | shangyiyehoutuifanhui | xiayiyeqianjinchakangengduo | xiangxiazhankai | zhixiangzuo | zhixiangyou | zhixiangshang | xiangshangshouqi | zhixiangxia | diyiye | zuihouye | biaotou-zhengxu | biaotou-kepaixu | biaotou-daoxu | weizhi-xianxing | weizhi | yunshuzhongwuliu-xianxing | dianpu-xianxing | yunshuzhongwuliu | caigou-xianxing | yonghuziliao | caigou | yonghuziliao-xianxing | shangpin | pifuzhuti | shangpin-xianxing | pifuzhuti-xianxing | diamond | diamond-o | zhiliang-xianxing | zhiliang | anquanbaozhang | anquanbaozhang-xianxing | airudiantubiaohuizhi-zhuanqu_zhibojian | guize | liwuhuodong | scan | xiaohai | shouhou | tuichu | shexiangtou_guanbi | shexiangtou | yewu | yingyongchengxu | 24gf-stop | mic-off | 24gf-play | 24gf-pause2 | maikefeng1 | maikefeng2 | 2 | fuwu-xianxing | fuwu | shezhi-xianxing | shezhi | shouye | shouye-xianxing | dianhua-xianxingyuankuang | dianhua | lingdang | lingdang-xianxing | maikefeng
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 18,
      observer: function(size) {
        this.setData({
          svgSize: size / 750 * wx.getSystemInfoSync().windowWidth,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 18 / 750 * wx.getSystemInfoSync().windowWidth,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
