import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import PageLoading from "../../components/pageloading";
import request from "../../lib/request";
import {Video} from "@tarojs/components";
import utils from "../../lib/utils";


export default class Index extends Component<any, any> {
    state: any = {
        id: null,
        detail: null,
    }

    onLoad(options) {
        request.get('/paimai/api/articles/queryById', {params: {id: options.id}}).then(res=>{
            this.setState({id: options.id, detail: res.data.result});
        });
    }


    componentDidMount() {
    }


    render() {
        const {detail} = this.state;
        if(detail == null) return <PageLoading />;

        return (
            <PageLayout statusBarProps={{title: detail.title}} style={{backgroundColor: 'white'}}>
                <Video src={utils.resolveUrl(detail.video)} className={'w-screen h-screen'} objectFit={'contain'} />
            </PageLayout>
        );
    }
}
