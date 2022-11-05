import LayoutIframe from "~/layouts/layout-iframe/LayoutIframe";
import {
    Col,
    FormGroup,
    Table,
    Card,
    InputGroup,
    Form,
    FormControl,
    FormLabel,
    Button,
    Pagination
} from "react-bootstrap";
import {ChevronLeft, ChevronRight} from "react-feather";
import vueSelectStyleUrl from '~/styles/react/libs/vue-select.css';
import {LinksFunction} from "@remix-run/node";

export const links: LinksFunction = () => {
    return [{rel: 'stylesheet', href: vueSelectStyleUrl}];
}

const RolesPage = () => {
    return (
        <LayoutIframe>
            <Card>
                <Card.Header>
                    <Card.Title>
                        角色管理
                    </Card.Title>
                </Card.Header>
                <Card.Body className={'d-flex justify-content-between  flex-wrap'}>
                    <FormGroup as={Form.Row} className={'align-items-center mr-1 mb-md-0'}>
                        <FormLabel column={'sm'} xs={3}>排序</FormLabel>
                        <InputGroup as={Col} size={'sm'} sm={9}>
                            <FormControl as={'select'} size={'sm'}>
                                <option>无</option>
                            </FormControl>
                            <FormControl as={'select'} size={'sm'}>
                                <option>升序</option>
                                <option>降序</option>
                            </FormControl>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup as={Form.Row} controlId={'filterInput'} className={'mb-0'}>
                        <FormLabel column={'sm'} xs={2}>筛选</FormLabel>
                        <InputGroup as={Col} size={'sm'} sm={10}>
                            <FormControl placeholder={'请输入要搜索的内容'}/>
                            <InputGroup.Append>
                                <Button>搜索</Button>
                            </InputGroup.Append>
                        </InputGroup>

                    </FormGroup>
                </Card.Body>

                <Table striped hover responsive className={'position-relative'}>
                    <thead>
                    <tr>
                        <th>角色名称</th>
                        <th>角色编码</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                </Table>

                <Card.Body className={'d-flex justify-content-between flex-wrap pt-0'}>
                    <FormGroup as={Form.Row} className={'align-items-center mr-1 mb-md-0'}>
                        <FormLabel column={'sm'} xs={6}>每页显示</FormLabel>
                        <InputGroup as={Col} size={'sm'} sm={6}>
                            <FormControl as={'select'} size={'sm'}>
                                <option>20</option>
                                <option>50</option>
                                <option>100</option>
                            </FormControl>
                        </InputGroup>
                    </FormGroup>
                    <div>
                        <Pagination className={'mb-0'}>
                            <Pagination.Item className={'prev-item'} as={'span'}><ChevronLeft
                                size={18}/></Pagination.Item>
                            <Pagination.Item className={'active'} as={'button'} type={'button'}>1</Pagination.Item>
                            <Pagination.Item as={'button'} type={'button'}>2</Pagination.Item>
                            <Pagination.Item className={'next-item'} as={'span'}><ChevronRight
                                size={18}/></Pagination.Item>
                        </Pagination>
                    </div>
                </Card.Body>
            </Card>
        </LayoutIframe>
    );
}

export default RolesPage;