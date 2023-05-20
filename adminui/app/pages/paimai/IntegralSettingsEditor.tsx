import {Button, Card, FormGroup, FormLabel} from "react-bootstrap";
import {Form, Formik} from "formik";
import { handleSaveResult} from "~/utils/utils";
import {useFetcher} from "@remix-run/react";
import * as Yup from "yup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import BootstrapInput from "~/components/form/BootstrapInput";


const SettingsSchema = Yup.object().shape({
});


const IntegralSettingsEditor = (props:any) => {
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
        postFetcher.submit(values, {method: 'post', action:'/paimai/integral/settings/update'});
    }
    settings.isCustomOffer = parseInt(settings.isCustomOffer);
    settings.isDealCommission = parseInt(settings.isDealCommission);


    return (
        <Formik initialValues={settings} onSubmit={handleOnSubmit} validationSchema={SettingsSchema}>
            <Form method={'post'}>
                <Card>
                    <Card.Header>
                        <Card.Title>积分商城设置</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BootstrapInput label={'新用户积分'} name={'newMemberIntegral'} placeholder={'新用户赠送积分'} />
                    </Card.Body>
                    <Card.Footer className={'text-right'}>
                        <Button disabled={postFetcher.state === 'submitting'} type={'submit'}><FontAwesomeIcon  icon={'save'} style={{marginRight: 5}} />保存</Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Formik>
    );
}

export default IntegralSettingsEditor;