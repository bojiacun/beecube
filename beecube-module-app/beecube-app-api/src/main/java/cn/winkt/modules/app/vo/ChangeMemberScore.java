package cn.winkt.modules.app.vo;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ChangeMemberScore {
    private String memberId;
    private BigDecimal amount;

    private String description;
}
