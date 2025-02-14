package me.davidpineiro.davidpineiroxyz.services;

import me.davidpineiro.davidpineiroxyz.DavidpineiroxyzApplication;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ResumeService {

    //how often the resume var is updated in milliseconds
    private static final long RESUME_RELOAD_DELAY = 1000*60*5;
    private static byte[] fileData2;
    private static final ReadWriteLock fileLock = new ReentrantReadWriteLock();

    private static synchronized void updateResume() throws IOException {
        System.out.println("update resume called(in another thread i hope)");
        final File currentResumeFile = new File("resume.pdf");
        final File newResumeFile = new File("resume.pdf.new");
        final File oldResumeFile = new File("resume.pdf.old");

        File theResumeFile = currentResumeFile;

        if(currentResumeFile.exists()){
            System.out.println("it exists alright!!!");
        }

        //we are assuming that the current file always exists because yea
        if(newResumeFile.exists()){
            if(oldResumeFile.exists())oldResumeFile.delete();

            currentResumeFile.renameTo(oldResumeFile);
            newResumeFile.renameTo(currentResumeFile);
        }

        byte[] fileData1 = FileCopyUtils.copyToByteArray(theResumeFile);
        System.out.printf("its this big: %d bytes\n", fileData1.length);

        fileLock.writeLock().lock();
        fileData2 = fileData1;
        fileLock.writeLock().unlock();

        System.out.println("updated global file data");

    }

    public static byte[] getResumeFileData() {
        byte[] data;
        try {
            fileLock.readLock().lockInterruptibly();
            data = fileData2;
            fileLock.readLock().unlock();

            return data;
        } catch (InterruptedException ignored) {}

        return null;
    }

    public static void startUpdaterThread() {
        new Thread(() -> {
            while(true){
                try {
                    ResumeService.updateResume();
                    Thread.sleep(RESUME_RELOAD_DELAY);
                } catch (InterruptedException ignored) {
                }catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }).start();
    }
}
