import {useEffect, useState} from "react";
import {Button, Form, Navigator, Text, Video, View} from "@tarojs/components";
import Taro, {useRouter} from '@tarojs/taro';
import PageLayout from "../../layouts/PageLayout";
import withLogin from "../../components/login/login";
import getValidator from "../../utils/validator";
import request, {
    API_UPLOADFILE,
    resolveUrl,
    SERVICE_WINKT_COMMON_HEADER,
    SERVICE_WINKT_SYSTEM_HEADER,
} from "../../utils/request";
import util from '../../utils/we7/util';


const ActivityUpload = (props) => {
    const {makeLogin, checkLogin} = props;
    const [pictures, setPictures] = useState<any>([]);
    const [activity, setActivity] = useState<any>();
    const [mywork, setMywork] = useState<any>();
    const [posting, setPosting] = useState(false);
    const {params} = useRouter();
    const isLogin = checkLogin();

    useEffect(() => {
        if (params.id) {
            request.get("wxapp/activities/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                setActivity(res.data.data);
            });
            if(isLogin) {
                loadData();
            }
        }
    }, [params]);

    const loadData = () => {
        //获取我上传的作品
        request.get("wxapp/activity/records/my/works/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, true).then(res => {
            setMywork(res.data.data);
        })
    }

    const chooseImage = (index) => {
        let fileManager = Taro.getFileSystemManager();
        if (activity.type == 1) {
            //图片
            Taro.chooseImage({
                count: 1, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], //从相册选择
            }).then(res => {
                let file = res.tempFilePaths[0];
                fileManager.getFileInfo({
                    filePath: file,
                    success: async (res) => {
                        let fileSize = res.size;
                        Taro.showLoading({title: '正在上传文件'}).then();
                        if(fileSize < 2*1024*1024) {
                            //如果文件小于2M，则一次性上传
                            Taro.uploadFile({
                                url: util.url(API_UPLOADFILE),
                                filePath: file,
                                name: 'file',
                                header: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'X-Requested-Service': SERVICE_WINKT_COMMON_HEADER,
                                    'Authorization': 'Bearer ' + util.getToken()
                                },
                                formData: {'chunks': 1, 'chunk': 0, name: file, 'type': 1}
                            }).then((res: any) => {
                                let data = JSON.parse(res.data);
                                pictures[index] = data.data;
                                setPictures([...pictures]);
                                Taro.hideLoading();
                            });
                        }
                        else {
                            //如果文件大于2M，则分段上传
                            let offset = 0;
                            let step = 2 * 1024 * 1024;
                            let chunks = Math.ceil(fileSize / step);
                            for (let i = 0; i < chunks; i++) {
                                let chunk = i;
                                offset = chunk * step;
                                let tempChunkFileName = file + '_chunk' + chunk;
                                let length = (offset + step) > fileSize ? (fileSize - offset) : step;
                                let chunkData = fileManager.readFileSync(file, 'binary', offset, length);
                                fileManager.writeFileSync(tempChunkFileName, chunkData, "binary");
                                let res = await Taro.uploadFile({
                                    url: util.url(API_UPLOADFILE),
                                    filePath: tempChunkFileName,
                                    name: 'file',
                                    header: {
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'X-Requested-Service': SERVICE_WINKT_COMMON_HEADER,
                                        'Authorization': 'Bearer ' + util.getToken()
                                    },
                                    formData: {'chunks': chunks, 'chunk': chunk, name: file, 'type': 1}
                                });
                                if(i == chunks -1) {
                                    // @ts-ignore
                                    let data = JSON.parse(res.data);
                                    pictures[index] = data.data;
                                    setPictures([...pictures]);
                                    Taro.hideLoading();
                                }
                            }
                        }
                    },
                    fail: ()=> {
                        Taro.showToast({title: '文件读取失败'}).then();
                    }
                });
            }).catch(() => {
                Taro.hideLoading();
            })
        } else {
            let maxDuration = activity?.maxSeconds ? activity.maxSeconds: 120;
            Taro.chooseVideo({
                sourceType: ['album', 'camera'], //从相册选择
                maxDuration: 60,
            }).then(async res => {
                let file = res.tempFilePath;
                try {
                    let videoInfo = await Taro.getVideoInfo({src: file});
                    console.log("选择的视频文件信息为,最大上传时长为", videoInfo, maxDuration);
                    // @ts-ignore
                    if (parseInt(videoInfo.duration) > maxDuration) {
                        return Taro.showToast({title: '视频不能超过' + maxDuration + '秒', icon: 'none'}).then();
                    }
                }
                catch (ex) {
                    console.log(ex);
                }
                fileManager.getFileInfo({
                    filePath: file,
                    success: async (res) => {
                        let fileSize = res.size;
                        Taro.showLoading({title: '正在上传文件'}).then();
                        if(fileSize < 2*1024*1024) {
                            //如果文件小于2M，则一次性上传
                            Taro.uploadFile({
                                url: util.url(API_UPLOADFILE),
                                filePath: file,
                                name: 'file',
                                header: {
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'X-Requested-Service': SERVICE_WINKT_COMMON_HEADER,
                                    'Authorization': 'Bearer ' + util.getToken()
                                },
                                formData: {'chunks': 1, 'chunk': 0, name: file, 'type': 3}
                            }).then((res: any) => {
                                let data = JSON.parse(res.data);
                                pictures[index] = data.data;
                                setPictures([...pictures]);
                                Taro.hideLoading();
                            });
                        }
                        else {
                            //如果文件大于2M，则分段上传
                            let offset = 0;
                            let step = 2 * 1024 * 1024;
                            let chunks = Math.ceil(fileSize / step);
                            console.log('开始大文件上传',file, fileSize, offset, step, chunks);
                            for (let i = 0; i < chunks; i++) {
                                let chunk = i;
                                offset = chunk * step;
                                let tempChunkFileName = Taro.env.USER_DATA_PATH + '/' + util.md5(file) + '_chunk' + chunk;
                                let length = (offset + step) > fileSize ? (fileSize - offset) : step;
                                let chunkData = fileManager.readFileSync(file, 'binary', offset, length);
                                fileManager.writeFileSync(tempChunkFileName, chunkData, "binary");
                                console.log("开始上传分块文件", chunk, tempChunkFileName);
                                let res = await Taro.uploadFile({
                                    url: util.url(API_UPLOADFILE),
                                    filePath: tempChunkFileName,
                                    name: 'file',
                                    header: {
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'X-Requested-Service': SERVICE_WINKT_COMMON_HEADER,
                                        'Authorization': 'Bearer ' + util.getToken()
                                    },
                                    formData: {'chunks': chunks, 'chunk': chunk, name: file, 'type': 3}
                                });
                                console.log('分块文件上传返回结果为',res);
                                if(i == chunks -1) {
                                    // @ts-ignore
                                    let data = JSON.parse(res.data);
                                    pictures[index] = data.data;
                                    setPictures([...pictures]);
                                    Taro.hideLoading();
                                }
                            }
                        }
                    },
                    fail: ()=> {
                        Taro.showToast({title: '文件读取失败'}).then();
                    }
                });
            }).catch((error) => {
                console.log(error);
                Taro.hideLoading();
            })
        }

    }
    const onFinish = (e) => {
        let validator = getValidator();
        let data = {...e.detail.value};
        if (pictures.length === 1) {
            data.pictures = [...pictures];
        }
        setPosting(true);
        //验证数据
        validator.addRule(data, [
            {
                name: 'pictures',
                strategy: 'isEmpty',
                errmsg: '请上传需要的作品'
            },
        ]);
        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
            }
            setPosting(true);
            data.attachment = pictures[0];
            return request.post("wxapp/activities/upload/" + activity.id, SERVICE_WINKT_SYSTEM_HEADER, data, true).then(() => {
                setPosting(false);
                Taro.showToast({title: '上传成功', icon: 'success'}).then();
                setTimeout(() => {
                    Taro.navigateBack().then();
                }, 1000);
            }).catch(() => setPosting(false));

        })
    }
    // @ts-ignore
    return (
        <PageLayout statusBarProps={{title: '上传作品'}}>
            <Form onSubmit={onFinish}>
                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">上传您的作品</Text>
                        <Text className="bg-gradual-green" style="width:3rem"/>
                    </View>
                </View>
                <View className="padding bg-white">
                    作品上传后需要审核，审核通过获得大小豆，作品内容为视频或者图片，重新上传作品需要重新审核
                </View>

                <View className="cu-bar bg-gray-2">
                    <View className="action border-title">
                        <Text className="text-xl text-bold">{activity?.name}作品</Text>
                        <Text className="bg-gradual-green" style="width:3rem"/>
                    </View>
                </View>
                <View className="padding bg-white">
                    {activity?.type == 1 &&
                        <View className="grid col-1">
                            <View onClick={() => chooseImage(0)} style={{
                                height: '360rpx',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                                backgroundImage: pictures[0] ? 'url(' + resolveUrl(pictures[0]) + ')' : 'none'
                            }}
                                  className="bg-gray margin-bottom-sm padding radius-lg flex align-center justify-center flex-direction">
                                {
                                    !pictures[0] &&
                                    <> <Text className="cuIcon-add" style={{fontSize: 48, color: '#aaa'}}/>
                                        <View>您的作品</View></>
                                }
                            </View>
                        </View>
                    }
                    {activity?.type == 2 &&
                        <View className="grid col-1">
                            <View onClick={() => chooseImage(0)} style={{
                                height: '360rpx',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                            }}
                                  className="bg-gray margin-bottom-sm padding radius-lg flex align-center justify-center flex-direction">
                                {
                                    !pictures[0] &&
                                    <> <Text className="cuIcon-add" style={{fontSize: 48, color: '#aaa'}}/>
                                        <View>您的作品</View></>
                                }
                                {pictures[0] && <Video src={resolveUrl(pictures[0])} controls={false} autoplay={true}/>}
                            </View>
                        </View>
                    }
                    {isLogin &&
                        <View style={{width: '100%'}} className={'flex'}>
                            {mywork && mywork.activity.type == 1 && <Navigator url={`image?id=${mywork.id}`}
                                                                               className={'cu-btn block lg flex-sub bg-green margin-right-sm'}>我的作品</Navigator>}
                            {mywork && mywork.activity.type == 2 && <Navigator url={`video?id=${mywork.id}`}
                                                                               className={'cu-btn block lg flex-sub bg-green margin-right-sm'}>我的作品</Navigator>}
                            <Button disabled={posting} loading={posting} formType="submit"
                                    className="cu-btn block lg bg-orange flex-sub no-radius">提交作品</Button>
                        </View>
                    }
                    {!isLogin && <Button className="cu-btn bg-gradual-orange shadow block lg radius" onClick={() => makeLogin(()=>loadData())}>点击登录</Button>}
                </View>
            </Form>
        </PageLayout>
    );
}

export default withLogin(ActivityUpload)
