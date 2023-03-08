import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import FlowListView from "../../components/flowlistview";
import classNames from "classnames";
import styles from "../../flow.module.scss";
import {Navigator, Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
const numeral = require('numeral');

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
        let params: any = {type: 2, column: 'create_time', orderBy: 'desc', pageNo: pageIndex};
        if (tab.id) {
            params.classId = tab.id;
        }
        return request.get('/paimai/api/goods/list', {params: params});
    }

    renderTemplate(data: any) {
        return (
            <View className={classNames('bg-white rounded-lg overflow-hidden shadow-outer', styles.flow)}>
                <Navigator url={'/pages/goods/detail2?id=' + data.id}>
                    <FallbackImage mode={'widthFix'} className={'rounded block w-full'} src={data.images.split(',')[0]}/>
                    <View className={'px-2 mt-2'}>{data.title}</View>
                    <View className={'px-2 mb-2 text-sm'}>
                        一口价 <Text className={'text-red-500'}>RMB</Text> <Text className={'text-red-500 text-lg'}>{numeral(data.startPrice).format('0,0.00')}</Text>
                    </View>
                </Navigator>
            </View>
        );
    }

    componentDidMount() {
        request.get('/paimai/api/goods/buyout/classes').then(res => {
            let classes = res.data.result;
            let tabs = classes.map((cls) => {
                return {label: cls.name, id: cls.id, template: this.renderTemplate}
            });
            tabs.unshift({label: '全部', id: undefined, template: this.renderTemplate});
            this.setState({tabs: tabs});
        });
    }

    onPullDownRefresh() {

    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '一口价拍品'}} enableReachBottom={true} showTabBar={true}>
                <FlowListView tabs={this.state.tabs} dataFetcher={this.loadData}/>
            </PageLayout>
        );
    }
}
