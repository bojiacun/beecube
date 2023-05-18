import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Button} from "@taroify/core";

export default class Index extends Component<any, any> {
    render() {
        return (
            <PageLayout statusBarProps={{title:'测试页面'}}>
                <Button color={'primary'}>测试</Button>
            </PageLayout>
        );
    }
}
