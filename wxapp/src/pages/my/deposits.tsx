import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import LoginView from "../../components/login";
import request from "../../lib/request";
import utils from "../../lib/utils";
import {Navigator, Text, View} from "@tarojs/components";
import FallbackImage from "../../components/FallbackImage";
import Taro from "@tarojs/taro";
import NoData from "../../components/nodata";
import LoadMore from "../../components/loadmore";
const numeral = require('numeral');

export default class Index extends Component<any, any> {
    state:any = {
        page: 1,
        list: [],
        id: '',
        loadingMore: false,
        noMore: false,
    }

    componentDidMount() {
    }

    loadData(id, page, clear = false) {
        return request.get('/paimai/api/members/views', {params: {id: id, pageNo: page}}).then(res=>{
            if(clear) {
                this.setState({list: res.data.result.records, loadingMore: false, noMore: false});
            }
            else {
                let list = this.state.list;
                let newList = res.data.result.records;
                if(!newList || newList.length == 0) {
                    this.setState({noMore: true, loadingMore: false});
                }
                else {
                    this.setState({noMore: false, loadingMore:false, list: [...list, ...newList]});
                }
            }
        });
    }

    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        this.loadData(options.id, 1,true).then(()=>utils.hideLoading());
    }

    onReachBottom() {
        this.setState({loadingMore: true, noMore: false});
        this.loadData(this.state.id, this.state.page+1,false).then(()=>{});
        this.setState({page: this.state.page+1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(this.state.id, 1,true).then(()=>utils.hideLoading());
        this.setState({page: 1});
    }

    render() {
        const {list, noMore, loadingMore} = this.state;
        return (
            <PageLayout statusBarProps={{title: '保证金记录'}} enableReachBottom={true}>
                <LoginView>
                    {list.length == 0 && <NoData />}
                    <View className={'grid grid-cols-1 gap-4 p-4'}>
                        {list.map((item)=>{
                            let radius = 8;
                            return (
                                <View>

                                </View>
                            );
                        })}
                    </View>
                    {list.length > 0 && <LoadMore noMore={noMore} loading={loadingMore} />}
                </LoginView>
            </PageLayout>
        );
    }
}
