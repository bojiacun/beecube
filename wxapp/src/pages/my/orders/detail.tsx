import {Component} from "react";
import {Button, View} from "@tarojs/components";
import {connect} from "react-redux";
import PageLayout from "../../../layouts/PageLayout";
import LoginView from "../../../components/login";
import PageLoading from "../../../components/pageloading";
import utils from "../../../lib/utils";
import request from "../../../lib/request";

const numeral = require('numeral');

// @ts-ignore
@connect((state: any) => (
    {
        systemInfo: state.context.systemInfo,
        settings: state.context.settings,
        context: state.context
    }
))
export default class Index extends Component<any, any> {
    state: any = {
        id: 0,
        goods: null,
        posting: false,
    }

    constructor(props) {
        super(props);
        this.pay= this.pay.bind(this);
    }


    componentDidMount() {

    }

    // @ts-ignore
    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.context.userInfo == null || prevState.goods == null) {
            const {context} = this.props;
            const {userInfo} = context;
            let {goods} = this.state;
            if (userInfo != null && goods) {

            }
        }
    }


    onLoad(options) {
        utils.showLoading();
        this.setState({id: options.id});
        request.get("/paimai/api/members/orders/detail", {params: {id: options.id}}).then(res => {
            let data = res.data.result;
            utils.hideLoading();
            this.setState({goods: data});
        });
    }





    pay() {
    }


    renderButton() {
        return (
            <View className={'flex items-center space-x-2'}>
                <Button disabled={this.state.posting} className={'btn btn-primary'} onClick={this.pay}>
                    <View>立即支付</View>
                </Button>
            </View>
        );
    }

    componentWillUnmount() {

    }

    render() {
        const {goods} = this.state;
        const {systemInfo} = this.props;
        if (goods == null) return <PageLoading/>;

        let safeBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
        if (safeBottom > 10) safeBottom -= 10;

        return (
            <PageLayout statusBarProps={{title: '订单详情'}}>
                <LoginView>
                    <View className={'bg-white px-4 pt-1 flex items-center justify-end fixed bottom-0 w-full'}
                          style={{paddingBottom: safeBottom}}>
                        {this.renderButton()}
                    </View>
                </LoginView>
            </PageLayout>
        );
    }
}
