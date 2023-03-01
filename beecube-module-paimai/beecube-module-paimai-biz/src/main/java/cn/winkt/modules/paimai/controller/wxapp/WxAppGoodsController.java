package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.*;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.vo.GoodsVO;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
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
        QueryWrapper<Goods> queryWrapper = QueryGenerator.initQueryWrapper(goods, req.getParameterMap());
        queryWrapper.eq("status", 1);
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.page(page, queryWrapper);
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
