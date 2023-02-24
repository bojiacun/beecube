import {Component, PropsWithChildren} from "react";
import Taro from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {View, Text} from "@tarojs/components";
import {connect} from "react-redux";
import styles from './index.module.scss';
import classNames from "classnames";
import avatar from '../../assets/images/avatar.png';
import FallbackImage from "../../components/FallbackImage";
// @ts-ignore
@connect((state: any) => (
  {
    systemInfo: state.context.systemInfo,
    settings: state.context.settings,
    context: state.context
  }
))
export default class Index extends Component<PropsWithChildren<any>> {

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    const {systemInfo} = this.props;

    return (
      <PageLayout showTabBar={true} showStatusBar={false}>
        <View
          className={classNames('text-white flex flex-col px-4', styles.userProfile)}
          style={{paddingTop: Taro.pxTransform(systemInfo.safeArea.top + 40)}}
        >
          <View className={classNames('flex items-center justify-between space-x-2')}>
            <View className={'flex items-center space-x-2'}>
              <FallbackImage src={avatar} errorImage={avatar} style={{width: Taro.pxTransform(52), height: Taro.pxTransform(52)}}/>
              <View className={'space-y-1 flex flex-col'}>
                <Text>用户姓名</Text>
                <Text>LEVEL</Text>
              </View>
            </View>
            <View><Text className={'iconfont icon-31shezhi'} style={{fontSize: 24}} /></View>
          </View>
          <View className={'grid grid-cols-4 gap-4 text-center mt-4'}>
            <View>
              <View className={'iconfont icon-paimai'} style={{fontSize: 24}} />
              <View>参拍</View>
            </View>
            <View>
              <View className={'iconfont icon-baozhengjin'} style={{fontSize: 24}} />
              <View>保证金</View>
            </View>
            <View>
              <View className={'iconfont icon-31guanzhu1'} style={{fontSize: 24}} />
              <View>关注</View>
            </View>
            <View>
              <View className={'iconfont icon-zuji'} style={{fontSize: 24}} />
              <View>足迹</View>
            </View>
          </View>
          <View className={'rounded-md bg-white mt-2 text-blue-600 py-2.5'}>
            <View className={'grid grid-cols-4 gap-1 text-center'}>
              <View>
                <View className={'iconfont icon-daizhifudingdan'} style={{fontSize: 24}} />
                <View className={'text-black'}>待结算</View>
              </View>
              <View>
                <View className={'iconfont icon-daifahuo'} style={{fontSize: 24}} />
                <View className={'text-black'}>待发货</View>
              </View>
              <View>
                <View className={'iconfont icon-daishouhuo'} style={{fontSize: 24}} />
                <View className={'text-black'}>待收货</View>
              </View>
              <View>
                <View className={'iconfont icon-yiwancheng'} style={{fontSize: 24}} />
                <View className={'text-black'}>已完成</View>
              </View>
            </View>
          </View>
          <View className={'mt-2 p-2'}>
            <View className={'flex items-center justify-between'}>
              <View className={'flex items-center space-x-2'}>
                <View className={'iconfont icon-qianbao'} style={{fontSize: 24}} />
                <View>我的余额</View>
              </View>
              <View className={'flex items-center space-x-2'}>
                <View>
                  RMB 0
                </View>
                <View className={'iconfont icon-youjiantou_huaban'} />
              </View>
            </View>
          </View>
        </View>

      </PageLayout>
    )
  }
}
