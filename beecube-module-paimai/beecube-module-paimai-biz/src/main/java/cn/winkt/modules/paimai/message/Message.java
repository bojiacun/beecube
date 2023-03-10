package cn.winkt.modules.paimai.message;

import cn.hutool.core.lang.Snowflake;
import com.alibaba.fastjson.annotation.JSONField;

import java.io.Serializable;
import java.util.Date;

public class Message implements Serializable {
    private static final Snowflake snowflake = new Snowflake(10, 10);
    private String id;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    private Date createTime = new Date();

    public Message() {
        this.id = snowflake.nextIdStr();
    }
}
