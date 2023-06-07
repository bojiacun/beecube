package cn.winkt.modules.app.vo;

import lombok.Data;

@Data
public class SmtTemplateVO {
    private String id;
    private Integer ruleMember;
    private String ruleMemberIds;
    private String url;
    private String vars;
    private String templateId;
    private String title;
}
