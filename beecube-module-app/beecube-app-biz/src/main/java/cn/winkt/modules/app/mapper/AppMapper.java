package cn.winkt.modules.app.mapper;

import cn.winkt.modules.app.entity.App;
import cn.winkt.modules.app.vo.AppDTO;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * @Description: 应用实体类
 * @Author: jeecg-boot
 * @Date:   2022-12-04
 * @Version: V1.0
 */
public interface AppMapper extends BaseMapper<App> {
     IPage<AppDTO> selectPageJoinAppModule(IPage<AppDTO> page, Wrapper<App> queryWrapper);
}
