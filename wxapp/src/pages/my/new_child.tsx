import Taro, {useRouter,  useReady} from "@tarojs/taro";
import PageLayout from "../../layouts/PageLayout";
import {
    Button,
    Form,
    Input,
    View,
    Picker,
    RadioGroup,
    Radio, Label, Text
} from "@tarojs/components";
import {useRef, useState} from "react";
import getValidator from "../../utils/validator";
import request, {
    API_MEMBER_CHILDREN_INFO, API_VERIFY_CODE, SERVICE_WINKT_COMMON_HEADER, SERVICE_WINKT_MEMBER_HEADER,
} from "../../utils/request";
import withLogin from "../../components/login/login";
import moment from "moment";
import _ from 'lodash';
import {InputProps} from "@tarojs/components/types/Input";

const startTime = moment().add(-30, 'years').format('YYYY-MM-DD');
const endTime = moment().format('YYYY-MM-DD');

const NewChild = (props) => {
    const {makeLogin, context} = props;
    const {settings} = context;
    const [posting, setPosting] = useState(false);
    const [time, setTime] = useState('请如实填写学生生日');
    const [child, setChild] = useState<any>();
    const [schools, setSchools] = useState<any[]>([]);
    const [schoolLevels, setSchoolLevels] = useState<any[]>([]);
    const [schoolClasses, setSchoolClasses] = useState<any[]>([]);
    const [selectedSchool, setSelectedSchool] = useState<any>(-1);
    const [selectedSchoolLevel, setSelectedSchoolLevel] = useState<any>(-1);
    const [selectedSchoolClass, setSelectedSchoolClass] = useState<any>(-1);
    const [vcodeTimer, setVcodeTimer] = useState(60);
    const nameRef = useRef<InputProps>();
    const realNameRef = useRef<InputProps>();
    const mobileRef = useRef<InputProps>();
    const formRef = useRef<InputProps>();
    const {params} = useRouter();

    useReady(()=>{
        request.get("wxapp/schools", SERVICE_WINKT_MEMBER_HEADER, null, false).then(res=>{
            let _schools = res.data.data;
            setSchools(_schools);
            if(params.id) {
                request.get(API_MEMBER_CHILDREN_INFO+'/'+params.id, SERVICE_WINKT_MEMBER_HEADER, null, true).then(res=>{
                    let child = res.data.data;
                    // @ts-ignore
                    nameRef.current.value = child.name;
                    // @ts-ignore
                    mobileRef.current.value = child.parent?.mobile;
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
                });
            }
        });
    });

    const onSubmit = (e) => {
        let data = {...e.detail.value};
        let validator = getValidator();
        if(params.id) {
            data.id = params.id;
        }
        if(selectedSchoolClass > -1) {
            data.schoolClass = {id: schoolClasses[selectedSchoolClass].id};
        }

        //验证数据
        validator.addRule(data, [
            {
                name: 'name',
                strategy: 'isEmpty',
                errmsg: '学生姓名不能为空'
            },
            {
                name: 'realName',
                strategy: 'isEmpty',
                errmsg: '家长姓名不能为空'
            },
            {
                name: 'mobile',
                strategy: 'isEmpty',
                errmsg: '家长手机号不能为空'
            },
            {
                name: 'gender',
                strategy: 'isEmpty',
                errmsg: '请选择性别'
            },
            {
                name: 'birthday',
                strategy: 'isEmpty',
                errmsg: '请填写生日'
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
        setPosting(true);
        data.member_id = params.member_id;
        makeLogin(() => {
            const checked = validator.check();
            if (!checked.isOk) {
                setPosting(false);
                return Taro.showModal({title: '错误提醒', content: checked.errmsg, showCancel: false});
            }
            return request.put("wxapp/member/children"+ (params.id?'/'+params.id:'/0'), SERVICE_WINKT_MEMBER_HEADER, data, true).then(() => {
                setPosting(false);
                Taro.navigateBack().then();
            }).catch(()=>setPosting(false));
        })
    }
    const selectTime = (e) => {
        console.log('time is ',e);
        setTime(e.detail.value);
    }
    const onSchoolChanged = (e) => {
        let index = parseInt(e.detail.value);
        setSelectedSchool(index);
        setSelectedSchoolLevel(-1);
        setSelectedSchoolClass(-1);
        setSchoolLevels(schools[index].levels||[]);
        setSchoolClasses([]);
    }
    const onSchoolLevelChanged = (e) => {
        let index = parseInt(e.detail.value);
        setSelectedSchoolLevel(index);
        setSelectedSchoolClass(-1);
        setSchoolClasses(schoolLevels[index].classes||[]);
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
    return (
        <PageLayout statusBarProps={{title: '编辑借阅人'}}>
            <Form onSubmit={onSubmit} ref={formRef}>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>家长姓名</View>
                    <Input style={{textAlign: 'right'}} name="realName" placeholder="请输入家长真实姓名" ref={realNameRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>家长手机号</View>
                    <Input style={{textAlign: 'right'}} name="mobile" placeholder="请输入家长手机号" ref={mobileRef} />
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
                    <View className="title"><Text className={'text-red'}>*</Text>学生姓名</View>
                    <Input style={{textAlign: 'right'}} name="name" placeholder="请输入学生姓名" ref={nameRef} />
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>性别</View>
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
                    <view className="title text-bold"><Text className={'text-red'}>*</Text>生日</view>
                    <Picker name={'birthday'} mode="date" value={time} start={startTime} end={endTime}
                            onChange={selectTime}>
                        <View className="picker">{time}</View>
                    </Picker>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>选择学校</View>
                    <Picker onChange={onSchoolChanged} value={selectedSchool} range={schools} rangeKey="name">
                        <View className="picker">
                            {selectedSchool > -1 ? schools[selectedSchool].name: '请选择学校'}
                        </View>
                    </Picker>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>选择年级</View>
                    <Picker onChange={onSchoolLevelChanged} value={selectedSchoolLevel} range={schoolLevels} rangeKey="name">
                        <View className="picker">
                            {selectedSchoolLevel > -1 ? schoolLevels[selectedSchoolLevel].name: '请选择年级'}
                        </View>
                    </Picker>
                </View>
                <View className="cu-form-group">
                    <View className="title"><Text className={'text-red'}>*</Text>选择班级</View>
                    <Picker onChange={onSchoolClassChanged} value={selectedSchoolClass} range={schoolClasses} rangeKey="name">
                        <View className="picker">
                            {selectedSchoolClass > -1 ? schoolClasses[selectedSchoolClass].name: '请选择班级'}
                        </View>
                    </Picker>
                </View>
                <Button disabled={posting} loading={posting} formType="submit"
                        className="cu-btn block lg bg-orange shadow" style={{margin: '25rpx'}}>保存</Button>
            </Form>

        </PageLayout>
    );
}


export default withLogin(NewChild)
