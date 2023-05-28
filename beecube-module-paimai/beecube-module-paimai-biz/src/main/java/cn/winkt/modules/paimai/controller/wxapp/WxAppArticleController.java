package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.ChangeMemberScore;
import cn.winkt.modules.app.vo.MemberSetting;
import cn.winkt.modules.paimai.entity.Article;
import cn.winkt.modules.paimai.entity.ArticleClass;
import cn.winkt.modules.paimai.entity.DayTask;
import cn.winkt.modules.paimai.service.IArticleClassService;
import cn.winkt.modules.paimai.service.IArticleService;
import cn.winkt.modules.paimai.service.IDayTaskService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.seata.spring.annotation.GlobalTransactional;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.models.auth.In;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.base.controller.JeecgController;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.CommonUtils;
import org.jeecg.common.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
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

   @Resource
   private AppApi appApi;

   @Resource
   private IDayTaskService dayTaskService;
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
       String key = req.getParameter("key");
       if(StringUtils.isNotEmpty(key)) {
           queryWrapper.like("title", key);
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
   @GlobalTransactional
   public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
       Article article = articleService.getById(id);
       //增加阅读量
       article.setViews(article.getViews()+1);
       articleService.updateById(article);


       //每日阅读送积分
       LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
       MemberSetting memberSetting = appApi.queryMemberSettings();
       if(loginUser != null && StringUtils.isNotEmpty(memberSetting.getReadIntegral())) {
           LambdaQueryWrapper<DayTask> queryWrapper = new LambdaQueryWrapper<>();
           queryWrapper.eq(DayTask::getMemberId, loginUser.getId());
           queryWrapper.ge(DayTask::getCreateTime, DateUtils.todayZeroTime());
           queryWrapper.le(DayTask::getCreateTime, DateUtils.todayEndTime());
           queryWrapper.eq(DayTask::getType, 1);
           if(dayTaskService.count(queryWrapper) == 0) {
               ChangeMemberScore changeMemberScore = new ChangeMemberScore();
               changeMemberScore.setAmount(new BigDecimal(memberSetting.getReadIntegral()));
               changeMemberScore.setMemberId(loginUser.getId());
               changeMemberScore.setDescription("每日阅读送积分");
               appApi.reduceMemberScore(changeMemberScore);

               DayTask dayTask = new DayTask();
               dayTask.setType(1);
               dayTask.setMemberId(loginUser.getId());
               dayTask.setMemberName(loginUser.getRealname());
               dayTask.setMemberAvatar(loginUser.getAvatar());
               dayTaskService.save(dayTask);
           }
       }

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
