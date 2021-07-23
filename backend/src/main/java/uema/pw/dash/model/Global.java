package uema.pw.dash.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
// CRIA OS ATRIBUTOS E RECEBE OS VALORES ALOCANDO NAS VARIAVEIS
@Entity
@Table
public class Global {
  @Id
  @GeneratedValue
  @Column
  private int id;
  @Column
  private @JsonProperty("NewConfirmed") int newConfirmed;
  @Column
  private @JsonProperty("NewDeaths") int newDeaths;
  @Column
  private @JsonProperty("TotalDeaths") int totalDeaths;
  @Column
  private @JsonProperty("TotalConfirmed") int totalConfirmed;
  @Column
  private @JsonProperty("NewRecovered") int newRecovered;
  @Column
  private @JsonProperty("TotalRecovered") int totalRecovered;
  @Column
  private @JsonProperty("Date") String data;

  public int getNewConfirmed() {
    return newConfirmed;
  }

  public void setNewConfirmed(int newConfirmed) {
    this.newConfirmed = newConfirmed;
  }

  public int getNewDeaths() {
    return newDeaths;
  }

  public void setNewDeaths(int newDeaths) {
    this.newDeaths = newDeaths;
  }

  public int getTotalDeaths() {
    return totalDeaths;
  }

  public void setTotalDeaths(int totalDeaths) {
    this.totalDeaths = totalDeaths;
  }

  public int getTotalConfirmed() {
    return totalConfirmed;
  }

  public void setTotalConfirmed(int totalConfirmed) {
    this.totalConfirmed = totalConfirmed;
  }

  public int getNewRecovered() {
    return newRecovered;
  }

  public void setNewRecovered(int newRecovered) {
    this.newRecovered = newRecovered;
  }

  public int getTotalRecovered() {
    return totalRecovered;
  }

  public void setTotalRecovered(int totalRecovered) {
    this.totalRecovered = totalRecovered;
  }

  public String getDate() {
    return data;
  }

  public void setDate(String date) {
    this.data = date;
  }

}
