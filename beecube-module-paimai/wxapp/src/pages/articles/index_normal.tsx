import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import ListView, {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import {Navigator, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import {connect} from "react-redux";

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
        let params: any = {type: 1, column: 'create_time', orderBy: 'desc', pageNo: pageIndex};
        if (tab.id) {
            params.tabId = tab.id;
        }
        return request.get('/paimai/api/articles/list', {params: params});
    }

    renderTemplate(data: any) {
        if(data.outerLink) {
            return (
                <View className={'py-2'}>
                    <Navigator className={'block flex items-center'} url={'/pages/articles/detail_h5?url=' + data.outerLink}>
                        <FallbackImage mode={'aspectFill'} className={'rounded block w-20 h-20 flex-none mr-2'} src={data.preview}/>
                        <View className={'flex-1 h-20 flex flex-col justify-between'}>
                            <View className={'font-bold text-lg'}>{data.title}</View>
                            <View className={'text-gray-400 text-sm'}>{data.createTime}</View>
                        </View>
                    </Navigator>
                </View>
            );
        }
        return (
            <View className={'py-2'}>
                <Navigator className={'block flex items-center'} url={'/pages/articles/detail?id=' + data.id}>
                    <FallbackImage mode={'aspectFill'} className={'rounded block w-20 h-20 flex-none mr-2'} src={data.preview}/>
                    <View className={'flex-1 h-20 flex flex-col justify-between'}>
                        <View className={'font-bold text-lg'}>{data.title}</View>
                        <View className={'text-gray-400 text-sm'}>{data.createTime}</View>
                    </View>
                </Navigator>
            </View>
        );
    }

    componentDidMount() {
        request.get('/paimai/api/articles/classes', {params: {type: 1}}).then(res => {
            let classes = res.data.result;
            let tabs = classes.map((cls) => {
                return {label: cls.name, id: cls.id, template: this.renderTemplate}
            });
            tabs.unshift({label: '精选', id: '0', template: this.renderTemplate});
            this.setState({tabs: tabs});
        });
    }


    renderBottom() {
        const {settings} = this.props;
        if(settings.articleNormalAdv) {
            return (
                <Navigator className={'p-4'} url={`${settings.articleNormalAdvLink}`}>
                    <FallbackImage src={settings.articleNormalAdv} mode={'widthFix'} className={'w-full block'} />
                </Navigator>
            );
        }
        return <></>
    }

    render() {
        const {settings} = this.props;
        return (
            <PageLayout statusBarProps={{title: settings.articleNormalIndexTitle || '图文类文章频道页'}} enableReachBottom={true}>
                <ListView
                    className={'grid grid-cols-1 divide-y px-4 divide-gray-300'}
                    tabs={this.state.tabs}
                    defaultActiveKey={'0'}
                    dataFetcher={this.loadData}
                    appendBottom={this.renderBottom()}
                />
            </PageLayout>
        );
    }
}
