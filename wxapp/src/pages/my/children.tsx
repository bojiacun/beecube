import {useState} from "react";
import Taro, {useDidShow, useRouter} from '@tarojs/taro';
import withLogin from "../../components/login/login";
import PageLayout from "../../layouts/PageLayout";
import {View, Text, ITouchEvent, Button, Navigator} from "@tarojs/components";
import Empty from "../../components/empty/empty";
import request, {
    API_MEMBER_CHILDREN, API_MEMBER_CHILDREN_DELETE,
    SERVICE_WINKT_MEMBER_HEADER
} from "../../utils/request";
import classNames from "classnames";


const Children = (props) => {
    const {headerHeight, makeLogin, checkLogin} = props;
    const [students, setStudents] = useState([]);
    const [touchStart, setTouchStart] = useState(0);
    const [touchDirection, setTouchDirection] = useState<string>('');
    const [touchingItem, setTouchingItem] = useState<string>('');
    const {params} = useRouter();
    const loadData = () => {
        request.get(API_MEMBER_CHILDREN, SERVICE_WINKT_MEMBER_HEADER, {member_id: params.member_id??''}, true).then(res => {
            setStudents(res.data.data);
        })
    }
    const isLogined = checkLogin();


    useDidShow(() => {
        if(isLogined) {
            loadData();
        }
    });

    const onTouchStart = (e: ITouchEvent) => {
        setTouchStart(e.touches[0].pageX);
    }
    const onTouchMove = (e: ITouchEvent) => {
        setTouchDirection(e.touches[0].pageX - touchStart > 0 ? 'right' : 'left');
    }
    const onTouchEnd = (e: ITouchEvent) => {
        if (touchDirection === 'left') {
            setTouchingItem(e.currentTarget.dataset.index)
        } else {
            setTouchingItem('');
        }
        setTouchDirection('');
    }
    const doEdit = (e) => {
        e.stopPropagation();
        let id = e.currentTarget.dataset.id;
        Taro.navigateTo({url: 'new_child?id=' + id}).then();
    }
    const doDelete = (e) => {
        e.stopPropagation();
        let id = e.currentTarget.dataset.id;
        request.del(API_MEMBER_CHILDREN_DELETE+'/'+id, SERVICE_WINKT_MEMBER_HEADER, null, true).then(() => {
            loadData();
        })
    }
    const selectAndBack = (item) => {
        Taro.setStorageSync('mychild', item);
        Taro.navigateBack().then();
    }


    return (
        <PageLayout statusBarProps={{title: '我的借阅人'}}>
            {students.length > 0 && <View className='bg-red text-sm padding-xs margin-bottom'>右滑动编辑借阅人，每个账号只能添加一个借阅人</View>}
            <View className="" style={{paddingBottom: '120rpx'}}>
                {students.length === 0 &&
                <Empty title="暂无借阅人" height={'calc(100vh - ' + headerHeight + 'px - 120rpx)'}/>}
                {
                    students.length > 0 &&
                    <View className="cu-list menu card-menu radius margin-top-sm">
                        {students.map((item: any) => {
                            return (
                                <View
                                    className={classNames("cu-item", touchingItem === 'touch-' + item.id ? 'move-cur' : '')}
                                    key={item.id}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                    data-index={'touch-' + item.id}
                                    onClick={() => selectAndBack(item)}
                                >
                                    <View className="content padding-top-sm padding-bottom-sm">
                                        <View className="">{item.name} {item.gender == 1 ? '男': '女'}</View>
                                        {item.schoolClass &&
                                            <View className="text-gray text-sm">
                                                <View>{item.schoolClass.level.school.name} {item.schoolClass.level.name} {item.schoolClass.name}</View>
                                            </View>
                                        }
                                    </View>
                                    <View className='action'>
                                        {item.birthday}
                                    </View>
                                    <View className="move">
                                        <View className="bg-grey" onClick={doEdit} data-id={item.id}>编辑</View>
                                        <View className="bg-red" onClick={doDelete} data-id={item.id}>删除</View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                }
                {(students.length == 0) &&
                    <View style={{position: 'fixed', bottom: 30, width: '100%', left: 0, padding: '0 25rpx'}}>
                        {
                            !isLogined ?
                                <Button className="cu-btn bg-gradual-orange shadow block lg radius"
                                        onClick={() => makeLogin(() => loadData())}>点击登录</Button>
                                :
                                <Navigator url={"new_child?member_id=" + params.member_id ?? ''}
                                           className="cu-btn bg-gradual-orange shadow block lg radius"><Text
                                    className="cuIcon-add"/>添加借阅人</Navigator>
                        }
                    </View>
                }
            </View>
        </PageLayout>
    );
}

export default withLogin(Children);
