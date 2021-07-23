package uema.pw.dash.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import uema.pw.dash.model.HistoricCovid;
import uema.pw.dash.services.HistoricCovidService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class HistoricCovidController {

  @Autowired
  HistoricCovidService historicCovidService;

  @GetMapping("historic")
  private List<HistoricCovid> getAllStates() {
    return historicCovidService.getAllHistoric();
  }

}