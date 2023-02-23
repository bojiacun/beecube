import {AttributeTabs, withSettingsComponent} from "./component";
import {Form, Formik} from "formik";
import BootstrapInput from "~/components/form/BootstrapInput";
import React from "react";
import {FormGroup, FormLabel} from "react-bootstrap";
import FileBrowserInput from "~/components/filebrowser/form";

export const DEFAULT_PAGE_DATA = {
    backgroundColor: '#f5f5f5',
    backgroundImage: '',
    backgroundPosition: 'top center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
};

const PageSettings = (props: any) => {
    const {onUpdate, data} = props;
    let _data = {...DEFAULT_PAGE_DATA, ...data};

    const handleOnSubmit = (values: any) => {
        onUpdate({...values});
    }

    return (
        <AttributeTabs tabs={['页面设置']}>
            <div style={{padding: 15}}>
                <Formik initialValues={{..._data}} onSubmit={handleOnSubmit}>
                    {
                        (formik) => {
                            return (
                                <Form method={'post'} onChange={(e) => formik.submitForm()}>
                                    <BootstrapInput label={'背景颜色'} name={'backgroundColor'}/>
                                    <FormGroup>
                                        <FormLabel htmlFor={'backgroundImage'}>背景图片</FormLabel>
                                        <FileBrowserInput name={'backgroundImage'} type={1} multi={false} onChange={()=>formik.submitForm()} />
                                    </FormGroup>
                                    <BootstrapInput label={'背景图位置'} name={'backgroundPosition'}/>
                                    <BootstrapInput label={'背景图大小'} name={'backgroundSize'}/>
                                    <BootstrapInput label={'背景图重复'} name={'backgroundRepeat'}/>

                                    <BootstrapInput label={'左边距'} name={'paddingLeft'}/>
                                    <BootstrapInput label={'上边距'} name={'paddingTop'}/>
                                    <BootstrapInput label={'右边距'} name={'paddingRight'}/>
                                    <BootstrapInput label={'下边距'} name={'paddingBottom'}/>
                                </Form>
                            );
                        }
                    }

                </Formik>
            </div>
            <div></div>
        </AttributeTabs>
    );
}

export default withSettingsComponent('PageStyler', PageSettings);