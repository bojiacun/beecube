import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import ListView, {ListViewTabItem} from "../../components/listview";
import {Navigator, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import FallbackImage from "../../components/FallbackImage";
import utils from "../../lib/utils";
import TimeCountDowner from "../../components/TimeCountDowner";
import request from "../../lib/request";
import PageLoading from "../../components/pageloading";


export default class Index extends Component<any, any> {
    state: any = {
        tag: null,
        source: 1,
        options: null,
    }
    tabs: ListViewTabItem[];

    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.renderTemplate = this.renderTemplate.bind(this);
        this.tabs = [
            {
                label: '直播中',
                id: 1,
                template: this.renderTemplate
            },
            {
                label: '已结束',
                id: 2,
                template: this.renderTemplate
            },
        ];
    }


    loadData(page: number, tab: ListViewTabItem) {
        let params: any = {pageNo: page, source: tab.id};
        if (this.state.tag) {
            params.tag = decodeURIComponent(this.state.tag);
        }
        return request.get('/paimai/api/live/rooms', {params: params});
    }

    renderTemplate(data) {
        let radius = 0;
        return (
            <View className={'bg-white relative overflow-hidden shadow-outer'} style={{borderRadius: Taro.pxTransform(radius)}}>
                <Navigator url={'/pages/performance/detail?id=' + data.id}>
                    <View className={'relative'} style={{width: '100%'}}>
                        <FallbackImage mode={'widthFix'} className={'block w-full'} src={utils.resolveUrl(data.preview)}/>
                    </View>
                    <View className={'p-4 space-y-2 divide-y divide-gray-100'}>
                        <View className={'space-y-1'}>
                            <View className={'font-bold text-lg'}>
                                {data.title}
                            </View>
                            <TimeCountDowner
                                className={'flex text-sm'}
                                endTime={data.endTime}
                                startTime={data.startTime}
                            />
                        </View>
                    </View>
                </Navigator>
            </View>
        );
    }

    onLoad(options) {
        if (options.tag) {
            this.setState({tag: options.tag});
        }
        if (options.source) {
            this.setState({tag: options.tag, source: options.source});
        }
        this.setState({options: options});
    }

    render() {
        const {tag, source} = this.state;
        if (!this.state.options) return <PageLoading/>;

        return (
            <PageLayout statusBarProps={{title: tag == null ? '所有直播' : decodeURIComponent(tag)}} enableReachBottom={true} showTabBar={true}>
                <ListView tabs={this.tabs} dataFetcher={this.loadData} defaultActiveKey={source} tabStyle={2}/>
            </PageLayout>
        );
    }
}
