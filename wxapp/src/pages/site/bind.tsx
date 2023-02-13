import Taro, {useRouter} from "@tarojs/taro";
import {useEffect, useRef, useState} from "react";
import request, {
    API_MEMBER_INFO,
    API_SITES_INFO, API_VERIFY_CODE, SERVICE_WINKT_COMMON_HEADER,
    SERVICE_WINKT_MEMBER_HEADER,
    SERVICE_WINKT_SYSTEM_HEADER
} from "../../utils/request";
import PageLayout from "../../layouts/PageLayout";
import {
    Button,
    Form,
    Input,
    Label, OfficialAccount,
    Picker,
    Radio,
    RadioGroup,
    RichText,
    ScrollView,
    Text,
    View
} from "@tarojs/components";
import withLogin from "../../components/login/login";
import {setUserInfo} from "../../store/actions";
import NotLogin from "../../components/notlogin";
import classNames from "classnames";
import _ from "lodash";
import {InputProps} from "@tarojs/components/types/Input";
import getValidator from "../../utils/validator";
import moment from "moment";

const startTime = moment().add(-30, 'years').format('YYYY-MM-DD');
const endTime = moment().format('YYYY-MM-DD');

const SiteVipBindPage = (props: any) => {
    const {makeLogin, dispatch, context, checkLogin} = props;
    const {settings} = context;
    const [site, setSite] = useState<any>();
    const [levels, setLevels] = useState<any[]>([]);
    const [level, setLevel] = useState<any>();
    const [child, setChild] = useState<any>();
    const [time, setTime] = useState('请如实填写学生生日');
    const [licenseVisible, setLicenseVisible] = useState(false);
    const [posting, setPosting] = useState<boolean>(false);
    const [agree, setAgree] = useState<boolean>(false);
    const [schools, setSchools] = useState<any[]>([]);
    const [schoolLevels, setSchoolLevels] = useState<any[]>([]);
    const [schoolClasses, setSchoolClasses] = useState<any[]>([]);
    const [selectedSchool, setSelectedSchool] = useState<any>(-1);
    const [selectedSchoolLevel, setSelectedSchoolLevel] = useState<any>(-1);
    const [selectedSchoolClass, setSelectedSchoolClass] = useState<any>(-1);
    const [vcodeTimer, setVcodeTimer] = useState(60);
    const {params} = useRouter();
    const isLogin = checkLogin();
    const nameRef = useRef<InputProps>();
    const realNameRef = useRef<InputProps>();
    const mobileRef = useRef<InputProps>();
    const formRef = useRef<InputProps>();
    let checkTimer;
    const loadData = () => {
        Taro.showLoading({title: '加载中...'}).then();
        request.get("wxapp/schools", SERVICE_WINKT_MEMBER_HEADER, null, false).then(res=>{
            let _schools = res.data.data;
            setSchools(_schools);
            if (params.id) {
                request.get(API_SITES_INFO + "/" + params.id, SERVICE_WINKT_SYSTEM_HEADER, null, false).then(res => {
                    let _site = res.data.data;
                    _site.borrowNotice = _site.borrowNotice?.replace(/<img /ig, '<img style="max-width:100%;height:auto;display:block;margin:10px 0;" ');
                    setSite(_site);
                    request.get("wxapp/levels/sites/" + _site.id, SERVICE_WINKT_MEMBER_HEADER, null, false).then(res => {
                        setLevels(res.data.data);
                        request.get("wxapp/member/children/default", SERVICE_WINKT_MEMBER_HEADER, null, true).then(res=>{
                            let child = res.data.data;
                            if(child) {
                                // @ts-ignore
                                nameRef.current.value = child.name;
                                // @ts-ignore
                                mobileRef.current.value = child.mobile;
                                setChild(child);
                                setTime(child.birthday);
                                let schoolId = child.schoolClass.level.school.id;
                                let levelId = child.schoolClass.level.id;
                                let classId = child.schoolClass.id;
                                let selectedSchoolIndex = _.findIndex(_schools, {id: schoolId});
                                setSelectedSchool(selectedSchoolIndex);
                                setSchoolLevels(_schools[selectedSchoolIndex].levels);
                                let levelIndex = _.findIndex(_schools[selectedSchoolIndex].levels, {id: levelId});
                                setSelectedSchoolLevel(levelIndex);
                                setSchoolClasses(_schools[selectedSchoolIndex].levels[levelIndex].classes);
                                let classIndex = _.findIndex(_schools[selectedSchoolIndex].levels[levelIndex].classes, {id: classId});
                                setSelectedSchoolClass(classIndex);
                            }
                            Taro.hideLoading();
                        });
                    });
                });
            }
        });

    }

    const closeLicense = () => {
        setLicenseVisible(false);
    }
    useEffect(() => {
        loadData();
        return () => {
            clearInterval(checkTimer);
        }
    }, []);

    const toggleAgree = () => {
        setAgree(!agree);
    }

    const selectTime = (e) => {
        setTime(e.detail.value);
    }
    const onSchoolChanged = (e) => {
        let index = parseInt(e.detail.value);
        setSelectedSchool(index);
        setSchoolLevels(schools[index].levels);
    }
    const onSchoolLevelChanged = (e) => {
        let index = parseInt(e.detail.value);
        setSelectedSchoolLevel(index);
        setSchoolClasses(schoolLevels[index].classes);
    }
    const onSchoolClassChanged = (e) => {
        let index = parseInt(e.detail.value);
        setSelectedSchoolClass(index);
    }
    const onSexChange = (e) => {
        console.log(e);
    }
    const sendVCode = () => {
        let mobile = mobileRef.current?.value;
        let timer: any = null;
        if (mobile?.length != 11) {
            return Taro.showModal({ title: '错误提醒', content: '请输入正确的手机号码', showCancel: false });
        }
        // 倒计时
        setVcodeTimer(59);
        timer = setInterval(() => {
            setVcodeTimer(v => {
                if (v > 0) {
                    return v - 1;
                } else {
                    clearInterval(timer);
                    return 60;
                }
            });
        }, 1000);
        request.post(API_VERIFY_CODE, SERVICE_WINKT_COMMON_HEADER,{ mobile: mobile }).then(() => {
            Taro.showToast({title: '发送验证码成功', icon: 'none'}).then();
        }).catch(()=>{
            setVcodeTimer(60);
            clearInterval(timer);
        });
    }
    const onSubmit = (e) => {
        let data = {...e.detail.value};
        let validator = getValidator();
        if(params.id) {
            data.id = params.id;
        }
        if(selectedSchoolClass > -1) {
            data.schoolClass = {id: schoolClasses[selectedSchoolClass].id};
        }
        if(data.birthday === '请如实填写学生生日') {
            data.birthday = null;
        }

        //验证数据
        validator.addRule(data, [
            {
                name: 'name',
                strategy: 'isEmpty',
                errmsg: '孩子姓名不能为空'
            },
            {
                name: 'realName',
                strategy: 'isEmpty',
                errmsg: '家长姓名不能为空'
            },
            {
                name: 'mobile',
                strategy: 'isEmpty',
                errmsg: '手机号不能为空'
            },
        ]);
        if (settings.requireVerifyCode === 'true') {
            validator.addRule(data, [
                {
                    name: 'vcode',
                    strategy: 'isEmpty',
                    errmsg: '验证码不能为空'
                },
            ]);
        }
        //如果是校区
        if(site?.siteType == 1) {
            validator.addRule(data, [
                {
                    name: 'gender',
                    strategy: 'isEmpty',
                    errmsg: '请选择性别'
                },
                {
                    name: 'birthday',
                    strategy: 'isEmpty',
                    errmsg: '请选择生日'
                },
                {
                    name: 'schoolClass',
                    strategy: 'isEmpty',
                    errmsg: '请选择班级'
                },
            ]);
        }
        setPosting(true);
        data.member_id = params.member_id;
        const checked = validator.check();
        if (!checked.isOk) {
            setPosting(false);
            return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
        }

        if (!level) {
            return Taro.showToast({title: '请选择要购买的会员', icon: 'none'}).then();
        }
        if (!agree) {
            return Taro.showToast({title: '请同意借阅须知', icon: 'none'}).then();
        }
        if(child) {
            data.id = child.id;
        }
        setPosting(true);
        makeLogin(() => {
            request.post("wxapp/levels/buy/" + level.id, SERVICE_WINKT_MEMBER_HEADER, data, true).then(res => {
                let data = res.data.data;
                data.package = data.packageValue;
                Taro.requestPayment(data).then(() => {
                    //支付已经完成，提醒支付成功并返回上一页面
                    Taro.showToast({title: '微信支付成功', duration: 2000}).then(() => {
                        setTimeout(() => {
                            Taro.showLoading({title: '验证中...'}).then();
                            checkTimer = setInterval(() => {
                                //刷新会员信息
                                request.get(API_MEMBER_INFO, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res => {
                                    let memberInfo = res.data.data;
                                    if (parseInt(memberInfo.siteId) > 0) {
                                        //成功绑定了会员
                                        context.userInfo.memberInfo = memberInfo;
                                        dispatch(setUserInfo(context.userInfo));
                                        Taro.setStorageSync("userInfo", context.userInfo);
                                        clearInterval(checkTimer);
                                        Taro.showToast({title: '绑定门店成功!', icon: 'success'}).then();
                                        setTimeout(() => {
                                            Taro.navigateBack().then();
                                        }, 1000);
                                    }
                                })
                            }, 1000);
                        }, 1000);
                        setPosting(false);
                    });
                }).catch(() => setPosting(false));
            }).catch(() => setPosting(false));
        })
    }
    return (
        <PageLayout showStatusBar={true} statusBarProps={{title: '购买门店会员'}} showTabBar={false}>
            {!isLogin && <NotLogin onLogin={() => loadData()}/>}
            {isLogin && site &&
                <Form onSubmit={onSubmit} ref={formRef}>
                    <View className="cu-form-group">
                        <View className="title"><Text className={'text-red'}>*</Text>家长姓名</View>
                        <Input style={{textAlign: 'right'}} name="realName" placeholder="请输入家长真实姓名" ref={realNameRef} />
                    </View>
                    <View className="cu-form-group">
                        <View className="title"><Text className={'text-red'}>*</Text>手机号</View>
                        <Input style={{textAlign: 'right'}} name="mobile" placeholder="请输入手机号" ref={mobileRef} />
                    </View>
                    {settings.requireVerifyCode === 'true' &&
                        <View className="cu-form-group">
                            <View className="title"><Text className={'text-red'}>*</Text>验证码</View>
                            <Input name="vcode" placeholder="请输入手机验证码" />
                            <Button disabled={vcodeTimer < 60} className="cu-btn bg-orange shadow"
                                    onClick={sendVCode}>{vcodeTimer < 60 ? vcodeTimer : '验证码'}</Button>
                        </View>
                    }
                    <View className="cu-form-group">
                        <View className="title"><Text className={'text-red'}>*</Text>孩子姓名</View>
                        <Input style={{textAlign: 'right'}} name="name" placeholder="请输入孩子姓名" ref={nameRef} />
                    </View>
                    <View className="cu-form-group">
                        <View className="title">{site?.siteType == 1 && <Text className={'text-red'}>*</Text>}性别</View>
                        <RadioGroup name={'gender'} className={'flex align-center'} onChange={onSexChange}>
                            <Label className={'margin-right'}>
                                <Radio value={'1'} checked={child?.gender == 1} className={'margin-right-xs orange'} /> 男
                            </Label>
                            <Label className={''}>
                                <Radio value={'2'} checked={child?.gender == 2} className={'margin-right-xs orange'} />女
                            </Label>
                        </RadioGroup>
                    </View>
                    <View className="cu-form-group">
                        <view className="title">{site?.siteType == 1 && <Text className={'text-red'}>*</Text>}生日</view>
                        <Picker name={'birthday'} mode="date" value={time} start={startTime} end={endTime}
                                onChange={selectTime}>
                            <View className="picker">{time}</View>
                        </Picker>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">{site?.siteType == 1 && <Text className={'text-red'}>*</Text>}选择学校</View>
                        <Picker onChange={onSchoolChanged} value={selectedSchool} range={schools} rangeKey="name">
                            <View className="picker">
                                {selectedSchool > -1 ? schools[selectedSchool].name: '请选择学校'}
                            </View>
                        </Picker>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">{site?.siteType == 1 && <Text className={'text-red'}>*</Text>}选择年级</View>
                        <Picker onChange={onSchoolLevelChanged} value={selectedSchoolLevel} range={schoolLevels} rangeKey="name">
                            <View className="picker">
                                {selectedSchoolLevel > -1 ? schoolLevels[selectedSchoolLevel].name: '请选择年级'}
                            </View>
                        </Picker>
                    </View>
                    <View className="cu-form-group">
                        <View className="title">{site?.siteType == 1 && <Text className={'text-red'}>*</Text>}选择班级</View>
                        <Picker onChange={onSchoolClassChanged} value={selectedSchoolClass} range={schoolClasses} rangeKey="name">
                            <View className="picker">
                                {selectedSchoolClass > -1 ? schoolClasses[selectedSchoolClass].name: '请选择班级'}
                            </View>
                        </Picker>
                    </View>
                    <View className="bg-white padding-bottom">
                        <View className={'padding-left padding-right'}>
                            <View className={'text-black text-bold text-xl margin-right margin-bottom-sm'}>门店会员</View>
                            <ScrollView scrollX style={{width: '100%', whiteSpace: 'nowrap'}}>
                                {levels.map((item: any) => {
                                    return (
                                        <View onClick={() => setLevel(item)}
                                              className={classNames('cu-tag flex-direction margin-right-sm radius justify-around padding-sm', level?.id == item.id ? 'line-orange' : '')}
                                              style={{height: Taro.pxTransform(100), display: 'inline-flex'}}>
                                            <View className={'text-lg'}>{item.name}</View>
                                            <View className={'text-gray'}>有效期：{item.days} 天</View>
                                            <View className={'text-gray'}>会员费：￥{item.price}</View>
                                            <View className={'text-gray'}>押金：￥{item.deposit}</View>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                    <OfficialAccount />
                    <View className={'tabbar cu-bar flex-direction'}
                          style={{position: 'fixed', bottom: 0, left: 0, right: 0, height: 90}}>
                        <View className="padding-xs text-gray text-sm" onClick={toggleAgree}><Radio
                            className={'orange small margin-right-xs'} checked={agree}/>购买会员即是接受 <Text className="text-green"
                                                                                                       onClick={() => setLicenseVisible(true)}>《没大没小借阅须知》</Text></View>
                        <Button formType={'submit'} loading={posting} disabled={!level || posting}
                                className={'cu-btn bg-orange lg block no-radius flex-sub'}
                                style={{width: '100%'}}>{levels.length > 0 ? '购买门店会员' : '门店暂无会员'}</Button>
                    </View>
                </Form>
            }

            <View className={classNames("cu-modal", licenseVisible ? 'show' : '')}>
                <View className="cu-dialog bg-white radius-lg">
                    <View className="cu-bar justify-end">
                        <View className="content">借阅须知</View>
                        <View className="action">
                            <Text className="cuIcon-close" onClick={closeLicense}/>
                        </View>
                    </View>
                    <ScrollView scrollY className="padding-sm" style={{height: Taro.pxTransform(400)}}>
                        <RichText nodes={site?.borrowNotice} space={'nbsp'} />
                    </ScrollView>
                </View>
            </View>
        </PageLayout>
    );
}

export default withLogin(SiteVipBindPage);
