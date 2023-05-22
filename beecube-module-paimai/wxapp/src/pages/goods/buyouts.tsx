import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import FlowListView from "../../components/flowlistview";
import classNames from "classnames";
import styles from "../../flow.module.scss";
import {Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import {connect} from "react-redux";
import {Popup, Tag} from "@taroify/core";
import utils from "../../lib/utils";
import Taro from "@tarojs/taro";

const numeral = require('numeral');

// @ts-ignore
@connect((state: any) => (
    {
        settings: state.context.settings,
    }
))
export default class Index extends Component<any, any> {
    state = {
        tabs: [],
        openSettle: false,
        settles: [],
    }

    constructor(props) {
        super(props);
        this.renderTemplate = this.renderTemplate.bind(this);
        this.loadData = this.loadData.bind(this);
        this.joinCart = this.joinCart.bind(this);
    }

    loadData(pageIndex: number, tab: ListViewTabItem) {
        let params: any = {column: 'create_time', orderBy: 'desc', pageNo: pageIndex};
        if (tab.id) {
            params.classId = tab.id;
        }
        return request.get('/paimai/api/goods/mall/list', {params: params});
    }

    joinCart(e, id) {
        e.stopPropagation();
        e.preventDefault();
        request.get('/paimai/api/goods/settles', {params: {id: id}}).then(res=>{
            this.setState({openSettle: true, settles: res.data.result});
        });
    }

    gotoDetail(e, url) {
        e.stopPropagation();
        e.preventDefault();
        Taro.navigateTo({url: url}).then();
    }

    renderTemplate(data: any) {
        const imgUrl = data.listCover ? data.listCover : data.images.split(',')[0];
        const tags = data.tags?.split(',') || [];
        return (
            <View className={classNames('bg-white rounded-lg overflow-hidden shadow-lg', styles.flow)}>
                <View onClick={event => this.gotoDetail(event, '/pages/goods/detail2?id=' + data.id)}>
                    <FallbackImage mode={'widthFix'} className={'rounded block w-full'} src={imgUrl}/>
                    {tags.length > 0 && <View className={'p-2 space-x-2'}>{tags.map((item: any) => {
                        return (
                            <Tag shape={'rounded'} color={'danger'} variant={'outlined'}>{item}</Tag>
                        );
                    })}</View>}
                    <View className={'px-2 text-lg font-bold'}>{data.title}</View>
                    <View className={'px-2 text-stone-400'}>{utils.delHtml(data.subTitle)}</View>
                    <View className={'px-2 mb-2 flex justify-between items-center'}>
                        <View>
                            <Text className={'text-red-500'}>￥</Text> <Text className={'text-red-500 text-xl font-bold'}>{numeral(data.startPrice).format('0,0.00')}</Text>
                        </View>
                        <View onClick={event => this.joinCart(event, data.id)} className={'rounded-full bg-red-500 flex items-center text-lg justify-center text-white'} style={{width: 24, height: 24}}>
                            <Text className={'iconfont icon-gouwuche'} />
                        </View>
                    </View>
                </View>
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
        const {settings} = this.props;

        return (
            <PageLayout statusBarProps={{title: settings.buyoutListTitle || '一口价'}} enableReachBottom={true} showTabBar={true}>
                <FlowListView tabs={this.state.tabs} dataFetcher={this.loadData}/>
                <Popup style={{height: '30%'}} open={this.state.openSettle} rounded placement={'bottom'} onClose={()=>this.setState({openSettle: false})}>
                    <Popup.Close />
                </Popup>
            </PageLayout>
        );
    }
}
