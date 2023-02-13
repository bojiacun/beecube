/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import Taro from '@tarojs/taro';

export type IconNames = 'ziyuan' | 'daohang' | 'tushuguan' | 'paizhao' | 'paizhao-xianxing' | 'tupian-xianxing' | 'tupian' | 'saomiao' | 'xianshikejian' | 'haoping-yuankuang' | 'chaping-yuankuang' | 'chaping' | 'haoping' | 'jia-xianxingyuankuang' | 'jia-yuankuang' | 'jia' | 'jian' | 'cuowuguanbiquxiao-yuankuang' | 'cuowuguanbiquxiao-xianxingyuankuang' | 'cuowuguanbiquxiao' | 'shangyiyehoutuifanhui' | 'xiayiyeqianjinchakangengduo' | 'xiangxiazhankai' | 'zhixiangzuo' | 'zhixiangyou' | 'zhixiangshang' | 'xiangshangshouqi' | 'zhixiangxia' | 'diyiye' | 'zuihouye' | 'biaotou-zhengxu' | 'biaotou-kepaixu' | 'biaotou-daoxu' | 'weizhi-xianxing' | 'weizhi' | 'yunshuzhongwuliu-xianxing' | 'dianpu-xianxing' | 'yunshuzhongwuliu' | 'caigou-xianxing' | 'yonghuziliao' | 'caigou' | 'yonghuziliao-xianxing' | 'shangpin' | 'pifuzhuti' | 'shangpin-xianxing' | 'pifuzhuti-xianxing' | 'diamond' | 'diamond-o' | 'zhiliang-xianxing' | 'zhiliang' | 'anquanbaozhang' | 'anquanbaozhang-xianxing' | 'airudiantubiaohuizhi-zhuanqu_zhibojian' | 'guize' | 'liwuhuodong' | 'scan' | 'xiaohai' | 'shouhou' | 'tuichu' | 'shexiangtou_guanbi' | 'shexiangtou' | 'yewu' | 'yingyongchengxu' | '24gf-stop' | 'mic-off' | '24gf-play' | '24gf-pause2' | 'maikefeng1' | 'maikefeng2' | '2' | '-fuwu-xianxing' | '-fuwu' | 'shezhi-xianxing' | 'shezhi' | 'shouye' | 'shouye-xianxing' | 'dianhua-xianxingyuankuang' | 'dianhua' | 'lingdang' | 'lingdang-xianxing' | 'maikefeng';

interface Props {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<Props> = (props) => {
  const { name, size, color, style } = props;

  // @ts-ignore
  return <iconfont name={name} size={parseFloat(Taro.pxTransform(size))} color={color} style={style} />;
};

IconFont.defaultProps = {
  size: 18,
};

export default IconFont;
