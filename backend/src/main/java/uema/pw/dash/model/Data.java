package uema.pw.dash.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Data {
  private @JsonProperty("Countries") Countries[] countries;
  private @JsonProperty("Global") Global global;

  public Countries[] getCountries() {
    return countries;
  }

  public void setCountries(Countries[] countries) {
    this.countries = countries;
  }

  public Global getGlobal() {
    return global;
  }

  public void setGlobal(Global global) {
    this.global = global;
  }
}
