import {Component, PropsWithChildren} from "react";
import Taro from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import {View} from "@tarojs/components";
import {connect} from "react-redux";
import styles from './index.module.scss';
import classNames from "classnames";
// @ts-ignore
@connect((state: any) => (
  {
    systemInfo: state.context.systemInfo,
    settings: state.context.settings,
    context: state.context
  }
))
export default class Index extends Component<PropsWithChildren<any>> {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const {systemInfo} = this.props;

    return (
      <PageLayout showTabBar={true} showStatusBar={false}>
        <View
          className={classNames('', styles.userProfile)}
          style={{paddingTop: Taro.pxTransform(systemInfo.safeArea.top + 40)}}
        >
          <View className={styles.box}>
            Test
          </View>
        </View>
      </PageLayout>
    )
  }
}
