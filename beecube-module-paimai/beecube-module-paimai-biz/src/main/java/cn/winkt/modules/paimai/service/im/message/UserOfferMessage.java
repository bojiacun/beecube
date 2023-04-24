package cn.winkt.modules.paimai.service.im.message;

import lombok.Data;
import org.jeecg.common.desensitization.annotation.SensitiveField;
import org.jeecg.common.desensitization.enums.SensitiveEnum;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class UserOfferMessage extends BaseMessage{
    private String goodsId;
    private BigDecimal price;
    private String userId;
    @SensitiveField(type = SensitiveEnum.CHINESE_NAME)
    private String userName;
    private String userAvatar;
    private Date offerTime = new Date();
}
