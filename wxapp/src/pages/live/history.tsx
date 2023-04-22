import {Component} from "react";
import PageLayout from "../../layouts/PageLayout";
import PageLoading from "../../components/pageloading";
import request from "../../lib/request";
import {Video, View} from "@tarojs/components";


export default class Index extends Component<any, any> {
    state:any = {
        liveRoom: null
    }

    onLoad(options) {
        request.get('/paimai/api/live/rooms/'+options.id).then(res=>{
            this.setState({liveRoom: res.data.result});
        });
    }

    render() {
        const {liveRoom} = this.state;
        if(!liveRoom) return <PageLoading />;
        return (
            <PageLayout statusBarProps={{title: liveRoom.title, style: {background: 'transparent', color:'white', position: 'fixed'}}} style={{background: 'black', paddingBottom: 0}}>
                {liveRoom.streams.length == 1 && <Video src={liveRoom.streams[0].playbackUrl} controls={false} autoplay={true} className={'w-screen h-screen'} />}
                {liveRoom.streams.length == 2 && liveRoom.streamLayout == 1 &&
                    <View className={'grid grid-cols-2 gap-0 box-border'} style={{marginTop: 140, height: '60vw', width: '100vw'}}>
                        <Video src={liveRoom.streams[0].playbackUrl} className={'w-full h-full'} controls={false} autoplay={true} />
                        <Video src={liveRoom.streams[1].playbackUrl} className={'w-full h-full'} controls={false} autoplay={true} />
                    </View>
                }
                {liveRoom.streams.length == 2 && liveRoom.streamLayout == 2 &&
                    <View className={'grid grid-cols-1 gap-0 box-border h-screen w-screen'}>
                        <Video src={liveRoom.streams[0].playbackUrl} className={'w-full h-full'} controls={false} autoplay={true} />
                        <Video src={liveRoom.streams[1].playbackUrl} className={'w-full h-full'} controls={false} autoplay={true} />
                    </View>
                }
                {liveRoom.streams.length == 2 && liveRoom.streamLayout == 3 &&
                    <View className={'grid grid-cols-1 gap-0 box-border h-screen w-screen relative'}>
                        <Video src={liveRoom.streams[0].playbackUrl} className={'w-full h-full'} controls={false} autoplay={true} />
                        <Video src={liveRoom.streams[1].playbackUrl} className={'absolute z-10'} style={{right: 20, top: 140, width: liveRoom.streams[1].width, height: liveRoom.streams[1].height}} controls={false} autoplay={true} />
                    </View>
                }
            </PageLayout>
        );
    }
}
