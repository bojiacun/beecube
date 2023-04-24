package org.jeecg.modules.oss.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import io.swagger.models.auth.In;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.util.ImageUtils;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.ImageFileUtils;
import org.jeecg.config.AppContext;
import org.jeecg.config.JeecgBaseConfig;
import org.jeecg.modules.oss.entity.OssFile;
import org.jeecg.modules.oss.service.IOssFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Objects;

/**
 * 云存储示例 DEMO
 * @author: jeecg-boot
 */
@Slf4j
@Controller
@RequestMapping("/sys/oss/file")
public class OssFileController {

	@Autowired
	private IOssFileService ossFileService;

	@Resource
	private JeecgBaseConfig jeecgBaseConfig;

	@ResponseBody
	@GetMapping("/list")
	public Result<IPage<OssFile>> queryPageList(OssFile file,
                                                @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize, HttpServletRequest req) {
		Result<IPage<OssFile>> result = new Result<>();
		QueryWrapper<OssFile> queryWrapper = QueryGenerator.initQueryWrapper(file, req.getParameterMap());
		if(StringUtils.isNotEmpty(AppContext.getApp())) {
			queryWrapper.eq("app_id", AppContext.getApp());
		}
		Page<OssFile> page = new Page<>(pageNo, pageSize);
		IPage<OssFile> pageList = ossFileService.page(page, queryWrapper);
		result.setSuccess(true);
		result.setResult(pageList);
		return result;
	}

	@ResponseBody
	@PostMapping("/upload")
	//@RequiresRoles("admin")
	public Result upload(@RequestParam("file") MultipartFile multipartFile, @RequestParam(value = "type", defaultValue = "1") Integer type) throws IOException {
		Result result = new Result();

		Integer imageUploadSize = jeecgBaseConfig.getImageUploadSize() == null ? 2: jeecgBaseConfig.getImageUploadSize();

		//限制图片文件上传大小
		if(type == 1) {
			long maxFileSize = imageUploadSize * 1024 * 1024;
			if(multipartFile.getSize() > maxFileSize) {
				throw new JeecgBootException("上传的图片太大，请将图片限制在"+imageUploadSize+"M以内");
			}
			if(Objects.equals(ImageFileUtils.getPicType(multipartFile.getInputStream()), ImageFileUtils.TYPE_UNKNOWN)) {
				throw new JeecgBootException("请上传正确的图片文件，图片文件只支持png和jpg");
			}
		}

		try {

			OssFile ossFile = ossFileService.upload(multipartFile, type);
			result.setResult(ossFile);
			result.success("上传成功！");
		} catch (Exception ex) {
			log.info(ex.getMessage(), ex);
			result.error500("上传失败");
		}
		return result;
	}

	@ResponseBody
	@DeleteMapping("/delete")
	public Result delete(@RequestParam(name = "id") String id) {
		Result result = new Result();
		OssFile file = ossFileService.getById(id);
		if (file == null) {
			result.error500("未找到对应实体");
		}else {
			boolean ok = ossFileService.delete(file);
			result.success("删除成功!");
		}
		return result;
	}

	/**
	 * 通过id查询.
	 */
	@ResponseBody
	@GetMapping("/queryById")
	public Result<OssFile> queryById(@RequestParam(name = "id") String id) {
		Result<OssFile> result = new Result<>();
		OssFile file = ossFileService.getById(id);
		if (file == null) {
			result.error500("未找到对应实体");
		} else {
			result.setResult(file);
			result.setSuccess(true);
		}
		return result;
	}

}
