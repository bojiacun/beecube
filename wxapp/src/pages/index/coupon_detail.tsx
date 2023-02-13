import Taro, {useRouter} from "@tarojs/taro";
import {useEffect, useState} from "react";
import request, {resolveUrl, SERVICE_WINKT_SYSTEM_HEADER} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {Image} from "@tarojs/components";
import withLogin from "../../components/login/login";


const CouponDetailPage = (props: any) => {
    const {makeLogin} = props;
    const {params} = useRouter();
    const [coupon, setCoupon] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        if (params) {
            request.get("wxapp/coupons/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                setCoupon(res.data.data);
                setLoading(false);
            })
        }
    }, []);

    const takeCoupon = () => {
        if (coupon) {
            makeLogin(() => {
                Taro.showLoading({title: "领取中..."}).then();
                request.post("wxapp/coupons/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, true).then(res => {
                    setCoupon(res.data.data);
                    Taro.showToast({title: '领取成功', icon: 'success', duration: 2000}).then();
                    setTimeout(()=>{
                        Taro.navigateBack().then();
                    }, 2000);
                });
            });
        }
    }

    return (
        <PageLayout showStatusBar={true} loading={loading} statusBarProps={{title: '优惠券详情'}} showTabBar={false}>
            {coupon &&
                <Image onClick={takeCoupon} src={resolveUrl(coupon.image)} mode={'widthFix'}
                       style={{width: '100%', display: 'block'}}/>
            }
        </PageLayout>
    );
}

export default withLogin(CouponDetailPage);
