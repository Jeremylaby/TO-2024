package pl.agh.droptable.multiplex.controller;

import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Transactional
@RequestMapping("api/seans")
public class SeansController {

}
