package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.vo.GoodsVO;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/paimai/api/goods")
public class WxAppGoodsController {

    @Resource
    IGoodsService goodsService;

    @Resource
    IGoodsClassService goodsClassService;



    @Resource
    IGoodsOfferService goodsOfferService;

    @AutoLog(value = "拍品表-分页列表查询")
    @ApiOperation(value = "拍品表-分页列表查询", notes = "拍品表-分页列表查询")
    @GetMapping(value = "/list")
    public Result<?> queryPageList(Goods goods,
                                   @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                   @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<Goods> queryWrapper = new QueryWrapper<>();
        if(StringUtils.isNotEmpty(goods.getClassId())) {
            queryWrapper.eq("g.class_id", goods.getClassId());
        }
        if(goods.getType() != null) {
            queryWrapper.eq("g.type", goods.getType());
        }
        queryWrapper.eq("g.status", 1);
        String source = req.getParameter("source");
        Date nowDate = new Date();
        if("1".equals(source)) {
            //进行中拍品,并且尚未结束的哦
            queryWrapper.gt("g.end_time", nowDate).or().gt("g.actual_end_time", nowDate);
        }
        else if("2".equals(source)) {
            queryWrapper.lt("g.end_time", nowDate).or().lt("g.actual_end_time", nowDate);
        }
        //排序
        String orderField = StringUtils.getIfEmpty(req.getParameter("column"), () -> "create_time");
        orderField = "g."+orderField;
        String orderBy = StringUtils.getIfEmpty(req.getParameter("orderBy"), () -> "desc");
        if(orderBy.equals("desc")) {
            queryWrapper.orderByDesc(orderField);
        }
        else {
            queryWrapper.orderByAsc(orderField);
        }

        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<GoodsVO> pageList = goodsService.selectPageVO(page, queryWrapper);
        return Result.OK(pageList);
    }


    @GetMapping("/offers")
    public Result<?> goodsOfferList(@RequestParam(name = "id", defaultValue = "0") String id,
                                    @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                    @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
                                    ) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到拍品");
        }
        LambdaQueryWrapper<GoodsOffer> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsOffer::getGoodsId, id);
        queryWrapper.orderByDesc(GoodsOffer::getPrice);
        Page<GoodsOffer> page = new Page<>(pageNo, pageSize);
        IPage<GoodsOffer> pageList = goodsOfferService.page(page, queryWrapper);
        return Result.OK(pageList);
    }
    @GetMapping("/offers/max")
    public Result<?> maxGoodsOfferList(@RequestParam(name = "id", defaultValue = "0") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到拍品");
        }
        Double max = goodsOfferService.getMaxOffer(id);
        if(max == null) {
            Goods goods = goodsService.getById(id);
            max = goods.getStartPrice().doubleValue();
        }
        return Result.OK(max);
    }
    @GetMapping("/classes")
    public Result<List<GoodsClass>> classes() {
        LambdaQueryWrapper<GoodsClass> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.eq(GoodsClass::getStatus, 1);
        lambdaQueryWrapper.orderByDesc(GoodsClass::getCreateTime);
        return Result.OK(goodsClassService.list(lambdaQueryWrapper));
    }

    @GetMapping("/detail")
    public Result<GoodsVO> detail(@RequestParam(name = "id", defaultValue = "0") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到拍品");
        }
        return Result.OK(goodsService.getDetail(id));
    }


}
