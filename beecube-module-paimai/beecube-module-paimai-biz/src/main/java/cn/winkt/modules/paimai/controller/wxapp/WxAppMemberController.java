package cn.winkt.modules.paimai.controller.wxapp;


import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsFollow;
import cn.winkt.modules.paimai.entity.GoodsView;
import cn.winkt.modules.paimai.service.IGoodsFollowService;
import cn.winkt.modules.paimai.service.IGoodsService;
import cn.winkt.modules.paimai.service.IGoodsViewService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RequestMapping("/paimai/api/members")
@RestController
public class WxAppMemberController {

    @Resource
    IGoodsService goodsService;
    @Resource
    IGoodsFollowService goodsFollowService;

    @Resource
    IGoodsViewService goodsViewService;
    @GetMapping("/views")
    public Result<?> queryMemberViewGoods(
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
    ) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(loginUser == null) {
            return Result.OK(null);
        }
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.queryMemberViewGoods(loginUser.getId(), page);
        return Result.OK(pageList);
    }


    @PostMapping("/views")
    public Result<Boolean> viewGoods(@RequestParam(name = "id", defaultValue = "0") String id) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(loginUser != null) {
            LambdaQueryWrapper<GoodsView> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(GoodsView::getGoodsId, id);
            queryWrapper.eq(GoodsView::getMemberId, loginUser.getId());
            if(goodsViewService.count(queryWrapper) == 0) {
                //没有浏览记录，则生成浏览记录
                GoodsView goodsView = new GoodsView();
                goodsView.setGoodsId(id);
                goodsView.setMemberId(loginUser.getId());
                goodsView.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
                goodsView.setMemberAvatar(loginUser.getAvatar());
                goodsViewService.save(goodsView);
                return Result.OK(true);
            }
        }
        return Result.OK(false);
    }

    @GetMapping("/follows")
    public Result<?> queryMemberFollowGoods(
            @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
    ) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(loginUser == null) {
            return Result.OK(null);
        }
        Page<Goods> page = new Page<Goods>(pageNo, pageSize);
        IPage<Goods> pageList = goodsService.queryMemberFollowGoods(loginUser.getId(), page);
        return Result.OK(pageList);
    }


    @GetMapping("/isfollow")
    public Result<Boolean> queryGoodsFollow(@RequestParam(name = "id", defaultValue = "0") String id) {
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("找不到拍品");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if (loginUser == null) {
            return Result.OK(false);
        }
        LambdaQueryWrapper<GoodsFollow> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsFollow::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsFollow::getGoodsId, id);
        return Result.OK(goodsFollowService.count(queryWrapper) > 0);
    }

    @PutMapping("/follow/toggle")
    public Result<Boolean> toggleFollow(@RequestBody JSONObject params) {
        String id = params.getString("id");
        if (StringUtils.isEmpty(id)) {
            throw new JeecgBootException("操作失败找不到拍品");
        }
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<GoodsFollow> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsFollow::getGoodsId, id);
        queryWrapper.eq(GoodsFollow::getMemberId, loginUser.getId());


        long count = goodsFollowService.count(queryWrapper);
        if (count > 0) {
            //删除所有关注记录
            goodsFollowService.remove(queryWrapper);
            return Result.OK(false);
        } else {
            GoodsFollow goodsFollow = new GoodsFollow();
            goodsFollow.setGoodsId(id);
            goodsFollow.setMemberId(loginUser.getId());
            goodsFollow.setMemberName(StringUtils.getIfEmpty(loginUser.getPhone(), loginUser::getRealname));
            goodsFollow.setMemberAvatar(loginUser.getAvatar());
            goodsFollowService.save(goodsFollow);
            return Result.OK(true);
        }
    }
}
