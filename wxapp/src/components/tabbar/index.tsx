import Taro, {useRouter} from '@tarojs/taro';
import {Image, Navigator, View} from "@tarojs/components";
import PropTypes from 'prop-types';
// @ts-ignore
import tabStyles from './index.module.scss';
import utils from '../../lib/utils';
import {useSelector} from "react-redux";
import classNames from "classnames";


export declare interface TabBarItem {
  selected: boolean,
  textColor: string,
  textColorActive: string,
  icon: string,
  iconActive: string,
  url: string,
  title: string,
}

export declare interface TabBarProps {
  backgroundColor: string,
  cartNum: number,
  onTabChange: Function
}

const TabBar = (props: TabBarProps) => {
  const {backgroundColor, cartNum, onTabChange} = props;
  const tabs = useSelector(({context}) => context.tabs);
  const systemInfo = useSelector(({context}) => context.systemInfo);
  const router = useRouter();

  if (router) {
    tabs.forEach(tab => {
      tab.selected = false;
      if (tab.url === router.path) {
        tab.selected = true;
        onTabChange && onTabChange(tab);
      }
    });
  }

  if (!tabs || tabs.length === 0) {
    return <></>
  }

  let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
  if(safeBottom > 10) safeBottom -= 10;

  return (
    <View className={classNames('flex py-2 bottom-0 fixed w-screen border-0 border-t-1 border-gray-200 border-solid box-content', tabStyles.tabbar)}
          style={{backgroundColor: backgroundColor, paddingBottom: safeBottom > 0 ? Taro.pxTransform(safeBottom) : ''}}>
      {
        tabs.map((item: TabBarItem) => {
          return (
            <Navigator
              url={item.url}
              openType={'redirect'}
              hoverClass="none"
              className={'flex-1 flex flex-col items-center relative justify-around space-y-1.5'}
              style={{color: (item.selected ? item.textColorActive: item.textColor)}}>
              <Image style={{display: 'block', width: Taro.pxTransform(28), height: Taro.pxTransform(28)}} mode={'aspectFit'} src={item.selected ? utils.resolveUrl(item.iconActive) : utils.resolveUrl(item.icon)}/>
              {cartNum > 0 && <view className={tabStyles.cartNum}>{cartNum}</view>}
              <View className={'flex-none text-xs'}>{item.title}</View>
            </Navigator>
          );
        })
      }
    </View>
  );
}

TabBar.propTypes = {
  backgroundColor: PropTypes.string,
  cartNum: PropTypes.number,
  onTabChange: PropTypes.func
}

TabBar.defaultProps = {
  backgroundColor: 'rgba(255,255,255,.98)',
  cartNum: 0,
  onTabChange: () => null
}

export default TabBar
