import {withPageLoading} from "~/utils/components";
import {Col, Nav, Row, Tab} from "react-bootstrap";


const AccountSettings = () => {
    return (
        <Tab.Container id={'account-settings-container'} defaultActiveKey={'user-profile'}>
            <Row>
                <Col sm={3}>
                    <Nav variant={'pills'} className={'flex-column'}>
                        <Nav.Item>
                            <Nav.Link eventKey={'user-profile'}>用户资料</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={'user-password'}>修改密码</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col sm={9} className={'mt-1 mt-md-0'}>
                    <Tab.Content>
                        <Tab.Pane eventKey={'user-profile'}>

                        </Tab.Pane>
                        <Tab.Pane eventKey={'user-password'}>

                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}

export default withPageLoading(AccountSettings);