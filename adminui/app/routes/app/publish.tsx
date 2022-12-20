import {Card, Tabs, Tab} from "react-bootstrap";
import WechatH5Entry from "~/pages/app/publish/WechatH5Entry";
import WxappUploadEntry from "~/pages/app/publish/WxappUploadEntry";
import {withPageLoading} from "~/utils/components";


const AppPublisher = () => {
    return (
        <Card>
            <Card.Body>
                <div style={{width: 600, minHeight: 400, margin: '0 auto'}}>
                <Tabs as={'ul'} defaultActiveKey={'h5'} fill={false} justify={true}>
                    <Tab title={'公众号/H5入口'} eventKey={'h5'} as={'li'}>
                        <WechatH5Entry />
                    </Tab>
                    <Tab title={'微信小程序发布'} eventKey={'wxapp'} as={'li'}>
                        <WxappUploadEntry />
                    </Tab>
                </Tabs>
                </div>
            </Card.Body>
        </Card>
    );
}

export default withPageLoading(AppPublisher);