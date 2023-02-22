import Taro,{useRouter} from '@tarojs/taro';
import {Image, Navigator, Text, View} from "@tarojs/components";
import classNames from "classnames";
import PropTypes from 'prop-types';
// @ts-ignore
import tabStyles from './index.module.scss';
import utils from '../../lib/utils';
import {useSelector} from "react-redux";


export declare interface TabBarItem {
    selected: boolean,
    selectedColor: string,
    color: string,
    iconPath: string,
    selectedIconPath: string,
    url: string,
    text: string,
    additional?: boolean,
}

export declare interface TabBarProps {
    backgroundColor: string,
    cartNum: number,
    onTabChange: Function
}

const TabBar = (props: TabBarProps) => {
    const {backgroundColor, cartNum, onTabChange} = props;
    const tabs = useSelector(({context})=>context.tabs);
    const systemInfo = useSelector(({context})=>context.systemInfo);
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

    console.log(systemInfo);

    return (
        <View className={classNames(tabStyles.tabbar_box, 'cu-bar tabbar')}
              style={{backgroundColor: backgroundColor, paddingBottom: Taro.pxTransform(systemInfo.screenHeight - systemInfo.safeArea.bottom)}}>
            {
                tabs.map((item: TabBarItem) => {
                    return (
                        <Navigator
                            url={item.url}
                            openType={'redirect'}
                            hoverClass="none"
                            className={classNames('action')}
                            style={{color: (item.selected ? item.selectedColor : item.color)}}>
                            <View className={tabStyles.tabbar_icon} data-num={cartNum}>
                                <Image src={item.selected ? utils.resolveUrl(item.selectedIconPath) : utils.resolveUrl(item.iconPath)}/>
                                {cartNum > 0 && <view className={tabStyles.cartNum}>{cartNum}</view>}
                            </View>
                            <View style={{marginTop: '12rpx'}}>{item.text}</View>
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
