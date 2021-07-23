
import React, { Component } from 'react';
import UserService from '../services/UserService';
import { Button } from 'reactstrap';
import { Table } from 'reactstrap';
import { MDBDataTable } from 'mdbreact';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';





class UserComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    UserService.getUsers().then((response) => {
      this.setState({ users: response.data })
    });
  }

  render() {


    return (

      <div style={{ backgroundColor: 'white' }}>



        <MDBTable scrollY striped small bordered hover variant="dark" className="w-75 p-3" style={{ 'marginLeft': '200px' }}>
          <MDBTableHead>
            <tr style={{ 'font-weight': '500', color: 'white', 'fontSize': '21px', backgroundColor: 'gray' }}>

              <td > País</td>
              <td> Novos Confirmados</td>
              <td> Novas Mortes</td>
              <td> Total Mortos</td>
              <td> Total Confirmados</td>
            </tr>

          </MDBTableHead>
          <MDBTableBody style={{ 'font-weight': '600', color: '#141414', 'fontSize': '17px' }}>
            {
              this.state.users.map(
                user =>
                  <tr key={user.ID}>
                    <td> {user.Country}</td>
                    <td> {user.NewConfirmed}</td>
                    <td> {user.NewDeaths}</td>
                    <td> {user.TotalDeaths}</td>
                    <td> {user.TotalConfirmed}</td>
                  </tr>
              )
            }

          </MDBTableBody>
        </MDBTable>



      </div>

    )
  }
}



export default UserComponent


