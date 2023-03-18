package cn.winkt.modules.paimai.message;


import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import org.jeecg.common.desensitization.annotation.SensitiveField;
import org.jeecg.common.desensitization.enums.SensitiveEnum;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class OfferMessage extends Message{
    private String fromUserId;
    private String fromUserAvatar;
    @SensitiveField(type = SensitiveEnum.CHINESE_NAME)
    private String fromUserName;
    private String goodsId;
    private BigDecimal price;
    private String type = MessageConstant.MSG_TYPE_OFFER;

}
