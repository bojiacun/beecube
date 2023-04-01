import {Card, Tabs, Tab} from "react-bootstrap";
import WxappUploadEntry from "~/pages/app/publish/WxappUploadEntry";
import {withPageLoading} from "~/utils/components";


const AppPublisher = () => {
    return (
        <Card>
            <Card.Body>
                <div style={{width: 400, minHeight: 400, margin: '0 auto'}}>
                <Tabs as={'ul'} defaultActiveKey={'wxapp'} fill={false} justify={true}>
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