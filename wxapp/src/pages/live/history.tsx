import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import PageLoading from "../../components/pageloading";
import request from "../../lib/request";


export default class Index extends Component<any, any> {
    state:any = {
        liveRoom: null
    }

    onLoad(options) {
        request.get('/paimai/api/rooms/'+options.id).then(res=>{
            this.setState({liveRoom: res.data.result});
        });
    }

    render() {
        const {liveRoom} = this.state;
        if(!liveRoom) return <PageLoading />;
        return (
            <PageLayout statusBarProps={{title: liveRoom.title}}>

            </PageLayout>
        );
    }
}
