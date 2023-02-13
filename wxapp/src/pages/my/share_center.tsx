import {useShareAppMessage} from '@tarojs/taro';
import classNames from "classnames";
import PageLayout from "../../layouts/PageLayout";
import {Button, Image, Text, View} from "@tarojs/components";
import StatusBar from "../../components/statusbar";
import withLogin from "../../components/login/login";


const ShareCenter = (props) => {
    const {context, headerHeight, checkLogin, makeLogin} = props;
    const {settings, userInfo} = context;
    const isLogin = checkLogin();

    useShareAppMessage(()=>{
        if(settings.shareBgImg) {
            return {
                title: settings.shareTitle ? settings.shareTitle : '我在这里赚取了大小豆，快来围观吧',
                path: '/pages/index/index?uid='+ (isLogin ? userInfo?.memberInfo?.id : ''),
                imageUrl: settings.shareBgImg
            }
        }
        return {
            title: settings.shareTitle ? settings.shareTitle : '我在这里赚取了大小豆，快来围观吧',
            path: '/pages/index/index?uid='+ (isLogin ? context.userInfo.memberInfo?.id : ''),
        }
    })

    return (
        <PageLayout statusBarProps={{title: '推广中心', color: '#ffffff'}} showStatusBar={false}>
            <View className="bg-gradual-green padding-bottom-xl" style={{height: '800rpx'}}>
                <StatusBar bgColor='transparent' color="white" title="推广中心" statusHeight={context?.systemInfo.statusBarHeight} />
                <View style={{height: 'calc(100% - ' + headerHeight + 'px)'}} className="flex flex-direction text-xl text-yellow text-bold align-center justify-around">
                    <Image src={userInfo ? userInfo.memberInfo.avatar : '../../assets/images/head-bitmap.png'} className="cu-avatar xl round margin"  />
                    <View>邀请一人立即获得</View>
                    <View className="text-sm"><Text style={{fontSize: 64}}>{settings.shareScore}</Text>大小豆</View>
                    {isLogin ?
                        <Button style={{width: '300rpx'}} openType="share" className={classNames("cu-btn bg-orange light block animation-scale-draw")}>立即分享</Button>
                        :
                        <Button style={{width: '300rpx'}} className="cu-btn bg-orange light block" onClick={()=>makeLogin()}>登录后分享</Button>
                    }
                </View>
            </View>
        </PageLayout>
    );
}

export default withLogin(ShareCenter);
