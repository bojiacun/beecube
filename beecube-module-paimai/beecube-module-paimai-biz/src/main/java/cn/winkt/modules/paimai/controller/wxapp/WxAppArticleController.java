package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.Article;
import cn.winkt.modules.paimai.entity.ArticleClass;
import cn.winkt.modules.paimai.service.IArticleClassService;
import cn.winkt.modules.paimai.service.IArticleService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.models.auth.In;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.base.controller.JeecgController;
import org.jeecg.common.system.query.QueryGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;

/**
* @Description: 文章表
* @Author: jeecg-boot
* @Date:   2023-03-13
* @Version: V1.0
*/
@Slf4j
@Api(tags="文章表")
@RestController
@RequestMapping("/api/articles")
public class WxAppArticleController extends JeecgController<Article, IArticleService> {
   @Autowired
   private IArticleService articleService;

   @Resource
   private IArticleClassService articleClassService;

   /**
    * 分页列表查询
    *
    * @param article
    * @param pageNo
    * @param pageSize
    * @param req
    * @return
    */
   @AutoLog(value = "文章表-分页列表查询")
   @ApiOperation(value="文章表-分页列表查询", notes="文章表-分页列表查询")
   @GetMapping(value = "/list")
   public Result<?> queryPageList(Article article,
                                  @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
                                  @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
                                  HttpServletRequest req) {
       QueryWrapper<Article> queryWrapper = QueryGenerator.initQueryWrapper(article, req.getParameterMap());
       String tag = req.getParameter("tag");
       if(StringUtils.isNotEmpty(tag)) {
           queryWrapper.like("tags", tag);
       }
       String tabId = req.getParameter("tabId");
       if("0".equals(tabId)) {
           queryWrapper.eq("post_flag", 1);
       }
       else if(StringUtils.isNotEmpty(tabId)){
           queryWrapper.eq("class_id", tabId);
       }
       queryWrapper.eq("status", 1);
       queryWrapper.select("id", "preview", "video", "type", "description", "title", "create_time", "views", "outer_link", "preview2", "author");
       Page<Article> page = new Page<Article>(pageNo, pageSize);
       IPage<Article> pageList = articleService.page(page, queryWrapper);
       return Result.OK(pageList);
   }
   /**
    * 通过id查询
    *
    * @param id
    * @return
    */
   @AutoLog(value = "文章表-通过id查询")
   @ApiOperation(value="文章表-通过id查询", notes="文章表-通过id查询")
   @GetMapping(value = "/queryById")
   public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
       Article article = articleService.getById(id);
       //增加阅读量
       article.setViews(article.getViews()+1);
       articleService.updateById(article);
       return Result.OK(article);
   }

   @GetMapping("/classes")
   public Result<List<ArticleClass>> allClasses(@RequestParam(defaultValue = "0", name = "type") Integer type) {
       LambdaQueryWrapper<ArticleClass> queryWrapper = new LambdaQueryWrapper<>();
       queryWrapper.eq(ArticleClass::getStatus, 1);
       if(type > 0) {
           queryWrapper.eq(ArticleClass::getType, type);
       }
       queryWrapper.orderByAsc(ArticleClass::getSortNum);
       return Result.OK(articleClassService.list(queryWrapper));
   }

    @AutoLog(value = "文章表-通过id查询")
    @ApiOperation(value="文章表-通过id查询", notes="文章表-通过id查询")
    @GetMapping(value = "/classes/detail")
    public Result<?> queryClassById(@RequestParam(name="id",required=true) String id) {
        ArticleClass articleClass = articleClassService.getById(id);
        return Result.OK(articleClass);
    }
}
