package uema.pw.dash.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table
public class HistoricCovid {
  @Id
  @Column
  private @JsonProperty("Date") String date;
  @Column
  private @JsonProperty("Confirmed") int confirmed;
  @Column
  private @JsonProperty("Deaths") int deaths;
  @Column
  private @JsonProperty("Recovered") int recovered;
  @Column
  private @JsonProperty("Active") int active;

  public int getConfirmed() {
    return confirmed;
  }

  public void setConfirmed(int confirmed) {
    this.confirmed = confirmed;
  }

  public int getDeaths() {
    return deaths;
  }

  public void setDeaths(int deaths) {
    this.deaths = deaths;
  }

  public int getRecovered() {
    return recovered;
  }

  public void setRecovered(int recovered) {
    this.recovered = recovered;
  }

  public int getActive() {
    return active;
  }

  public void setActive(int active) {
    this.active = active;
  }

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
  }

}
