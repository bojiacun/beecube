import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import request from "../../lib/request";


export default class Index extends Component<any, any> {
    state:any = {
        list: [],
    }

    onLoad() {
        request.get('/app/api/members/addresses').then(res=>{
            this.setState({list: res.data.result});
        });
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '地址管理'}}>

            </PageLayout>
        );
    }
}
