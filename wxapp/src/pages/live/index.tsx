import Taro, {useReady, useRouter} from '@tarojs/taro'
import DiyPage from '../../components/DiyPage';
import withLogin from '../../components/login/login';


const Index = () => {
    const {params} = useRouter();

    //推广信息
    useReady(()=>{
        if(params.uid) {
            //存储转发人ID
            Taro.setStorageSync('reference_id', params.uid);
        }
    })
    return <DiyPage pageIdentifier="LIVE" />;
}


export default withLogin(Index);
