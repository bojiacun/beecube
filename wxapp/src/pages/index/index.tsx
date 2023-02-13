import Taro, {useReady, useRouter, useShareAppMessage} from '@tarojs/taro'
import DiyPage from '../../components/DiyPage';
import withLogin from '../../components/login/login';


const Index = props => {
    const {context, checkLogin} = props;
    const {settings, userInfo} = context;
    const isLogin = checkLogin();
    const {params} = useRouter();



    useShareAppMessage(()=>{
        if(settings.shareBgImg) {
            return {
                title: settings.shareTitle ? settings.shareTitle : '我在这里赚取了积分，快来围观吧',
                path: '/pages/index/index?uid='+ (isLogin ? userInfo?.memberInfo?.id : ''),
                imageUrl: settings.shareBgImg
            }
        }
        return {
            title: settings.shareTitle ? settings.shareTitle : '我在这里赚取了积分，快来围观吧',
            path: '/pages/index/index?uid=' + (isLogin ? context.userInfo.memberInfo?.id : ''),
        }
    });
    //推广信息
    useReady(()=>{
        if(params.uid) {
            //存储转发人ID
            Taro.setStorageSync('reference_id', params.uid);
        }
    })
    return <DiyPage pageIdentifier="HOME" />;
}


export default withLogin(Index);
