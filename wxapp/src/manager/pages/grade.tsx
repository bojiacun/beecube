import {useState} from "react";
import Taro, {useRouter, useReady} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import {View, Textarea, Form, Image, Button} from "@tarojs/components";
import Star from "../../components/star";
import request, {
    API_APPOINTMENT_INFO,
    API_RECYCLERS_GRADE,
    SERVICE_WINKT_ORDER_HEADER
} from "../../utils/request";
import getValidator from "../../utils/validator";


const RecyclerGrade = () => {
    const [recyclerGrade, setRecyclerGrade] = useState<number>(5);
    const [info, setInfo] = useState<any>(null);
    const [posting, setPosting] = useState<boolean>(false);
    const {params} = useRouter();

    useReady(()=>{
        loadData();
    })
    const loadData = () => {
        request.get(API_APPOINTMENT_INFO+'/'+params.id, SERVICE_WINKT_ORDER_HEADER).then(res => {
            setInfo(res.data.data);
        })
    }

    const handleRecyclerGradeChange = (v) => {
        console.log(v);
        setRecyclerGrade(v);
    }

    const postGrade = (e) => {
        const data = e.detail.value;
        data.id = info.id;
        data.recyclerGrade = recyclerGrade;
        let validator = getValidator();
        if(data.recyclerGrade <= 2) {
            validator.addRule(data, [
                {
                    name: 'recyclerGradeNote',
                    strategy: 'isEmpty',
                    errmsg: '请填写评价原因'
                }
            ]);
        }
        const checked = validator.check();
        if (!checked.isOk) {
            setPosting(false);
            return Taro.showModal({ title: '错误提醒', content: checked.errmsg, showCancel: false });
        }
        setPosting(true);
        request.post(API_RECYCLERS_GRADE, SERVICE_WINKT_ORDER_HEADER, data, true).then(()=>{
            setPosting(false);
            Taro.showToast({title: '评价成功!', icon: 'success'}).then(()=>{
                setTimeout(()=>{
                    Taro.navigateBack().then();
                }, 1000);
            });
        }).catch(()=>setPosting(false));
    }

    return (
        <PageLayout statusBarProps={{title: '评价得环保金'}}>
            <Form onSubmit={postGrade}>
                <View className="cu-card">
                    <View className="cu-item padding">
                        <View className="text-bold text-lg">
                            本次服务中用户表现如何?
                        </View>
                        <View className="margin-top">
                            <Star title="用户评价" initValue={recyclerGrade} onValueChange={handleRecyclerGradeChange}/>
                        </View>
                        {info &&
                        <View className="flex align-center margin-top">
                            <View><Image className="cu-avatar lg round margin-right" src={info?.memberAvatar} /></View>
                            <View>{info?.memberNickname}</View>
                        </View>
                        }
                        {recyclerGrade <=2 &&
                        <View className="margin-top flex align-start">
                            <View className="title" style={{width: '160rpx'}}>评价原因</View>
                            <Textarea name="recyclerGradeNote" style={{padding: '10rpx'}} maxlength={-1} placeholder="说明评价原因"/>
                        </View>
                        }
                    </View>
                </View>

                <View className={"padding"}>
                    <Button formType="submit" disabled={posting} loading={posting} className="cu-btn bg-gradual-red shadow block xl no-radius">提交评价</Button>
                </View>
            </Form>
        </PageLayout>
    );
}

export default withLogin(RecyclerGrade);
