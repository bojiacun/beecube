import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";


export default class Index extends Component<any, any> {
    state:any = {
        list: [],
        hasMore: false,
        loading: false,
        scrollTop: 0,
    }

    componentDidMount() {
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '积分明细'}}>

            </PageLayout>
        );
    }
}
