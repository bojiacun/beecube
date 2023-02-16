import { Row,Col } from "react-bootstrap";
import BootstrapInput from "~/components/form/BootstrapInput";

export const DEFAULT_BOX_STYLES = {
    background: '#ffffff',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px',
    paddingRight: '10px',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '0px',
    marginRight: '0px',
    borderRadius: '0px',
};


const BoxSettings = () => {
    return (
        <>
            <BootstrapInput label={'背景颜色'} name={'background'} />
            <BootstrapInput label={'边框圆角'} name={'borderRadius'} />
            <Row>
                <Col>
                    <BootstrapInput label={'左内间距'} name={'paddingLeft'} />
                </Col>
                <Col>
                    <BootstrapInput label={'右内间距'} name={'paddingRight'} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BootstrapInput label={'上内间距'} name={'paddingTop'} />
                </Col>
                <Col>
                    <BootstrapInput label={'下内间距'} name={'paddingBottom'} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BootstrapInput label={'左外间距'} name={'marginLeft'} />
                </Col>
                <Col>
                    <BootstrapInput label={'右外间距'} name={'marginRight'} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <BootstrapInput label={'上外间距'} name={'marginTop'} />
                </Col>
                <Col>
                    <BootstrapInput label={'下外间距'} name={'marginBottom'} />
                </Col>
            </Row>
        </>
    );
}

export default BoxSettings;
