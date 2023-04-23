package cn.winkt.modules.paimai.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.archivers.zip.ZipFile;
import org.apache.commons.compress.archivers.zip.ZipUtil;
import org.apache.commons.io.IOUtils;
import org.jeecg.common.api.vo.Result;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@Api(tags = "汇智拍卖安装程序")
@Slf4j
public class InstallerController {

    @PutMapping("/install")
    @ApiOperation(value = "install", notes = "执行汇智拍卖安装脚本")
    public Result<?> install() {
        return Result.OK(true);
    }
    @PutMapping("/uninstall")
    @ApiOperation(value = "uninstall", notes = "执行汇智拍卖卸载脚本")
    public Result<?> uninstall() {
        return Result.OK(true);
    }
    @PutMapping("/upgrade")
    @ApiOperation(value = "upgrade", notes = "执行汇智拍卖升级脚本")
    public Result<?> upgrade() {
        return Result.OK(true);
    }


    @GetMapping("/resources/ui")
    public byte[] uiResource() throws IOException {
        ClassPathResource uiZipResource = new ClassPathResource("static/ui.zip");
        byte[] buffer = new byte[(int)uiZipResource.getFile().length()];
        IOUtils.readFully(uiZipResource.getInputStream(), buffer);
        return buffer;
    }
}
