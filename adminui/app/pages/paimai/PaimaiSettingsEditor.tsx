import {Button, Card, FormGroup, FormLabel} from "react-bootstrap";
import {Form, Formik} from "formik";
import { handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import TinymceEditor from "~/components/tinymce-editor";
import BootstrapInput from "~/components/form/BootstrapInput";
import BootstrapSwitch from "~/components/form/BootstrapSwitch";
import FileBrowserInput from "~/components/filebrowser/form";
import BootstrapLinkSelector from "~/components/form/BootstrapLinkSelector";


const SettingsSchema = Yup.object().shape({
});


const PaimaiSettingsEditor = (props:any) => {
    const {settings} = props;
    const [links, setLinks] = useState<any[]>([]);
    const postFetcher = useFetcher();
    const searchFetcher = useFetcher();

    useEffect(()=>{
        searchFetcher.load("/app/links");
    }, []);
    useEffect(() => {
        if (postFetcher.type === 'done' && postFetcher.data) {
            handleSaveResult(postFetcher.data);
        }
    }, [postFetcher.state]);
    useEffect(() => {
        if (searchFetcher.type === 'done' && searchFetcher.data) {
            setLinks(searchFetcher.data);
        }
    }, [searchFetcher.state]);

    const handleOnSubmit = (values: any) => {
        postFetcher.submit(values, {method: 'post', action:'/paimai/goods/settings/update'});
    }
    settings.isCustomOffer = parseInt(settings.isCustomOffer);
    settings.isDealCommission = parseInt(settings.isDealCommission);


    return (
        <Formik initialValues={settings} onSubmit={handleOnSubmit} validationSchema={SettingsSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>拍品公共设置</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput label={'小程序名称'} name={'wxAppName'} placeholder={'设置小程序名称'} />
                        <BootstrapSwitch label={'落槌价包含佣金'} name={'isDealCommission'} />
                        <BootstrapSwitch label={'实名认证'} name={'requireRealAuth'} placeholder={'拍卖流程中是否需要实名认证'} />
                        <BootstrapSwitch label={'自定义出价'} name={'isCustomOffer'} />
                        <BootstrapInput label={'微信客服企业ID'} name={'wxServiceChatCropId'} placeholder={'微信客服企业ID'} />
                        <BootstrapInput label={'微信客服客服链接'} name={'wxServiceChatUrl'} placeholder={'微信客服客服链接'} />
                        <BootstrapInput label={'一口价列表标题'} name={'buyoutListTitle'} placeholder={'一口价列表标题'} />
                        <BootstrapInput label={'所有拍品列表标题'} name={'auctionListTitle'} placeholder={'所有拍品列表标题'} />
                        <BootstrapInput label={'图文类文章标题'} name={'articleNormalIndexTitle'} placeholder={'图文类文章频道首页标题'} />
                        <BootstrapInput label={'视频类文章标题'} name={'articleVideoIndexTitle'} placeholder={'视频类文章频道首页标题'} />
                        <BootstrapInput label={'订单未支付通知模板ID'} name={'orderNotPayTemplateId'} placeholder={'订单未支付通知模板ID'} />
                        <BootstrapInput label={'订单未支付通知参数'} name={'orderNotPayTemplateArgs'} placeholder={'形式如id:{id};xxx:{xxx}，前面的变量为模板消息中的变量，后面的变量为系统可用变量，系统可用变量有订单ID：{orderId}、下单时间：{createTime}、下单商品名称:{goodsNames}、支付到期时间:{endPayTime}'} />
                        <BootstrapInput label={'订单发货通知模板ID'} name={'orderDeliveryTemplateId'} placeholder={'订单发货通知模板ID'} />
                        <BootstrapInput label={'订单发货通知参数'} name={'orderDeliveryTemplateArgs'} placeholder={'形式如id:{id};xxx:{xxx}，前面的变量为模板消息中的变量，后面的变量为系统可用变量，系统可用变量有订单ID：{orderId}、下单时间：{createTime}、下单商品名称:{goodsNames}、发货单号:{deliveryCode}'} />
                        <FormGroup className={'mb-1'}>
                            <FormLabel>文章频道广告</FormLabel>
                            <FileBrowserInput type={1} name={'articleNormalAdv'} multi={false} />
                        </FormGroup>
                        <BootstrapLinkSelector label={'文章频道广告链接地址'} links={links} name={'articleNormalAdvLink'} initValue={settings.articleNormalAdvLink}  />
                        <FormGroup className={'mb-1'}>
                            <FormLabel>个人中心广告</FormLabel>
                            <FileBrowserInput type={1} name={'myIndexAdv'} multi={false} />
                        </FormGroup>
                        <BootstrapLinkSelector label={'个人中心广告链接地址'} links={links} name={'myIndexAdvLink'} initValue={settings.myIndexAdvLink}  />
                        <FormGroup className={'mb-1'}>
                            <FormLabel>实名认证Banner</FormLabel>
                            <FileBrowserInput type={1} name={'authPageBanner'} multi={false} />
                        </FormGroup>
                        <BootstrapInput label={'积分兑换比例'} name={'integralRatio'} placeholder={'1元相当于多少积分'} />
                        <BootstrapInput label={'开始提醒模板ID'} name={'startTemplateId'} placeholder={'开始提醒模板ID，公共库模板编号为：5314'} />
                        <BootstrapInput  label={'结束提醒模板ID'} name={'endTemplateId'}  placeholder={'结束提醒模板ID，公共库模板编号为：1578'} />
                        <BootstrapInput  label={'出价结果通知模板ID'} name={'offerResultTemplateId'}  placeholder={'出价结果通知模板ID，公共库模板编号为：1935'} />
                        <FormGroup className={'mb-1'}>
                            <FormLabel htmlFor={'collectNotice'}>征集联系方式</FormLabel>
                            <TinymceEditor name={'collectNotice'} />
                        </FormGroup>
                        <FormGroup className={'mb-1'}>
                            <FormLabel htmlFor={'descFlow'}>拍品流程</FormLabel>
                            <TinymceEditor name={'descFlow'} />
                        </FormGroup>
                        <FormGroup className={'mb-1'}>
                            <FormLabel htmlFor={'descDelivery'}>物流运输</FormLabel>
                            <TinymceEditor name={'descDelivery'} />
                        </FormGroup>
                        <FormGroup className={'mb-1'}>
                            <FormLabel htmlFor={'descNotice'}>注意事项</FormLabel>
                            <TinymceEditor name={'descNotice'} />
                        </FormGroup>
                        <FormGroup className={'mb-1'}>
                            <FormLabel htmlFor={'descRead'}>拍卖须知</FormLabel>
                            <TinymceEditor name={'descRead'} />
                        </FormGroup>
                        <FormGroup className={'mb-1'}>
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