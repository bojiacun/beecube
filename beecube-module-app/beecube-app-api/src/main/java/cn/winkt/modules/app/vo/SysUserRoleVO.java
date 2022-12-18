package cn.winkt.modules.app.vo;

import lombok.Data;

import java.util.List;

@Data
public class SysUserRoleVO {

    private String roleId;
    private List<String> userIdList;
}
