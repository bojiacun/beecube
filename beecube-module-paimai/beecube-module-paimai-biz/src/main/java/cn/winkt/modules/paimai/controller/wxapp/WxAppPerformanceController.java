package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.service.IPerformanceService;
import cn.winkt.modules.paimai.vo.GoodsVO;
import cn.winkt.modules.paimai.vo.PerformanceVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.exception.JeecgBootException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/paimai/api/performances")
public class WxAppPerformanceController {


    @Resource
    IPerformanceService performanceService;

    @Resource
    IGoodsService goodsService;


    @AutoLog(value = "专场表-分页列表查询")
    @ApiOperation(value = "专场表-分页列表查询", notes = "专场表-分页列表查询")
    @GetMapping(value = "/list")
    public Result<?> queryPageList(Performance performance,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<PerformanceVO> queryWrapper = new QueryWrapper<>();
        if(StringUtils.isNotEmpty(performance.getAuctionId())) {
            queryWrapper.eq("p.auction_id", performance.getAuctionId());
        }
        if(performance.getType() != null) {
            queryWrapper.eq("p.type", performance.getType());
        }
        queryWrapper.eq("p.status", 1);
        String source = req.getParameter("source");
        Date nowDate = new Date();
        if("1".equals(source)) {
            //进行中拍品,并且尚未结束的哦
            queryWrapper.gt("p.end_time", nowDate);
        }
        else if("2".equals(source)) {
            queryWrapper.lt("p.end_time", nowDate);
        }
        //排序
        String orderField = StringUtils.getIfEmpty(req.getParameter("column"), () -> "create_time");
        orderField = "p."+orderField;
        String orderBy = StringUtils.getIfEmpty(req.getParameter("orderBy"), () -> "desc");

        if(orderBy.equals("desc")) {
            queryWrapper.orderByDesc(orderField);
        }
        else {
            queryWrapper.orderByAsc(orderField);
        }

        Page<PerformanceVO> page = new Page<>(pageNo, pageSize);
        IPage<PerformanceVO> pageList = performanceService.selectPageVO(page, queryWrapper);
        return Result.OK(pageList);
    }

    @GetMapping("/detail")
    public Result<PerformanceVO> detail(@RequestParam(name = "id", defaultValue = "0") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到专场");
        }
        return Result.OK(performanceService.getDetail(id));
    }

    /**
     * 获取该场下所有拍品
     * @param id
     * @return
     */
    @GetMapping("/goods")
    public Result<List<GoodsVO>> detailGoods(@RequestParam(name = "id", defaultValue = "0") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到专场");
        }
        QueryWrapper<Goods> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("g.status", 1);
        queryWrapper.eq("g.peformance_id", id);

        return Result.OK(goodsService.selectListVO(queryWrapper));
    }
}
