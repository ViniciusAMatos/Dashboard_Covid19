package uema.pw.dash.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import uema.pw.dash.model.States;
import uema.pw.dash.services.StateService;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class StateController {

  @Autowired
  StateService stateService;

  @GetMapping("states")
  private List<States> getAllStates() {
    return stateService.getAllStates();
  }

  @GetMapping("/states/{state}")
  private States getCountry(@PathVariable("state") String state) {
    for (States states : getAllStates()) {
      if (states.getState().equals(state)) {
        return states;
      }
    }
    return null;
  }

}