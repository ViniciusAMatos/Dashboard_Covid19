package uema.pw.dash.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uema.pw.dash.model.States;
import uema.pw.dash.repository.StateRepository;

@Service
public class StateService {

  @Autowired
  StateRepository stateRepository;

  public List<States> getAllStates() {
    List<States> states = new ArrayList<States>();
    stateRepository.findAll().forEach(state -> states.add(state));
    return states;
  }
}
