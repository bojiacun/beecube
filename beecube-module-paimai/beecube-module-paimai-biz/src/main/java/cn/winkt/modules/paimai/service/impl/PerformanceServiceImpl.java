package cn.winkt.modules.paimai.service.impl;

import cn.hutool.core.io.FileTypeUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import cn.winkt.modules.app.api.AppApi;
import cn.winkt.modules.app.vo.AppMemberVO;
import cn.winkt.modules.paimai.common.PaimaiConstant;
import cn.winkt.modules.paimai.entity.Goods;
import cn.winkt.modules.paimai.entity.GoodsDeposit;
import cn.winkt.modules.paimai.entity.PaimaiBidder;
import cn.winkt.modules.paimai.entity.Performance;
import cn.winkt.modules.paimai.mapper.GoodsMapper;
import cn.winkt.modules.paimai.mapper.PerformanceMapper;
import cn.winkt.modules.paimai.service.*;
import cn.winkt.modules.paimai.vo.GoodsSettings;
import cn.winkt.modules.paimai.vo.PerformanceVO;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.common.util.oss.OssBootUtil;
import org.jeecg.config.AppContext;
import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileFilter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.math.BigDecimal;
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
@Slf4j
public class PerformanceServiceImpl extends ServiceImpl<PerformanceMapper, Performance> implements IPerformanceService {

    @Resource
    PerformanceMapper performanceMapper;

    @Resource
    IGoodsDepositService goodsDepositService;

    @Resource
    private IPaimaiBidderService paimaiBidderService;

    @Resource
    private GoodsMapper goodsMapper;

    @Resource
    private AppApi appApi;

    @Resource
    private IGoodsCommonDescService goodsCommonDescService;

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
        Performance performance = performanceMapper.selectById(performanceId);
        //找到专场图片
        File[] performanceImages = zipDirFile.listFiles((dir, name) -> name.equals(performance.getTitle()));
        if(performanceImages != null && performanceImages.length > 0) {
            String url = OssBootUtil.upload(FileUtil.getInputStream(performanceImages[0]), AppContext.getApp());
            performance.setPreview(url);
            updateById(performance);
        }
        GoodsSettings goodsSettings = goodsCommonDescService.queryGoodsSettings();

        //添加标的
        try {
            ExcelReader reader = ExcelUtil.getReader(excelFile);
            List<Map<String, Object>> data = reader.readAll();
            data.forEach(map -> {
                Goods goods = new Goods();
                goods.setType(1);
                goods.setSortNum(Integer.valueOf(map.get("拍品编号").toString()));
                goods.setPerformanceId(performanceId);
                goods.setAppId(AppContext.getApp());
                goods.setStartPrice(new BigDecimal(map.get("起拍价").toString()));
                goods.setDescription(map.get("拍品简介").toString());
                goods.setMinPrice(Float.valueOf(map.get("保留低价").toString()));
                goods.setBaseSales(0);
                goods.setState(1);
                goods.setClassId("");
                goods.setTitle(map.get("作品名称").toString());
                goods.setEvaluatePrice(map.get("估价").toString());
                goods.setDescDelivery(goodsSettings.getDescDelivery());
                goods.setDescDeposit(goodsSettings.getDescDeposit());
                goods.setDescRead(goodsSettings.getDescRead());
                goods.setDescFlow(goodsSettings.getDescFlow());
                goods.setDescNotice(goodsSettings.getDescNotice());
                goods.setContractNo(map.get("合同编号").toString());

                //设置加价幅度
                JSONArray uprange = new JSONArray();
                JSONObject first = new JSONObject();
                first.put("min", 0);
                first.put("max", Integer.valueOf(map.get("竞价阶梯").toString()));
                uprange.add(first);
                goods.setUprange(uprange.toJSONString());

                JSONArray fields = new JSONArray();
                importOtherFields(map, "作者", fields);
                importOtherFields(map, "质地形式", fields);
                importOtherFields(map, "拍品规格", fields);
                importOtherFields(map, "题识款识", fields);
                importOtherFields(map, "铃印", fields);
                importOtherFields(map, "重量", fields);
                importOtherFields(map, "备注", fields);
                goods.setFields(fields.toJSONString());
                goods.setImages("");
                goods.setState(0);
                goods.setStatus(1);
                goodsMapper.insert(goods);

                //找到图片,并上传图片
                File[] previewImageFile = zipDirFile.listFiles((dir, name) -> {
                    return FileNameUtil.mainName(name).equals(map.get("拍品编号").toString());
                });
                if(previewImageFile != null && previewImageFile.length > 0) {
                    setGoodsImage(goods, previewImageFile[0]);
                }
            });
            log.info("data length:{}", data.size());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    public boolean isEnded(String performanceId) {
        return isEnded(getById(performanceId));
    }

    @Async
    public void setGoodsImage(Goods goods, File imageFile) {
        String url = OssBootUtil.upload(FileUtil.getInputStream(imageFile), AppContext.getApp());
        goods.setImages(url);
        goodsMapper.updateById(goods);
    }
    private void importOtherFields(Map<String, Object> map, String key, JSONArray jsonArray) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("key", key);
        jsonObject.put("value", map.get(key).toString());
        jsonArray.add(jsonObject);
    }
}
