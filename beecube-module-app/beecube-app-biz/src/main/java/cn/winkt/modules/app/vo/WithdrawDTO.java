package cn.winkt.modules.app.vo;

import cn.winkt.modules.app.entity.AppMemberMoneyRecord;
import lombok.Data;

@Data
public class WithdrawDTO extends AppMemberMoneyRecord {
    private String memberName;
    private String memberAvatar;
}
