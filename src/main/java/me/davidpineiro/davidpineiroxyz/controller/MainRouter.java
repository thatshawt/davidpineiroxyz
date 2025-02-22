package me.davidpineiro.davidpineiroxyz.controller;

import me.davidpineiro.davidpineiroxyz.services.ResumeUpdater;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;

@Controller
public class MainRouter {

    @GetMapping("/")
    public String index(Model model){return "index";}

    @GetMapping("/projects") public String projects(Model model){
        return "projects";
    }

    @GetMapping("/projects/vm") public String vmProject(Model model){
        return "vmProject";
    }

    @GetMapping("/projects/crud") public String crudProject(Model model){
        return "crudTest";
    }

    @GetMapping("/nf") public String nonFiction(Model model){ return "poetic_nonfiction";}

    @GetMapping(
            value = "/resume",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public @ResponseBody byte[] getResume() throws IOException {
        final byte[] resumeFile = ResumeUpdater.getResumeFileData();

//        System.out.printf("resume file size: %d byttes\n", resumeFile.length);

        return resumeFile;
    }

}
