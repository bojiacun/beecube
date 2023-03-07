package cn.winkt.modules.paimai.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.annotations.ApiModelProperty;
import org.jeecg.common.aspect.annotation.Dict;
import org.jeecgframework.poi.excel.annotation.Excel;

public class GoodsDepositVO {
    /**id*/
    private java.lang.String id;
    /**商品ID*/
    private java.lang.String goodsId;
    private String goodsName;
    /**专场ID*/
    private java.lang.String performanceId;
    private String performanceName;
    /**拍卖会ID*/
    private java.lang.String auctionId;
    /**保证金金额*/
    private java.lang.Float price;
    /**缴纳者Id*/
    private java.lang.String memberId;
    /**交易单号*/
    private java.lang.String transactionId;
    /**缴纳者*/
    private java.lang.String memberName;
    /**缴纳者头像*/
    private java.lang.String memberAvatar;
    /**创建时间*/
    private java.util.Date createTime;
    /**创建人*/
    private java.lang.String createBy;
    private java.lang.String appId;
    private java.lang.Integer status;
}
