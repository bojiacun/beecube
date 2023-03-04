import { AttributeTabs, registerModule } from "../../component"
import image from 'assets/designer/s4_2.png';
import biaoqian from 'assets/designer/biaoqian.png';
import { useEffect, useState } from "react";
import BoxSettings, { DEFAULT_BOX_STYLES } from "../BoxSettings";
import { getPagedGoods, getShopClasses } from "./service";
import {resolveUrl} from "~/utils/utils";


export const GOODS_LIST_MODULE = "GOODS_LIST_MODULE";

export const defaultData = {
    basic: {
        title: '没大没小商城',
        titleType: 1,
        titleimg: '',
        titleimgWidth: 100,
        titleTopMargin: 0,
        titleBottomMargin: 0,
        propType: 1,
        space: 15,
        fontSize: 16,
        itemBorderRadius: 15,
        style: 1,
        count: 2,
        dataSource: 1,
        searchTag: '',
    },
    style: {
        ...DEFAULT_BOX_STYLES,
        background: '#F5F5F5',
    }
};

const GoodsListModuleAttribute = (props: any) => {
    const { onUpdate, data } = props;

    let _data = { ...defaultData, ...data };


    return (
        <AttributeTabs tabs={['控件设置', '样式设置']}>
            <div style={{ padding: 15 }}>

            </div>
            <div style={{ padding: 15 }}>

            </div>
        </AttributeTabs>
    );
}

