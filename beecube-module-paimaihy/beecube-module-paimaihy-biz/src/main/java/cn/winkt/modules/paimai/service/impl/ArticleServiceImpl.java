package cn.winkt.modules.paimai.service.impl;

import cn.winkt.modules.paimai.entity.Article;
import cn.winkt.modules.paimai.mapper.ArticleMapper;
import cn.winkt.modules.paimai.service.IArticleService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 文章表
 * @Author: jeecg-boot
 * @Date:   2023-03-13
 * @Version: V1.0
 */
@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements IArticleService {

}
