package cn.winkt.modules.paimai.controller.wxapp;

import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsClass;
import cn.winkt.modules.paimai.service.IGoodsClassService;
import cn.winkt.modules.paimai.service.IGoodsService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.ApiOperation;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoDict;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.query.QueryGenerator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @AutoLog(value = "拍品表-分页列表查询")
    @ApiOperation(value="拍品表-分页列表查询", notes="拍品表-分页列表查询")
    @GetMapping(value = "/list")
    public Result<?> queryPageList(Goods goods,
                                   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
                                   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
                                   HttpServletRequest req) {
        QueryWrapper<Goods> queryWrapper = QueryGenerator.initQueryWrapper(goods, req.getParameterMap());
        queryWrapper.eq("status", 1);
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.page(page, queryWrapper);
        return Result.OK(pageList);
    }

    @GetMapping("/classes")
    public Result<List<GoodsClass>> classes() {
        LambdaQueryWrapper<GoodsClass> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        lambdaQueryWrapper.eq(GoodsClass::getStatus, 1);
        lambdaQueryWrapper.orderByDesc(GoodsClass::getCreateTime);
        return Result.OK(goodsClassService.list(lambdaQueryWrapper));
    }
}
