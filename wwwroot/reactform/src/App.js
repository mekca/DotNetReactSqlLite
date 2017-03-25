import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, FormGroup, Form, Col, ControlLabel, FormControl, Panel, Grid, Row, Table } from 'react-bootstrap';
import serializeForm from 'form-serialize';

import update from 'react-addons-update';
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter }
  from 'react-modal-bootstrap';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      editMode: false,
      editFields: [],
      falseData: [],
      isOpen: false
    };


    //declares binds for the class but becarful it might not be viewable by render section 
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._loadServiceAPIData = this._loadServiceAPIData.bind(this);
    //this._loadEdit = this._loadEdit.bind(this);
    this._editItem = this._editItem.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this.openModal = this.openModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  openModal() {
    this.setState({
      isOpen: true
    });
  };

  hideModal() {
    this.setState({
      isOpen: false
    });
  };

  componentDidMount() {
    this._loadServiceAPIData(); // loads db info on page load 
  }


  _loadServiceAPIData() {
    //loads db info by "fetch" info by /api/values/ - retuns info and formats to be loaded in to a "tableDatat" - see below
    var self = this;
    fetch('/api/values').then(function (response) {
      return response.json();
    }).then(function (responseData) {
      console.log("LoadServiceAPI: " + responseData);
      self.setState({ tableData: responseData });
    });
  }


  _handleDelete(event) {
    event.preventDefault(); //preventdefault if no match

    var self = this; // declares self and this as the same / keeps its origin 
    const InventoryId = event.target.value;
    //the event/property(button in this case)/ value of the element values/attributes 

    fetch('/api/values/' + InventoryId, {
      method: 'delete',
      mode: 'cors'
    }).then(function (response) { self._loadServiceAPIData() });
    //after delete occurs, the db info is loaded on page again. 
  }


  /*_loadEdit(event) {
    event.preventDefault();
    var self = this;
    const inventoryId = event.target.value;
    console.log("Edit Inventory Id: " + inventoryId);

    //fetch('/api/values/').then(function ())
    fetch('/api/values/' + inventoryId, {
      method: 'get',
      mode: 'cors'
    }).then(function (response) {
      return response.json();
    }).then(function (responseData) {
      console.log("Response: " + JSON.stringify(responseData));

      self.setState({ editMode: true, editFields: responseData });
    });
  }*/


  _editItem(event) {
    event.preventDefault();

    self = this;
    const inventoryId = event.target.value;

    console.log("Edit Inventory Id: " + inventoryId);

    fetch('/api/values/' + inventoryId, {
      method: 'get',
      mode: 'cors'
    }).then(function (response) {
      return response.json();
    }).then(function (responseData) {
      console.log('Data for editItem received.');
      self.setState({ editMode: true, editFields: responseData, isOpen: true });
    });

    /*var value = event.target.value;
    alert('Edit Inventory Id ' + value);*/
  }


  _handleChange(event) {
    self = this;

    const elementName = event.target.name;
    const elementValue = event.target.value;

    console.log(elementName + ":" + elementValue);

    self.setState({
      falseData: [],
      editFields: update(self.state.editFields, { 1: { elementName: { $set: elementValue } } })
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
      console.log("End of Fetch: " + JSON.stringify(res))

      self.setState({ editMode: false, isOpen: false });
    });

  }

  render() {

    //this._loadServiceAPIData();

    var output = (<div></div>);
    const dtSource = this.state.tableData;
    const dtRecordData = this.state.editFields;
    var editForm = (<div></div>);

    //console.log("Render: " + dtSource);
    //var self = this;
    self = this;

    if (self.state.editMode) {
      Object.keys(dtRecordData).map(function (key) {
        editForm =
          (
            <div>

              <FormGroup controlId="formHorizontalItemName">
                <Col componentClass={ControlLabel} sm={2}>
                  ID:
              </Col>

                <Col sm={10}>
                  <FormControl type="text" value={dtRecordData[key]["inventoryId"]} name="inventoryId" />
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalName">
                <Col componentClass={ControlLabel} sm={2}>
                  Name
              </Col>

                <Col sm={10}>
                  <FormControl type="text" value={dtRecordData[key]["name"]} name="name" onChange={self._handleChange} />
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalQuantity">
                <Col componentClass={ControlLabel} sm={2}>
                  Quantity
                </Col>

                <Col sm={10}>
                  <FormControl type="number" value={dtRecordData[key]["quantity"]} name="quantity" onChange={self._handleChange} />
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalQuantity">
                <Col componentClass={ControlLabel} sm={2}>
                  Description
                  </Col>

                <Col sm={10}>
                  <FormControl type="text" value={dtRecordData[key]["description"]} name="description" componentClass="textarea" onChange={self._handleChange} />
                </Col>
              </FormGroup>

            </div>
          )
      });

      output = (
        <div className='layout-page'>
          <main className='layout-main'>
            <div className='container'>

              <Modal isOpen={this.state.isOpen} size='modal-lg' onRequestHide={this.hideModal}>
                <Form Horizontal onSubmit={self._handleFormSubmit}>
                  <ModalHeader>
                    <ModalClose onClick={this.hideModal} />
                    <ModalTitle>Modal title</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    <span>
                      {editForm}
                    </span>
                  </ModalBody>
                  <ModalFooter>
                    <button className='btn btn-default' onClick={this.hideModal}>
                      Close
              </button>
                    <button className='btn btn-primary'>
                      Save Changes
              </button>
                  </ModalFooter>
                </Form>
              </Modal>
            </div>
          </main>
        </div>);
    } else {

      /*var editForm =
        Object.keys(dtRecordData).map(function (key) {
          return (
            <Form horizontal onSubmit={self._handleFormSubmit}>
  
                    <FormGroup controlId="formHorizontalItemName">
                      <Col sm={10}>
                        <FormControl type="hidden" name="InventoryId" value={dtRecordData[key]["inventoryId"]} onChange={self._handleChange} />
                      </Col>
                    </FormGroup>
  
                    <FormGroup controlId="formHorizontalItemName" >
                      <Col componentClass={ControlLabel} sm={2} >
                        Name
              </Col>
                      <Col sm={10}>
                        <FormControl type="text" name="Name" placeholder="Name" value={dtRecordData[key]["name"]} onChange={self._handleChange} />
                      </Col>
                    </FormGroup>
  
                    <FormGroup controlId="formHorizontalQuantity">
                      <Col componentClass={ControlLabel} sm={2}>
                        Quantity
            </Col>
                      <Col sm={10}>
                        <FormControl type="text" name="Quantity" placeholder="Quantity" value={dtRecordData[key]["quantity"]} onChange={self._handleChange} />
                      </Col>
                    </FormGroup>
  
                    <FormGroup>
                      <Col smOffset={7} sm={8}>
                        <Button type="submit">
                          Update
                </Button>
                      </Col>
                    </FormGroup>
  
                  </Form>);
        });
  
      if (self.state.editMode == false) {
                    output = (
                      <div className="App">
                        <Grid>
                          <Row className="show-grid">
                            <Col xs={6} md={2}> </Col>
                            <Col xs={6} md={8}>
                              <Panel>
                                {formInstance}
                              </Panel>
                            </Col>
                          </Row>
                        </Grid>
                        {tableInstance}
                      </div>
                    );*/

      // } else {
      // output = (
      //   <div> {editForm}</div>
      // );

      const dtSource = this.state.tableData;
      console.log("Render: " + dtSource);

      const self = this;

      const rows =
        Object.keys(dtSource).map(function (key) {  //dtSource [key] identifies where source data is being referenced 
          return (<tr>
            <td>Key: {key}</td>
            <td>{dtSource[key]["name"]}</td>
            <td>{dtSource[key]["quantity"]}</td>
            <td>{dtSource[key]["description"]}</td>
            <td>

              <button type="submit" value={dtSource[key]["inventoryId"]} onClick={self._handleDelete} > Delete </button>
              <button type="submit" value={dtSource[key]["inventoryId"]} onClick={self._editItem} > Edit </button>
            </td>
          </tr>);
        });


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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      );

      output = (
        <div className="App">
          <Grid>
            <Row className="show-grid" >
              <Col xs={6} md={2}> </Col>
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

    let subModalDialogStyles = {
      base: {
        bottom: -600,
        transition: 'bottom 0.4s'
      },
      open: {
        bottom: 0
      }
    };

    return (
      <div>
        {output}
      </div>
    );
  }
}

export default App;