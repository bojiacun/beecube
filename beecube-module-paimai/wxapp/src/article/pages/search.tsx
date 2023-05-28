import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {Input, Navigator, Text, View} from "@tarojs/components";
import { debounce } from 'throttle-debounce';
import request from "../../lib/request";
import utils from "../../lib/utils";
import FallbackImage from "../../components/FallbackImage";
import NoData from "../../components/nodata";

export default class Index extends Component<any, any> {
    state: any = {
        title: '',
        articleList: [],
    }
    searchHandler:any;

    constructor(props) {
        super(props);
        this.handleInputSearch = this.handleInputSearch.bind(this);
        this.renderVideos = this.renderVideos.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.searchHandler = debounce(1000, this.doSearch);
    }
    doSearch(key: string) {
        utils.showLoading();
        request.get('/paimai/api/articles/list', {params: {key:key, type: 2}}).then(res=>{
            this.setState({articleList: res.data.result.records});
            utils.hideLoading();
        })
    }
    renderVideos(data) {
        return (
            <View className={''}>
                <Navigator className={'block space-y-2'} url={'/article/pages/detail2?id=' + data.id}>
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
    onLoad(options) {
        this.setState({title: decodeURIComponent(options.title)});
    }
    handleInputSearch(e) {
        let key = e.detail.value;
        if(key != null && key != '') {
            this.searchHandler(key);
        }
    }
    render() {
        return (
            <PageLayout statusBarProps={{title: '搜索'+this.state?.title}}>
                <View className={'px-4 bg-white pb-2'}>
                    <View className={'py-2 px-4 rounded-full border border-solid border-gray-400 flex items-center text-gray-400'}>
                        <View className={'mr-4'}><Text className={'fa fa-search'} /></View>
                        <Input onInput={this.handleInputSearch} placeholder={'输入搜索关键字'} className={'text-lg block flex-1'} />
                    </View>
                </View>
                {this.state.articleList.length == 0 && <NoData />}
                <View className={'grid grid-cols-2 px-4 gap-4'}>
                    {this.state.articleList.map(item=>this.renderVideos(item))}
                </View>
            </PageLayout>
        );
    }
}
