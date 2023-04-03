import {Button, Card, FormGroup, FormLabel} from "react-bootstrap";
import {Form, Formik} from "formik";
import { handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect} from "react";
import TinymceEditor from "~/components/tinymce-editor";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";


const SettingsSchema = Yup.object().shape({
});


const PaimaiSettingsEditor = (props:any) => {
    const {settings} = props;
    const postFetcher = useFetcher();

    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);

    const handleOnSubmit = (values: any) => {
        postFetcher.submit(values, {method: 'post', action:'/paimai/goods/settings/update'});
    }


    return (
        <Formik initialValues={settings} onSubmit={handleOnSubmit} validationSchema={SettingsSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>拍品公共设置</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapSwitch label={'落槌价包含佣金'} name={'isDealCommission'} />
                        <BootstrapInput label={'一口价列表标题'} name={'buyoutListTitle'} placeholder={'一口价列表标题'} />
                        <BootstrapInput label={'所有拍品列表标题'} name={'auctionListTitle'} placeholder={'所有拍品列表标题'} />
                        <BootstrapInput label={'开始提醒模板ID'} name={'startTemplateId'} placeholder={'开始提醒模板ID，公共库模板编号为：5314'} />
                        <BootstrapInput  label={'结束提醒模板ID'} name={'endTemplateId'}  placeholder={'结束提醒模板ID，公共库模板编号为：1578'} />
                        <BootstrapInput  label={'出价结果通知模板ID'} name={'offerResultTemplateId'}  placeholder={'出价结果通知模板ID，公共库模板编号为：1935'} />
                        <BootstrapInput  label={'出价结果通知模板ID'} name={'offerResultTemplateId'}  placeholder={'出价结果通知模板ID，公共库模板编号为：1935'} />

                        <BootstrapInput  label={'即购APPID'} name={'zegoAppId'}  placeholder={'即购直播的应用ID'} />
                        <BootstrapInput  label={'即购AppSign'} name={'zegoAppSign'}  placeholder={'即购直播的即购AppSign'} />
                        <BootstrapInput  label={'即购ServerSecret'} name={'zegoServerSecret'}  placeholder={'即购直播的应用ID'} />
                        <BootstrapInput  label={'即购Server地址'} name={'zegoServerAddress'}  placeholder={'即购直播的Server地址'} />
                        <BootstrapInput  label={'即购CallbackSecret'} name={'zegoCallbackSecret'}  placeholder={'即购直播的CallbackSecret'} />
                        <BootstrapInput  label={'即购小程序 LogUrl'} name={'zegoLogUrl'}  placeholder={'即购直播的小程序 LogUrl'} />

                        <FormGroup>
                            <FormLabel htmlFor={'descFlow'}>拍品流程</FormLabel>
                            <TinymceEditor name={'descFlow'} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor={'descDelivery'}>物流运输</FormLabel>
                            <TinymceEditor name={'descDelivery'} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor={'descNotice'}>注意事项</FormLabel>
                            <TinymceEditor name={'descNotice'} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor={'descRead'}>拍卖须知</FormLabel>
                            <TinymceEditor name={'descRead'} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor={'descDeposit'}>保证金说明</FormLabel>
                            <TinymceEditor name={'descDeposit'} />
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

export default PaimaiSettingsEditor;