const GoodsListModule = (props: any) => {
    const { index, data, isPreview, ...rest } = props;
    const [goodsList, setGoodsList] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [currentClassIndex, setCurrentClassIndex] = useState<number>(0);
    let _data = { ...defaultData, ...data };
    const types = [{title: '最新', value: 1}, {title: '推荐', value: 2}, {title: '热销', value: 3}];
    let tagColors = ['#ff5454', '#2c9940', '#fb9d0f'];
    useEffect(() => {
        if (_data.basic.dataSource == 1) {
            //最新商品
            getPagedGoods(1).then(res => {
                setGoodsList(res.data.content);
            });
        }
        else if (_data.basic.dataSource == 2) {
            getPagedGoods(2).then(res => {
                setGoodsList(res.data.content);
            });
        }
        else if (_data.basic.dataSource == 3) {
            getPagedGoods(2, _data.basic.searchTag).then(res => {
                setGoodsList(res.data.content);
            });
        }
        else {
            setGoodsList([]);
        }
    }, [data.basic.dataSource, data.basic.items]);
    useEffect(() => {
        if (_data.basic.titleType == 2) {
            getShopClasses().then(res => {
                setClasses(res.data);
            })
        }
    }, [data.basic.titleType]);
    return (
        <div {...rest} style={_data.style}>
            {_data.basic.titleType == 1&&
                <div style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img src={biaoqian} alt={''} style={{ display: 'block', width: '50%', position: 'absolute', zIndex: 0 }} />
                    <h1 style={{ zIndex: 1, fontSize: _data.basic.fontSize, marginBottom: 20 }}>{_data.basic.title}</h1>
                </div>
            }
            {_data.basic.titleType == 5 &&
                <div style={{
                    position: 'relative',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <img src={resolveUrl(_data.basic.titleimg)} alt={''} style={{display: 'block', width: _data.basic.titleimgWidth+'%', marginBottom: _data.basic.titleBottomMargin, marginTop: _data.basic.titleTopMargin}} />
                </div>
            }
            {_data.basic.titleType == 2 &&
            <div className={"noscroll"} style={{textAlign: 'center', overflowY: 'auto'}}>
                <div style={{ display: 'inline-flex', marginBottom: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 8, backgroundColor: "#eaeaea" }}>
                    {classes.map((item: any, index: number) => {
                        if (index == currentClassIndex) {
                            return (
                                <div key={'shop_classes_' + index} style={{ color: '#333', background: '#fdc019', padding: 10, fontSize: 14, fontWeight: 'bold' }}>
                                <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                                    {item.title}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={'shop_classes_' + index} onClick={() => setCurrentClassIndex(index)} style={{color: '#999999', padding: 10, position: 'relative'}}>
                                {index < classes.length - 1&& <div style={{width: 1, height: '50%', position: 'absolute', right: 0, top: '25%', backgroundColor: '#ccc'}}></div>}
                                <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                                    {item.title}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            }
            {_data.basic.titleType == 3 &&
                <div className={"noscroll"} style={{textAlign: 'center', overflowY: 'auto'}}>
                    <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 8, backgroundColor: "#eaeaea" }}>
                        {types.map((item: any, index: number) => {
                            if (index == currentClassIndex) {
                                return (
                                    <div key={'subscribe_types_' + index} style={{ flex: 1, color: '#333', background: '#fdc019', padding: 10, fontSize: 14, fontWeight: 'bold' }}>
                                        <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                                            {item.title}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div key={'subscribe_types_' + index} onClick={() => setCurrentClassIndex(index)} style={{flex: 1,color: '#999999', padding: 10, position: 'relative'}}>
                                    {index < types.length - 1&& <div style={{width: 1, height: '50%', position: 'absolute', right: 0, top: '25%', backgroundColor: '#ccc'}}></div>}
                                    <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                                        {item.title}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            }
            {_data.basic.style == 1 &&
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {goodsList.slice(0, _data.basic.count).map((item: any) => {
                        let itemWidth = _data.basic.space;
                        itemWidth = 'calc((100% - ' + itemWidth + 'px) / 2)';
                        return (
                            <div key={item.id} style={{ width: itemWidth, background: 'white', padding: 10, marginBottom: _data.basic.space, borderRadius: _data.basic.itemBorderRadius, position: 'relative' }}>
                                {item.isMemberPrivate && <div style={{ backgroundColor: '#ff5454', padding: '0 5px', color: 'white', position: 'absolute', left: 10, top: 20, zIndex: 1, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>会员专享</div>}
                                <div style={{paddingTop: '100%', width: '100%', position: 'relative'}}>
                                    <img src={resolveUrl(item.images.split(',')[0])} alt={item.name} style={{ position: 'absolute', left: 0, top: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover', zIndex: 99 }} />
                                </div>
                                <h3 style={{ whiteSpace: 'nowrap', overflow: 'hidden', marginBottom: 0, lineHeight: 2 }}>{item.shortName}</h3>
                                <div style={{ fontSize: 12, display: 'flex' }}>
                                    {item.site.enableDelivery && <div style={{ backgroundColor: '#faead5', color: '#fb9d0f', marginRight: 10, padding: '0 3px', borderBottomRightRadius: 5 }}>#快递配送</div>}
                                    {item.site.enableSelfPickUp && <div style={{ backgroundColor: '#dbece4', color: '#2c9940', marginRight: 10, padding: '0 3px', borderBottomRightRadius: 5 }}>#到店自提</div>}
                                </div>
                                <div style={{ color: 'gray', fontSize: 12, marginTop: 3 }}>{item.soled}人借阅</div>
                            </div>
                        );
                    })}
                </div>
            }
            {_data.basic.style == 2 &&
                goodsList.slice(0, _data.basic.count).map((item: any, index: number) => {
                    return (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '10px 15px', marginBottom: index == goodsList.length - 1 ?0:_data.basic.space, borderRadius: _data.basic.itemBorderRadius, position: 'relative' }}>
                            <div style={{width: 80, marginRight: 15}}>
                                <img src={resolveUrl(item.images.split(',')[0])} alt={item.name} style={{ display: 'block', width: '100%', height: 80, objectFit: 'cover' }} />
                            </div>
                            <div style={{flex: 1}}>
                                <h3 style={{ whiteSpace: 'nowrap', overflow: 'hidden', marginBottom: 0, lineHeight: 2 }}>{item.shortName}</h3>
                                <div style={{ color: 'gray', fontSize: 12, marginTop: 3 }}>{item.soled}人借阅 作者：{item.author}</div>
                                <div>
                                    {item.tags?.split(',').map((tag:string, index: number)=>{
                                        return <span style={{backgroundColor: tagColors[index], padding: '3px 5px', color: 'white', marginRight: 5}}>{tag}</span>
                                    })}
                                </div>
                                <div>会员价：<span style={{color: '#ff5454', fontWeight: 'bold', fontSize: 18}}>{item.price}</span></div>
                                <div style={{color: 'gray'}}>原价：<span style={{textDecoration: 'line-through'}}>{item.price}</span></div>
                            </div>
                            <button style={{backgroundColor: '#ffba16', borderRadius: 15, position: 'absolute', right: 15, bottom: 15, border: 'none', padding: '5px 20px'}}>加入购物车</button>
                        </div>
                    );
                })
            }

        </div>
    );
}



export default function (module='') {
    if(module === 'paimai') {
        registerModule(GOODS_LIST_MODULE, "拍品列表", image, '拍卖模块', GoodsListModule, GoodsListModuleAttribute, defaultData);
    }
}