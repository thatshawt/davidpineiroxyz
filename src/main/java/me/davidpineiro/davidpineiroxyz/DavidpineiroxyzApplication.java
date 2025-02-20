package me.davidpineiro.davidpineiroxyz;

import com.sun.jna.Library;
import com.sun.jna.Native;
import me.davidpineiro.davidpineiroxyz.services.ResumeUpdater;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Arrays;

@SpringBootApplication
public class DavidpineiroxyzApplication {

	//openbsd /usr/lib/libc.so.97.1
	//int	 pledge(const char *, const char *);
	//int	 unveil(const char *, const char *);
	interface Libc extends Library {
		int pledge(String promises, String execpromises);
		int unveil(String path, String permissions);
	}

	public static void main(String[] args) {

		final String PLEDGES = null;

		final String[][] UNVEIL_ARGUMENTS =
			{
				{"/root/realwebsite","rxw"},

				{"/usr/lib/libc.so.97.1","rx"},

				{"/usr/local/jdk-17/lib","rx"},

				{"/tmp", "rwc"},

				{null, null}
			};

		if(System.getProperty("os.name").equalsIgnoreCase("openbsd")){
			System.out.println("detected OpenBSD.");
			final Libc libc = Native.load("/usr/lib/libc.so.97.1", Libc.class);
			System.out.println("loaded libc.");
			if(PLEDGES != null){
				if(libc.pledge(PLEDGES, null) == -1){
					System.err.printf("failed to pledge! %s\n", PLEDGES);
					return;
				}
				System.out.printf("pledged sucessfully: %s\n", PLEDGES);
			}

			if(UNVEIL_ARGUMENTS != null){
				for(String[] unveilArgs : UNVEIL_ARGUMENTS){
					final String path = unveilArgs[0];
					final String permissions = unveilArgs[1];
					if(libc.unveil(path, permissions) == -1){
						System.err.printf("failed to unveil! %s\n", Arrays.toString(unveilArgs));
						return;
					}
					System.out.printf("unveiled %s\n", Arrays.toString(unveilArgs));
				}
			}

		}

		System.out.println("starting server...");
		ResumeUpdater.startUpdaterThread();
		SpringApplication.run(DavidpineiroxyzApplication.class, args);
	}

}
