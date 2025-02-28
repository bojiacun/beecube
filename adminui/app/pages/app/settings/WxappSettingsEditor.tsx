import {Button, Card, FormGroup, FormLabel} from "react-bootstrap";
import {Form, Formik} from "formik";
import {handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import BootstrapInput from "~/components/form/BootstrapInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect} from "react";
import FileBrowserInput from "~/components/filebrowser/form";


const SettingsSchema = Yup.object().shape({
});
const WxappSettingsEditor = (props:any) => {
    const {settings} = props;
    const postFetcher = useFetcher();

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);

    const handleOnSubmit = (values: any) => {
        postFetcher.submit(values, {method: 'post', action:'/app/settings/update?group=wxapp'});
    }

    return (
        <Formik initialValues={settings} onSubmit={handleOnSubmit} validationSchema={SettingsSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>微信小程序</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput label={'APPID'} name={'appid'} placeholder={'微信小程序Appid'} />
                        <BootstrapInput  label={'APPSECRET'} name={'appsecret'}  placeholder={'微信小程序secret'} />
                        <BootstrapInput  label={'商户号'} name={'merchId'}  placeholder={'微信支付商户号'} />
                        <BootstrapInput  label={'商户号秘钥'} name={'merchSecret'}  placeholder={'微信支付商户号秘钥'} />
                        <FormGroup className={'mb-1'}>
                            <FormLabel htmlFor={'apiclientCert'}>apiclientCert</FormLabel>
                            <FileBrowserInput name={'apiclientCert'} type={4} multi={false} />
                        </FormGroup>
                        <FormGroup className={'mb-1'}>
                            <FormLabel htmlFor={'apiclientP12'}>apiclientP12</FormLabel>
                            <FileBrowserInput name={'apiclientP12'} type={4} multi={false} />
                        </FormGroup>
                        <FormGroup className={'mb-1'}>
                            <FormLabel htmlFor={'apiclientKey'}>apiclientKey</FormLabel>
                            <FileBrowserInput name={'apiclientKey'} type={4} multi={false} />
                        </FormGroup>
                        <BootstrapInput  label={'腾讯地图秘钥'} name={'tencentMapKey'}  placeholder={'腾讯地图秘钥'} />
                        <FormGroup className={'mb-1'}>
                            <FormLabel>个人中心版权图片</FormLabel>
                            <FileBrowserInput type={1} name={'userCenterCopyRight'} multi={false} />
                        </FormGroup>
                        <FormGroup className={'mb-1'}>
                            <FormLabel>拍卖详情页客服头像</FormLabel>
                            <FileBrowserInput type={1} name={'detailServiceAvatar'} multi={false} />
                        </FormGroup>
                        <FormGroup className={'mb-1'}>
                            <FormLabel>拍卖详情页客服企业微信二维码</FormLabel>
                            <FileBrowserInput type={1} name={'detailServiceQrcode'} multi={false} />
                        </FormGroup>
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button disabled={postFetcher.state === 'submitting'} type={'submit'}><FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default WxappSettingsEditor;
