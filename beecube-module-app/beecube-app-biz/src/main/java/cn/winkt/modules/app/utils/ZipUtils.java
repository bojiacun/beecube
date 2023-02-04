package cn.winkt.modules.app.utils;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipFile;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.Enumeration;

public class ZipUtils {
    public static void unzip(String zipFilePath, String destPath) throws Exception {
        unzip(new File(zipFilePath), destPath);
    }
    public static void unzip(File zip, String destPath) throws Exception {
        ZipFile zipFile = new ZipFile(zip);
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

    public static void download(String fileUrl, String path) throws IOException {
        URL url = new URL(fileUrl);
        URLConnection conn = url.openConnection();
        InputStream inputStream = conn.getInputStream();
        FileOutputStream fileOutputStream = new FileOutputStream(path);

        int bytesum = 0;
        int byteread;
        byte[] buffer = new byte[1024];
        while ((byteread = inputStream.read(buffer)) != -1) {
            bytesum += byteread;
            System.out.println(bytesum);
            fileOutputStream.write(buffer, 0, byteread);
        }
        fileOutputStream.close();
    }
}
