package cn.winkt.modules.app.utils;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipFile;

import java.io.*;
import java.util.Enumeration;

public class ZipUtils {

    public static void unzip(String zipFileName, String destPath) throws Exception {
        ZipFile zipFile = new ZipFile(new File(zipFileName));
        byte[] buffer = new byte[4096];
        ZipArchiveEntry entry;
        Enumeration<ZipArchiveEntry> entries = zipFile.getEntries(); // 获取全部文件的迭代器
        InputStream inputStream;
        while (entries.hasMoreElements()) {
            entry = entries.nextElement();
            if (entry.isDirectory()) {
                continue;
            }

            File outputFile = new File(destPath + "/" + entry.getName());

            if (!outputFile.getParentFile().exists()) {
                outputFile.getParentFile().mkdirs();
            }

            inputStream = zipFile.getInputStream(entry);
            try (FileOutputStream fos = new FileOutputStream(outputFile)) {
                while (inputStream.read(buffer) > 0) {
                    fos.write(buffer);
                }
            } catch (FileNotFoundException e) {
                throw e;
            } catch (IOException e) {
                throw e;
            }
        }
    }
}
