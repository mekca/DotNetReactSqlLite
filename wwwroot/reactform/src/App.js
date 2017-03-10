import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, FormGroup, Form, Col, ControlLabel, FormControl, Panel, Grid, Row, Table } from 'react-bootstrap';
import serializeForm from 'form-serialize';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData: []
    };

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._loadServiceAPIData = this._loadServiceAPIData.bind(this);
    this._load = this._loadServiceAPIData.bind(this);
  }

  componentDidMount() {
    this._loadServiceAPIData();
  }

  _loadServiceAPIData() {

    var self = this;
    fetch('/api/values')
      .then(function (response) {
        return response.json();
      }).then(function (responseData) {
        console.log("LoadServiceAPI: " + responseData);
        self.setState({ tableData: responseData });
      });
  }

  _handleFormSubmit(event) {
    event.preventDefault();

    self = this;
    let formData = serializeForm(event.target, { hash: true });
    console.log("HandleFormSubmit: " + JSON.stringify(formData));

    fetch('/api/values', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
      },
      mode: 'cors',
      body: JSON.stringify(formData)
    }).then(function (res) { 
      self._loadServiceAPIData(); //Reload the data
      console.log("End of Fetch: " +JSON.stringify(res)) 
    });
    
  }

  render() {

    //this._loadServiceAPIData();
    var dtSource = this.state.tableData;
    console.log("Render: "+dtSource);
    
    var rows = 
      Object.keys(dtSource).map(function (key) {
        return (<tr>
                  <td>{key}</td>
                  <td>{dtSource[key]["name"]}</td>
                  <td>{dtSource[key]["quantity"]}</td>
                  <td>{dtSource[key]["description"]}</td>
                </tr>);
      })



    const formInstance = (

      <Form horizontal onSubmit={this._handleFormSubmit}>

        <FormGroup controlId="formHorizontalItemName">
          <Col componentClass={ControlLabel} sm={2}>
            Name
      </Col>
          <Col sm={10}>
            <FormControl type="text" name="name" placeholder="Name" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalQuantity">
          <Col componentClass={ControlLabel} sm={2}>
            Quantity
          </Col>
          <Col sm={10}>
            <FormControl type="number" name="quantity" placeholder="Quantity" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalQuantity">
          <Col componentClass={ControlLabel} sm={2}>
            Description
          </Col>
          <Col sm={10}>
            <FormControl type="text" name="description" componentClass="textarea" placeholder="Description" />
          </Col>
        </FormGroup>


        <FormGroup>
          <Col smOffset={7} sm={8}>
            <Button type="submit">
              Add
        </Button>
          </Col>
        </FormGroup>

      </Form>

    );

    const tableInstance = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    );

    return (
      <div className="App">
        
        

        <Grid>
          <Row className="show-grid">
            <Col xs={6} md={2}></Col>
            <Col xs={6} md={8}>
              <Panel>
                {formInstance}
              </Panel>
            </Col>
          </Row>
        </Grid>

        
        {tableInstance}


      </div>
    );
  }
}

export default App;
