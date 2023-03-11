package cn.winkt.modules.paimai.message;

import cn.hutool.core.lang.Snowflake;
import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class Message implements Serializable {
    private static final Snowflake snowflake = new Snowflake(10, 10);
    protected String id;
    @JSONField(format = "yyyy-MM-dd HH:mm:ss")
    protected Date createTime = new Date();

    public Message() {
        this.id = snowflake.nextIdStr();
    }
}
