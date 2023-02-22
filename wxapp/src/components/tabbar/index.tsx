import {useRouter} from '@tarojs/taro';
import {Image, Navigator, Text, View} from "@tarojs/components";
import classNames from "classnames";
import PropTypes from 'prop-types';
// @ts-ignore
import tabStyles from './index.module.scss';
import util from '../../utils/we7/util';
import { Tabs } from '../../global';


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
    tabs: TabBarItem[],
    onTabChange: Function
}

const TabBar = (props: TabBarProps) => {
    const {backgroundColor, cartNum, tabs, onTabChange} = props;
    const router = useRouter();
    const switchUrls = Tabs;
    const getOpenType = url => {
        if (switchUrls.filter(s => url == s).length > 0) {
            return 'switchTab';
        }
        return 'redirect';
    }
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


    return (
        <View className={classNames(tabStyles.tabbar_box, 'cu-bar tabbar')}
              style={{backgroundColor: backgroundColor}}>
            {
                tabs.map((item: TabBarItem) => {
                    if(item.additional) {
                        return (
                            <Navigator
                                url={item.url}
                                openType="navigate"
                                hoverClass="none"
                                className={classNames('action add-action')}
                            >
                                <Image className={"shadow icon"} src={item.selected ? item.selectedIconPath : item.iconPath}/>
                                <Text>{item.text}</Text>
                            </Navigator>
                        );
                    }
                    return (
                        <Navigator
                            url={item.url}
                            openType={getOpenType(item.url)}
                            hoverClass="none"
                            className={classNames('action')}
                            style={{color: (item.selected ? item.selectedColor : item.color)}}>
                            <View className={tabStyles.tabbar_icon} data-num={cartNum}>
                                <Image
                                    src={item.selected ? util.resolveUrl(item.selectedIconPath) : util.resolveUrl(item.iconPath)}/>
                                {cartNum > 0 && <view className={tabStyles.cartNum}>{{cartNum}}</view>}
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
    isIpx: PropTypes.bool,
    backgroundColor: PropTypes.string,
    cartNum: PropTypes.number,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        selected: PropTypes.bool,
        selectedColor: PropTypes.string,
        color: PropTypes.string,
        iconPath: PropTypes.string,
        selectedIconPath: PropTypes.string,
        url: PropTypes.string,
        text: PropTypes.string,
    })).isRequired,
    onTabChange: PropTypes.func
}

TabBar.defaultProps = {
    isIpx: false,
    backgroundColor: 'rgba(255,255,255,.98)',
    cartNum: 0,
    onTabChange: () => null
}

export default TabBar
