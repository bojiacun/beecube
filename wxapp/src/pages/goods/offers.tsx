import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import LoginView from "../../components/login";
import request from "../../lib/request";
import utils from "../../lib/utils";


export default class Index extends Component<any, any> {
    state:any = {
        page: 1,
        offers: [],
    }

    componentDidMount() {
    }

    loadData(id, page, clear = false) {
        return request.get('/paimai/api/goods/offers', {params: {id: id, page: page}}).then(res=>{
            if(clear) {
                this.setState({offers: res.data.result.records});
            }
            else {
                let offers = this.state.offers;
                offers.push(res.data.result.records);
                this.setState({offers: offers});
            }
        });
    }

    onLoad(options) {
        utils.showLoading();
        this.loadData(options.id, 1,true).then(()=>utils.hideLoading());
    }

    onReachBottom() {
        this.loadData(this.state.id, this.state.page+1,false).then(()=>{});
        this.setState({page: this.state.page+1});
    }

    onPullDownRefresh() {
        utils.showLoading();
        this.loadData(this.state.id, 1,true).then(()=>utils.hideLoading());
        this.setState({page: 1});
    }

    render() {
        return (
            <PageLayout statusBarProps={{title: '出价记录'}}>
                <LoginView>

                </LoginView>
            </PageLayout>
        );
    }
}
