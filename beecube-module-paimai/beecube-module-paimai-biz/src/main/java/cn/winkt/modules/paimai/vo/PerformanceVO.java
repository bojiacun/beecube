package cn.winkt.modules.paimai.vo;

import lombok.Data;

@Data
public class PerformanceVO {
    /**id*/
    private java.lang.String id;
    /**标题*/
    private java.lang.String title;
    /**开拍时间*/
    private java.util.Date startTime;
    /**结束时间*/
    private java.util.Date endTime;
    /**固定保证金*/
    private String tags;
    private Integer sortNum;
    private java.lang.Float deposit;
    /**预览图片*/
    private java.lang.String preview;
    /**拍卖会ID*/
    private java.lang.String auctionId;
    private String auctionTitle;
    private String auctionAddress;
    private String auctionTimeRange;

    /**专场类型（1限时拍、2为同步拍)*/
    private java.lang.Integer type;
    /**创建时间*/
    private java.util.Date createTime;
    /**创建人*/
    private java.lang.String createBy;
    /**更新时间*/
    private java.util.Date updateTime;
    /**更新人*/
    /**状态（0下架、1上架）*/
    private java.lang.Integer status;
    private java.lang.String appId;
    private Integer goodsCount;
    private Integer viewCount;
    private Integer offerCount;
    private Integer followCount;
    private Integer depositCount;
    private Integer started;
    private Integer ended;
}
