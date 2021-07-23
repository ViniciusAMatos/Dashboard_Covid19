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
public class Countries {

  @Id
  @Column
  private @JsonProperty("ID") String id;
  @Column
  private @JsonProperty("Country") String country;
  @Column
  private @JsonProperty("CountryCode") String countryCode;
  @Column
  private @JsonProperty("Slug") String slug;
  @Column
  private @JsonProperty("NewConfirmed") int newConfirmed;
  @Column
  private @JsonProperty("TotalConfirmed") int totalConfirmed;
  @Column
  private @JsonProperty("NewDeaths") int newDeaths;
  @Column
  private @JsonProperty("TotalDeaths") int totalDeaths;
  @Column
  private @JsonProperty("NewRecovered") int newRecovered;
  @Column
  private @JsonProperty("TotalRecovered") int totalRecovered;
  @Column
  private @JsonProperty("Date") String data;

  public String getCountry() {
    return country;
  }

  public String getCountryCode() {
    return countryCode;
  }

  public String getDate() {
    return data;
  }

  public String getId() {
    return id;
  }

  public int getNewConfirmed() {
    return newConfirmed;
  }

  public int getNewDeaths() {
    return newDeaths;
  }

  public int getNewRecovered() {
    return newRecovered;
  }

  public String getSlug() {
    return slug;
  }

  public int getTotalConfirmed() {
    return totalConfirmed;
  }

  public int getTotalDeaths() {
    return totalDeaths;
  }

  public int getTotalRecovered() {
    return totalRecovered;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public void setCountryCode(String countryCode) {
    this.countryCode = countryCode;
  }

  public void setDate(String date) {
    this.data = date;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setNewConfirmed(int newConfirmed) {
    this.newConfirmed = newConfirmed;
  }

  public void setNewDeaths(int newDeaths) {
    this.newDeaths = newDeaths;
  }

  public void setNewRecovered(int newRecovered) {
    this.newRecovered = newRecovered;
  }

  public void setSlug(String slug) {
    this.slug = slug;
  }

  public void setTotalConfirmed(int totalConfirmed) {
    this.totalConfirmed = totalConfirmed;
  }

  public void setTotalDeaths(int totalDeaths) {
    this.totalDeaths = totalDeaths;
  }

  public void setTotalRecovered(int totalRecovered) {
    this.totalRecovered = totalRecovered;
  }

}
