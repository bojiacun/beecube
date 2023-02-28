import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import { View } from "@tarojs/components";
import FlowListView from "../../components/flowlistview";
import FallbackImage from "../../components/FallbackImage";
import styles from '../../flow.module.scss';
import classNames from "classnames";


export default class Index extends Component<any, any> {
    state = {
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
            <View className={classNames('bg-white rounded-lg overflow-hidden rounded shadow-xl', styles.flow)}>
                <FallbackImage mode={'widthFix'} className={'rounded block w-full'} src={data.images.split(',')[0]} />
                <View className={'px-2 mt-2'}>{data.title}</View>
                <View className={'px-2 mb-2'}>RMB {data.startPrice}</View>
            </View>
        );
    }

    componentDidMount() {
        request.get('/paimai/api/goods/classes').then(res=>{
            let classes = res.data.result;
            let tabs = classes.map((cls)=>{
                return {label: cls.name, id: cls.id, template: this.renderTemplate}
            });
            tabs.unshift({label: '全部', id: undefined, template: this.renderTemplate});
            this.setState({tabs: tabs});
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
