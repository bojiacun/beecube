import {ScrollView, View} from "@tarojs/components";
import {useEffect, useState} from "react";
import request from "../../../../lib/request";
import ArticleItemView from "./ArticleItemView";


const ArticleListModule = (props: any) => {
    const {index, basic, style, ...rest} = props;
    const [articleList, setArticleList] = useState<any[]>([]);

    useEffect(() => {
        request.get('/paimai/api/articles/list', {
            params: {
                type: basic.type,
                classId: basic.classId,
                postFlag: basic.postFlag,
                pageSize: basic.count
            }
        }).then(res => {
            setArticleList(res.data.result.records);
        })
    }, []);

    if (basic.direction === 'horizontal') {
        //横向滚动
        return (
            <ScrollView scrollY={false} scrollX style={style} className='box-border' {...rest}>
                <View className='flex flex-nowrap space-x-4'>
                    {articleList.map((item: any) => {
                        return (
                            <ArticleItemView item={item} radius={basic.itemBorderRadius} width={basic.itemWidth||'90%'} height={basic.itemHeight||200} />
                        );
                    })}
                </View>
            </ScrollView>
        );
    }

    return (
        <View style={style} className='grid grid-cols-1 gap-4' {...rest}>
            {articleList.map((item: any) => {
                return (
                    <ArticleItemView item={item} radius={basic.itemBorderRadius} />
                );
            })}
        </View>
    );

}

export default ArticleListModule;
