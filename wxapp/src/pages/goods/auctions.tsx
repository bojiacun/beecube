import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import {ListViewTabItem} from "../../components/listview";
import request from "../../lib/request";
import FlowListView from "../../components/flowlistview";
import AuctionGoodsItem from "../../components/goods/AuctionGoodsItem";
import classNames from "classnames";
import styles from "../../flow.module.scss";


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
        let params: any = {type: 1, column: 'create_time', orderBy: 'desc', page: pageIndex};
        if (tab.id) {
            params.classId = tab.id;
        }
        return request.get('/paimai/api/goods/list', {params: params});
    }
    renderTemplate(data: any) {
        return (<AuctionGoodsItem className={classNames('bg-white rounded-lg overflow-hidden shadow-outer', styles.flow)} data={data} />);
    }

    componentDidMount() {
        request.get('/paimai/api/goods/classes').then(res => {
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
            <PageLayout statusBarProps={{title: '所有拍品'}}>
                <FlowListView tabs={this.state.tabs} dataFetcher={this.loadData}/>
            </PageLayout>
        );
    }
}
