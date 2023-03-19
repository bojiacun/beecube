package cn.winkt.modules.app.controller.api;

import cn.winkt.modules.app.api.SystemApi;
import cn.winkt.modules.app.config.AppMemberProvider;
import cn.winkt.modules.app.entity.AppMember;
import cn.winkt.modules.app.entity.AppMemberAddress;
import cn.winkt.modules.app.service.IAppMemberAddressService;
import cn.winkt.modules.app.service.IAppMemberService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.constant.CacheConstant;
import org.jeecg.common.constant.CommonConstant;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.system.vo.DictModel;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.system.vo.SysPermissionDataRuleModel;
import org.springframework.beans.BeanUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/app/api/members")
public class AppApiAppMemberController {

    @Resource
    IAppMemberService appMemberService;

    @Resource
    IAppMemberAddressService appMemberAddressService;

    @Resource
    SystemApi systemApi;

    //    获取当前用户信息
    @GetMapping("/profile")
    public Result<AppMember> memberDetail() {
        LoginUser sysUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(sysUser == null) {
            throw new JeecgBootException("当前未登录");
        }
        return Result.OK(appMemberService.getById(sysUser.getId()));
    }
    @GetMapping("/tmptoken")
    public Result<String> getSystemTempToken() {
        return Result.OK("",JwtUtil.sign("uploader", "ffe55b7947d8403ce5ea631d8503f03f"));
    }

    @PutMapping("/update")
    @CacheEvict(value = CacheConstant.SYS_USERS_CACHE, allEntries = true)
    public Result<AppMember> updateMember(@RequestBody AppMember appMember) {
        AppMember old = appMemberService.getById(appMember.getId());
        if(old == null) {
            throw new JeecgBootException("更新失败,未找到用户信息");
        }
        LambdaUpdateWrapper<AppMember> lambdaUpdateWrapper = new LambdaUpdateWrapper<>();
        lambdaUpdateWrapper
                .set(AppMember::getNickname, appMember.getNickname())
                .set(AppMember::getPhone, appMember.getPhone())
                .set(AppMember::getAvatar, appMember.getAvatar())
                .set(AppMember::getEmail, appMember.getEmail())
                .set(AppMember::getRealname, appMember.getRealname())
                .set(AppMember::getSex, appMember.getSex())
                .set(AppMember::getCardFace, appMember.getCardFace())
                .set(AppMember::getCardBack, appMember.getCardBack())
                .set(AppMember::getIdCard, appMember.getIdCard())
                .eq(AppMember::getId, old.getId());

        //使命认真
        if(StringUtils.isAnyEmpty(appMember.getCardBack(), appMember.getCardFace(), appMember.getRealname())) {
           lambdaUpdateWrapper.set(AppMember::getAuthStatus, 0);
        }
        else {
            lambdaUpdateWrapper.set(AppMember::getAuthStatus, 1);
        }
        appMemberService.update(lambdaUpdateWrapper);
        return Result.OK(appMemberService.getById(appMember.getId()));
    }

    @AutoLog(value = "应用会员地址信息表-通过id查询")
    @ApiOperation(value="应用会员地址信息表-通过id查询", notes="应用会员地址信息表-通过id查询")
    @GetMapping(value = "/addresses/detail")
    public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
        AppMemberAddress appMemberAddress = appMemberAddressService.getById(id);
        return Result.OK(appMemberAddress);
    }

    @AutoLog(value = "应用会员地址信息表-列表查询")
    @ApiOperation(value="应用会员地址信息表-列表查询", notes="应用会员地址信息表-列表查询")
    @GetMapping(value = "/addresses")
    public Result<?> queryPageList() {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<AppMemberAddress> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppMemberAddress::getMemberId, loginUser.getId());
        List<AppMemberAddress> pageList = appMemberAddressService.list(queryWrapper);
        return Result.OK(pageList);
    }

    @AutoLog(value = "应用会员地址信息表-默认地址查询")
    @ApiOperation(value="应用会员地址信息表-默认地址查询", notes="应用会员地址信息表-默认地址查询")
    @GetMapping(value = "/addresses/default")
    public Result<?> queryByDefault() {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        LambdaQueryWrapper<AppMemberAddress> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AppMemberAddress::getMemberId, loginUser.getId());
        AppMemberAddress appMemberAddress = null;
        //如果为空则查询第一个
        List<AppMemberAddress> appMemberAddresses = appMemberAddressService.list(queryWrapper);
        if(appMemberAddresses.size() > 0) {
            appMemberAddress = appMemberAddresses.get(0);
        }
        for (AppMemberAddress adr : appMemberAddresses) {
            if (adr.getIsDefault() != null && adr.getIsDefault() == 1) {
                appMemberAddress = adr;
            }
        }
        return Result.OK(appMemberAddress);
    }

    /**
     * 编辑
     *
     * @param appMemberAddress
     * @return
     */
    @AutoLog(value = "应用会员地址信息表-编辑")
    @ApiOperation(value="应用会员地址信息表-编辑", notes="应用会员地址信息表-编辑")
    @RequestMapping(value = "/addresses/edit", method = {RequestMethod.PUT,RequestMethod.POST})
    public Result<?> edit(@RequestBody AppMemberAddress appMemberAddress) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        if(appMemberAddress.getIsDefault() != null && appMemberAddress.getIsDefault() == 1) {
            //将其他的地址设置不默认
            LambdaUpdateWrapper<AppMemberAddress> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.set(AppMemberAddress::getIsDefault, 0);
            updateWrapper.eq(AppMemberAddress::getMemberId, loginUser.getId());
            appMemberAddressService.update(updateWrapper);
        }
        appMemberAddress.setMemberId(loginUser.getId());
        appMemberAddressService.updateById(appMemberAddress);
        return Result.OK("编辑成功!");
    }
    /**
     * 添加
     *
     * @param appMemberAddress
     * @return
     */
    @AutoLog(value = "应用会员地址信息表-添加")
    @ApiOperation(value="应用会员地址信息表-添加", notes="应用会员地址信息表-添加")
    @PostMapping(value = "/addresses/add")
    public Result<?> add(@RequestBody AppMemberAddress appMemberAddress) {
        LoginUser loginUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        appMemberAddress.setMemberId(loginUser.getId());
        appMemberAddressService.save(appMemberAddress);
        return Result.OK("添加成功！");
    }
    /**
     * 通过id删除
     *
     * @param id
     * @return
     */
    @AutoLog(value = "应用会员地址信息表-通过id删除")
    @ApiOperation(value="应用会员地址信息表-通过id删除", notes="应用会员地址信息表-通过id删除")
    @DeleteMapping(value = "/addresses/delete")
    public Result<?> delete(@RequestParam(name="id",required=true) String id) {
        appMemberAddressService.removeById(id);
        return Result.OK("删除成功!");
    }

}
