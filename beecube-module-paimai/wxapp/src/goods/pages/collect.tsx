import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Button, Form, Input, Popup, Uploader, Picker, Field, Toast} from "@taroify/core";
import {RichText, Text, Textarea, View} from "@tarojs/components";
import styles from './collect.module.scss';
import classNames from "classnames";
import Taro from "@tarojs/taro";
import request, {API_URL} from "../../lib/request";
import utils from "../../lib/utils";
import {connect} from "react-redux";

// @ts-ignore
@connect((state: any) => (
    {
        settings: state.context.settings,
    }
))
export default class Index extends Component<any, any> {
    state:any = {
        image: null,
        classOpen: false,
        classes: [],
        classId: null,
        posting: false,
    }
    constructor(props) {
        super(props);
        this.onUpload = this.onUpload.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onValidate = this.onValidate.bind(this);
    }

    componentDidMount() {
        request.get('/paimai/api/goods/classes', {params: {type: 1}}).then(res=>{
            this.setState({classes: res.data.result});
        });
    }

    async onUpload() {
        Taro.chooseImage({count: 1, sourceType: ['album', 'camera']}).then(async res => {
            const filePath = res.tempFilePaths[0];
            const res1 = await request.get('/app/api/members/tmptoken');
            const token = res1.data.result;
            //upload image
            utils.showLoading('上传中');
            Taro.uploadFile({
                url: API_URL + '/sys/oss/file/upload',
                name: 'file',
                filePath: filePath,
                header: {
                    "X-Access-Token": token,
                    "Authorization": token,
                    "Content-Type": 'application/json'
                }
            }).then((res: any) => {
                let result = JSON.parse(res.data);
                let file = {
                    url: result.result.url,
                    name: result.result.fileName,
                }
                this.setState({image: file});
                utils.showSuccess(false, '上传成功');
            });
        });
    }
    onSubmit(e) {
        let values = e.detail.value;
        values.classId = this.state.classId?.name;
        values.image = this.state.image?.url;
        if(!values.name) {
            return Toast.open({
                style: {
                    textAlign: "left",
                },
                message: '请输入拍品名称'
            });
        }
        if(!values.classId) {
            return Toast.open({
                style: {
                    textAlign: "left",
                },
                message: '请选择拍品分类'
            });
        }
        if(!values.image) {
            return Toast.open({
                style: {
                    textAlign: "left",
                },
                message: '请上传拍品照片'
            });
        }
        if(!values.description) {
            return Toast.open({
                style: {
                    textAlign: "left",
                },
                message: '请输入拍品详情'
            });
        }
        if(!values.contactor) {
            return Toast.open({
                style: {
                    textAlign: "left",
                },
                message: '请输入联系人姓名'
            });
        }
        if(!values.phone) {
            return Toast.open({
                style: {
                    textAlign: "left",
                },
                message: '请输入联系人手机号'
            });
        }
        this.setState({posting: true});

        request.post('/paimai/api/goods/collects', values).then(res=>{
            if(res.data.result) {
                utils.showSuccess(true, '提交成功');
            }
        });
    }
    onValidate(errors) {
        console.log(errors);
    }
    render() {
        const {classOpen, classes, classId} = this.state;
        const {settings} = this.props;

        return (
            <PageLayout statusBarProps={{title: '拍品征集'}}>
                <Form onSubmit={this.onSubmit} validateTrigger={'onSubmit'}>
                    <Toast id={'toast'} />
                    <View className={'p-4 space-y-4 bg-white'}>
                        <View className={'text-xl mb-4'}>拍品信息</View>
                        <View>
                            <Form.Label className={'text-stone-400 text-sm'}>拍品名称<Text className={'text-red-600'}>*</Text></Form.Label>
                            <Field className={'!p-0'} name={'name'}>
                                <Input className={styles.collectInput} placeholder={'请输入拍品名称'} adjustPosition={true} cursorSpacing={24} alwaysEmbed={true} />
                            </Field>
                        </View>
                        <View>
                            <Form.Label className={'text-stone-400 text-sm'}>拍品分类<Text className={'text-red-600'}>*</Text></Form.Label>
                            <Input value={classId?.name} adjustPosition={true} cursorSpacing={24} alwaysEmbed={true} onClick={()=>this.setState({classOpen:true})} readonly className={styles.collectInput} placeholder={'请选择拍品分类'} />
                            <Popup mountOnEnter={false} open={classOpen} rounded placement="bottom" onClose={()=>this.setState({classOpen: false})}>
                                <Picker
                                    onCancel={() => this.setState({classOpen: false})}
                                    onConfirm={(newValue) => {
                                        if(newValue.length == 0) {
                                            newValue = [classes[0]];
                                        }
                                        this.setState({classOpen: false, classId: newValue[0]});
                                    }}
                                >
                                    <Picker.Toolbar>
                                        <Picker.Button>取消</Picker.Button>
                                        <Picker.Button>确认</Picker.Button>
                                    </Picker.Toolbar>
                                    <Picker.Column>
                                        {classes.map((item:any)=>{
                                            return (
                                                <Picker.Option value={item}>{item.name}</Picker.Option>
                                            );
                                        })};
                                    </Picker.Column>
                                </Picker>
                            </Popup>
                        </View>
                        <View>
                            <Form.Label className={'text-stone-400 text-sm'}>联系人姓名<Text className={'text-red-600'}>*</Text></Form.Label>
                            <Field className={'!p-0'} name={'contactor'}>
                                <Input adjustPosition={true} cursorSpacing={24} alwaysEmbed={true} className={styles.collectInput} placeholder={'联系人姓名'} />
                            </Field>
                        </View>
                        <View>
                            <Form.Label className={'text-stone-400 text-sm'}>联系人手机号<Text className={'text-red-600'}>*</Text></Form.Label>
                            <Field className={'!p-0'} name={'phone'}>
                                <Input className={styles.collectInput} placeholder={'联系人手机号'} adjustPosition={true} cursorSpacing={24} alwaysEmbed={true} />
                            </Field>
                        </View>
                        <View>
                            <Form.Label className={'text-stone-400 text-sm'}>拍品详细信息<Text className={'text-red-600'}>*</Text></Form.Label>
                            <Field className={'!p-0'} name={'description'}>
                                <Textarea adjustPosition={true} cursorSpacing={24} name={'description'} style={{height: 100, boxSizing: 'border-box'}} className={classNames(styles.collectInput, 'block w-full')} placeholder={'拍品详情'} />
                            </Field>
                        </View>
                        <View>
                            <Form.Label className={'text-stone-400 text-sm'}>拍品照片<Text className={'text-red-600'}>*</Text></Form.Label>
                            <Uploader value={this.state.image} className={'mt-2'} onUpload={this.onUpload} onChange={file=>this.setState({image: file})} />
                        </View>
                        <Button color={'danger'} shape={'round'} loading={this.state.posting} block formType={'submit'} disabled={this.state.posting}>确定</Button>
                        <View className={'text-stone-400 text-xs'}>
                            注意：收到拍品信息后，我们会第一时间与您取得联系（如您提交的信息不符合本公司拍品征集预期，将不做回复）
                        </View>
                    </View>
                    <View className={'mt-4 p-4 bg-white'}><RichText nodes={utils.resolveHtmlImageWidth(settings.collectNotice)} /></View>
                </Form>
            </PageLayout>
        );
    }
}
