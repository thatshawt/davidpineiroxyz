package me.davidpineiro.davidpineiroxyz.controller;

//import me.davidpineiro.davidpineiroxyz.repository.PostRepository;
//import me.davidpineiro.davidpineiroxyz.services.PostService;
import me.davidpineiro.davidpineiroxyz.services.ResumeUpdater;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;

@Controller
public class MainRouter {

    //@Autowired
    //PostService postService;

    @GetMapping("/")
    public String index(Model model){
        return "index";
    }

    @GetMapping("/projects")
    public String projects(Model model){
        return "projects";
    }

    @GetMapping("/projects/vm")
    public String vmProject(Model model){
        return "vmProject";
    }

    @GetMapping("/projects/crud")
    public String crudProject(Model model){
        return "crudTest";
    }

    @GetMapping("/projects/backendproject1")
    public String backendproject1(){return "backendproject1";}

    @GetMapping("/nf")
    public String nonFiction(Model model){
        return "poetic_nonfiction";
    }

    // @GetMapping("/posts")
    // public String posts(Model model){
    //     model.addAttribute("posts", postService.getAllPosts());

    //     return "post_search";
    // }

    // @PostMapping("/posts")
    // public String postsFiltered(Model model, @RequestParam String keywordString){
    //     model.addAttribute("posts", postService.getPostsByKeywords(keywordString));

    //    return "post_search";
    //}

    @GetMapping(
            value = "/resume",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public @ResponseBody byte[] getResume() throws IOException {
        final byte[] resumeFile = ResumeUpdater.getResumeFileData();
        return resumeFile;
    }

}
