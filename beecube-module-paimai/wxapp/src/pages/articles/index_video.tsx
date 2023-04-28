import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import ListView, {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import {Navigator, View, Text} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import {connect} from "react-redux";
import utils from "../../lib/utils";

// @ts-ignore
@connect((state: any) => (
    {
        settings: state.context.settings,
    }
))
export default class Index extends Component<any, any> {
    state = {
        tabs: [],
    }

    constructor(props) {
        super(props);
        this.renderTemplate = this.renderTemplate.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    onLoad() {
    }

    loadData(pageIndex: number, tab: ListViewTabItem) {
        let params: any = {type: 2, column: 'create_time', orderBy: 'desc', pageNo: pageIndex};
        if (tab.id) {
            params.tabId = tab.id;
        }
        return request.get('/paimai/api/articles/list', {params: params});
    }

    renderTemplate(data: any) {
        return (
            <View className={''}>
                <Navigator className={'block space-y-2'} url={'/pages/articles/detail2?id=' + data.id}>
                    <View className={'rounded-lg overflow-hidden relative'} style={{height: '55vw'}}>
                        <FallbackImage mode={'aspectFill'} className={'w-full h-full'} src={data.preview} />
                        <View className={'absolute z-10 top-0 bottom-0 w-full h-full flex items-center justify-center text-white text-4xl'} style={{backgroundColor: 'rgb(0,0,0,0.3)'}}>
                            <Text className={'fa fa-play-circle'} />
                        </View>
                    </View>
                    <View className={'space-y-2'}>
                        <View className={'font-bold text-lg'}>{data.title}</View>
                        <View className={'text-gray-400 text-sm text-cut'}>{utils.delHtml(data.description)}</View>
                        <View className={'flex justify-between items-center'}>
                            <Text>{data.author}</Text>
                            <View className={'text-gray-400'}>
                                <Text className={'fa fa-heart-o mr-2'} />
                                <Text>{data.views}</Text>
                            </View>
                        </View>
                    </View>
                </Navigator>
            </View>
        );
    }

    componentDidMount() {
        request.get('/paimai/api/articles/classes', {params: {type: 2}}).then(res => {
            let classes = res.data.result;
            let tabs = classes.map((cls) => {
                return {label: cls.name, id: cls.id, template: this.renderTemplate}
            });
            tabs.unshift({label: '精选', id: '0', template: this.renderTemplate});
            this.setState({tabs: tabs});
        });
    }


    render() {
        const {settings} = this.props;
        return (
            <PageLayout statusBarProps={{title: settings.articleVideoIndexTitle || '视频类文章频道页'}} enableReachBottom={true}>
                <ListView
                    className={'grid grid-cols-2 px-4 gap-4'}
                    tabs={this.state.tabs}
                    defaultActiveKey={'0'}
                    dataFetcher={this.loadData}
                    showSearch={true}
                />
            </PageLayout>
        );
    }
}
