package uema.pw.dash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import uema.pw.dash.model.Global;
import uema.pw.dash.services.*;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class GlobalController {

  @Autowired
  GlobalService globalService;

  @GetMapping("global")
  private Iterable<Global> getAllgetAllGlobal() {
    return globalService.getAllGlobal();
  }

}
