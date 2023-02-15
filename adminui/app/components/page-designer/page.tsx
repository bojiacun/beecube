import { FILE_TYPE_IMAGE } from "../FileBrowser";
import FileBrowserInput from "../FileBrowser/form";
import { presetColors, withSettingsComponent } from "./component";
import {Form} from "react-bootstrap";
import {resolveUrl} from "~/utils/utils";

export const DEFAULT_PAGE_DATA = {
    backgroundColor: '#f5f5f5',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
};

const PageSettings = (props: any) => {
    const [styleForm] = Form.useForm();
    const { onUpdate, data } = props;
    let _data = { ...DEFAULT_PAGE_DATA, ...data };
    return (
        <Form key="style" form={styleForm} layout="vertical" initialValues={{ ..._data }} onValuesChange={(changedValues, allValues) => {
            if (allValues.backgroundImageUrl) {
                allValues.background = 'url("' + resolveUrl(allValues.backgroundImageUrl) + '") no-repeat top center';
                allValues.backgroundSize = 'contain';
            }
            onUpdate({ ...allValues });
        }}>
            {/*<Collapse expandIconPosition="right" bordered={false} ghost={true} defaultActiveKey={['页面样式']}>*/}
            {/*    <Collapse.Panel header="页面样式" key="页面样式">*/}
            {/*        <ProFormColorPicker label="背景颜色" name="backgroundColor" fieldProps={{presetColors: presetColors}} />*/}
            {/*        <ProFormGroup>*/}
            {/*            <ProFormSlider label="左内间距" name="paddingLeft" width="xs"  max={30} />*/}
            {/*            <ProFormSlider label="右内间距" name="paddingRight" width="xs" max={30} />*/}
            {/*        </ProFormGroup>*/}
            {/*        <ProFormGroup>*/}
            {/*            <ProFormSlider label="上内间距" name="paddingTop" width="xs"  max={100} />*/}
            {/*            <ProFormSlider label="下内间距" name="paddingBottom" width="xs" max={100} />*/}
            {/*        </ProFormGroup>*/}
            {/*        <ProFormItem*/}
            {/*            name="backgroundImageUrl"*/}
            {/*            label="背景图"*/}
            {/*        >*/}
            {/*            <FileBrowserInput type={FILE_TYPE_IMAGE} imagePreview={true} />*/}
            {/*        </ProFormItem>*/}
            {/*    </Collapse.Panel>*/}
            {/*</Collapse>*/}
        </Form>
    );
}

export default withSettingsComponent('PageStyler', PageSettings);