package uema.pw.dash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import uema.pw.dash.model.Calc;
import uema.pw.dash.repository.CalcRepository;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class CalcController {
    @Autowired
  CalcRepository calcRepository;

  @GetMapping("calcs")
  private Iterable<Calc> getCalcs() {
    return calcRepository.findAll();
  }
}  