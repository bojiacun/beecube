package cn.winkt.modules.app.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import cn.winkt.modules.app.entity.AppPublish;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 应用前端发布版本表
 * @Author: jeecg-boot
 * @Date:   2023-04-02
 * @Version: V1.0
 */
public interface AppPublishMapper extends BaseMapper<AppPublish> {
    AppPublish getLatestPublish();
}
