import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import { View } from "@tarojs/components";
import FlowListView from "../../components/flowlistview";
import FallbackImage from "../../components/FallbackImage";


export default class Index extends Component<any, any> {
    state = {
        data: [],
        tabs: [],
    }

    constructor(props) {
        super(props);
        this.renderTemplate = this.renderTemplate.bind(this);
        this.loadData = this.loadData.bind(this);
    }


    loadData(pageIndex: number, tab: ListViewTabItem) {
        let params:any = {type: 1, column: 'createTime', orderBy: 'desc', page: pageIndex};
        if(tab.id) {
            params.classId = tab.id;
        }
        return request.get('/paimai/api/goods/list', {params: params});
    }

    renderTemplate(data:any) {
        return (
            <View className={'bg-white rounded-lg overflow-hidden rounded'}>
                <FallbackImage mode={'widthFix'} className={'rounded block'} />
                <View>{data.title}</View>
                <View>RMB {data.startPrice}</View>
            </View>
        );
    }

    componentDidMount() {
        request.get('/paimai/api/goods/classes').then(res=>{
            let classes = res.data.result;
            let tabs = classes.map((cls)=>{
                return {label: cls.name, id: cls.id, template: this.renderTemplate}
            });
            this.setState({tabs: tabs});
            request.get('/paimai/api/goods/list', {params: {type: 1, column: 'createTime', orderBy: 'desc'}}).then(res=>{
                this.setState({data: res.data.result});
            });
        });
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '所有拍品'}}>
                <FlowListView tabs={this.state.tabs} dataFetcher={this.loadData} />
            </PageLayout>
        );
    }
}
