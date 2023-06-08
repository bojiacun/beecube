import React, {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Button, Form, Input, Popup, Uploader, Picker, Field} from "@taroify/core";
import {View} from "@tarojs/components";
import styles from './collect.module.scss';
import NativeTextarea from "@taroify/core/textarea/native-textarea";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import request, {API_URL} from "../../lib/request";
import utils from "../../lib/utils";


export default class Index extends Component<any, any> {
    state:any = {
        image: null,
        classOpen: false,
        classes: [],
        classId: null,
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
            const files = res.tempFiles;
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
        console.log('submit', e);
    }
    onValidate(errors) {
        console.log(errors);
    }
    render() {
        const {classOpen, classes, classId} = this.state;

        return (
            <PageLayout statusBarProps={{title: '拍品征集'}} style={{backgroundColor: 'white'}}>
                <Form onSubmit={this.onSubmit}>
                    <View className={'p-4 space-y-4'}>
                        <View className={'font-bold text-xl mb-4'}>拍品信息</View>
                        <Form.Item name={'name'} rules={[{required: true}]} required>
                            <Form.Label className={'text-lg'}>拍品名称</Form.Label>
                            <Form.Control>
                                <Input className={styles.collectInput} placeholder={'请输入拍品名称'}/>
                            </Form.Control>
                        </Form.Item>
                        <View>
                            <Form.Label className={'text-lg'}>拍品分类</Form.Label>
                            <Input value={classId?.name} onClick={()=>this.setState({classOpen:true})} readonly className={styles.collectInput} placeholder={'请选择拍品分类'} />
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
                            <Form.Label className={'text-lg'}>联系人姓名</Form.Label>
                            <Field className={'!p-0'} name={'contactor'}>
                                <Input className={styles.collectInput} placeholder={'联系人姓名'} />
                            </Field>
                        </View>
                        <View>
                            <Form.Label className={'text-lg'}>联系人手机号</Form.Label>
                            <Field className={'!p-0'} name={'phone'}>
                                <Input className={styles.collectInput} placeholder={'联系人手机号'} />
                            </Field>
                        </View>
                        <View>
                            <Form.Label className={'text-lg'}>拍品详细信息</Form.Label>
                            <Field className={'!p-0'} name={'description'}>
                                <NativeTextarea style={{height: 100, boxSizing: 'border-box'}} className={classNames(styles.collectInput, 'block w-full')} placeholder={'拍品详情'} />
                            </Field>
                        </View>
                        <View>
                            <Form.Label className={'text-lg'}>拍品照片</Form.Label>
                            <Uploader value={this.state.image} className={'mt-2'} onUpload={this.onUpload} onChange={file=>this.setState({image: file})} />
                        </View>
                        <Button color={'danger'} shape={'round'} block formType={'submit'}>确定</Button>
                    </View>
                </Form>
            </PageLayout>
        );
    }
}
