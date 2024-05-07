package cn.winkt.modules.paimai.service.impl;

import cn.hutool.core.io.FileTypeUtil;
import cn.hutool.core.io.FileUtil;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.common.PaimaiConstant;
import cn.winkt.modules.paimai.entity.GoodsDeposit;
import cn.winkt.modules.paimai.entity.PaimaiBidder;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.mapper.PerformanceMapper;
import cn.winkt.modules.paimai.service.IGoodsDepositService;
import cn.winkt.modules.paimai.service.IPaimaiBidderService;
import cn.winkt.modules.paimai.service.IPerformanceService;
import cn.winkt.modules.paimai.vo.PerformanceVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.util.ExcelUtil;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @Description: 订单售后表
 * @Author: jeecg-boot
 * @Date:   2023-02-08
 * @Version: V1.0
 */
@Service
public class PerformanceServiceImpl extends ServiceImpl<PerformanceMapper, Performance> implements IPerformanceService {

    @Resource
    PerformanceMapper performanceMapper;

    @Resource
    IGoodsDepositService goodsDepositService;

    @Resource
    private IPaimaiBidderService paimaiBidderService;

    @Resource
    private AppApi appApi;

    @Override
    public PerformanceVO getDetail(String id) {
        return performanceMapper.getDetail(id);
    }

    @Override
    public IPage<PerformanceVO> selectPageVO(Page<PerformanceVO> page, QueryWrapper<PerformanceVO> queryWrapper) {
        return performanceMapper.selectPageVO(page, queryWrapper);
    }

    @Override
    public List<PerformanceVO> selectListVO(QueryWrapper<PerformanceVO> queryWrapper) {
        return performanceMapper.selectListVO(queryWrapper);
    }

    /**
     * 检查专场是否已经开始
     * @param performance
     * @return
     */
    public boolean isStarted(Performance performance) {
        Date now = new Date();
        if(performance.getType() == PaimaiConstant.PEFORMANCE_TYPE_TIMED) {
            return now.after(performance.getStartTime());
        }
        else if(performance.getType() == PaimaiConstant.PERFORMANCE_TYPE_SYNC) {
            return performance.getState() > 0;
        }
        return false;
    }

    public boolean isStarted(String performanceId) {
        return isStarted(getById(performanceId));
    }

    public boolean isEnded(Performance performance) {
        if(performance.getType() == PaimaiConstant.PEFORMANCE_TYPE_TIMED) {
            return new Date().after(performance.getEndTime());
        }
        else if(performance.getType() == PaimaiConstant.PERFORMANCE_TYPE_SYNC) {
            return performance.getState() >= 2;
        }
        return false;
    }

    @Override
    public boolean checkDeposite(LoginUser loginUser, Performance performance) {
        if(performance == null || performance.getDeposit() == null || performance.getDeposit() <= 0) {
            return true;
        }
        AppMemberVO member = appApi.getMemberById(loginUser.getId());
        //检查是否已经设置竞买人
        LambdaQueryWrapper<PaimaiBidder> bidderLambdaQueryWrapper = new LambdaQueryWrapper<>();
        bidderLambdaQueryWrapper.eq(PaimaiBidder::getPerformanceId, performance.getId());
        bidderLambdaQueryWrapper.eq(PaimaiBidder::getPhone, member.getPhone());
        if(paimaiBidderService.count(bidderLambdaQueryWrapper) > 0) {
            return true;
        }

        LambdaQueryWrapper<GoodsDeposit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(GoodsDeposit::getPerformanceId, performance.getId());
        queryWrapper.eq(GoodsDeposit::getMemberId, loginUser.getId());
        queryWrapper.eq(GoodsDeposit::getStatus, 1);
        if (goodsDepositService.count(queryWrapper) == 0) {
            return false;
        }
        return true;
    }

    @Override
    public boolean checkDeposite(LoginUser loginUser, String performanceId) {
        return checkDeposite(loginUser, getById(performanceId));
    }

    @Override
    public void importZip(String performanceId,File zipDirFile, LoginUser loginUser) {
        if(!zipDirFile.isDirectory()) {
            throw new JeecgBootException("导入的Zip文件解压出错");
        }
        File[] excelFiles = zipDirFile.listFiles(pathname -> FileTypeUtil.getType(pathname).equals("xlsx"));
        if(excelFiles == null || excelFiles.length == 0) {
            throw new JeecgBootException("没有找到EXCEL文件!请确保压缩包中有标的的EXCEL文件");
        }
        if(excelFiles.length > 1) {
            throw new JeecgBootException("找到多个EXCEL文件，请确保只有一个标的EXCEL文件");
        }
        File excelFile = excelFiles[0];
        //添加标的
        try {
            Workbook workbook = WorkbookFactory.create(excelFile);
            List<Map<String, String>> data = ExcelUtil.readExcel(workbook, 0, 0, 0);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean isEnded(String performanceId) {
        return isEnded(getById(performanceId));
    }
}
