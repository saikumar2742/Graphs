import React, { Component } from 'react';
import './App.css';
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import csvjson from 'csvjson'
import {ProgressBar} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import {barChart} from './graphs'

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

class App extends Component {
  constructor(){
    super()
    this.state = {
      data: [],
      fileNames: [],
      now: 0
    }
  }
  onDrop=(files)=> {
    files.forEach(file => {
      const reader = new FileReader()
      let fileName = file.name
      reader.onload = () => {
        var jsonArray = csvjson.toObject(reader.result, {});
        this.setState((prevState, props)=>{
          prevState.fileNames.push(fileName);
          return {
            data: prevState.data.concat(jsonArray),
            fileNames: prevState.fileNames
          }
        })
      }
      reader.readAsBinaryString(file);
    });
    for (let i=20; i<=100; i+=20){
      this.setState({
        now: i
      })
    }
  }
  getColumns=()=>{
    let keys = Object.keys(this.state.data[0]);
    let columns = []
    for(let i=0; i<keys.length; i++){
      let temp = {}
      temp.dataField = keys[i]
      temp.text = keys[i].charAt(0).toUpperCase() + keys[i].slice(1);
      temp.sort = true;
      columns.push(temp);
    }
    this.setState({
      columns,
      fields: keys
    })
  }
  onSubmit=()=>{
    this.setState({
      isSubmit: true
    })
    this.getColumns();
  }
  selectFields=(e)=>{
    if(e.target.value){
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }
  viewChart=(e)=>{
    let chartType = e.target.value;
    let {xaxis, yaxis} = this.state;
    if(xaxis && yaxis && chartType){  
      this.setState({
        isGraphVisible: true
      }, () => {
        barChart(xaxis, yaxis, this.state.data);
      })
    }else{
      alert("Select Both X-Axis and Y-Axis")
    }
  }
  render() {
    return (
      <div className="App">
      {!this.state.isSubmit?
        <div>
          <Dropzone
                onDrop={this.onDrop}
              >
                {({ getRootProps, getInputProps, isDragActive }) => {
                  return (
                    <div
                      {...getRootProps()}
                      className={classNames('dropzone', 'custom-dropzone', { 'dropzone--isActive': isDragActive })}
                    >
                      <input {...getInputProps()} />
                      {
                        isDragActive ?
                          <p>Drop files here...</p> :
                          <div>
                            <p>Drap & Drop</p>
                            <p> or </p>
                            <p>Browse Files Here</p>
                          </div>
                      }
                    </div>
                  )
                }}
              </Dropzone>
          {this.state.now!=0?
            <ProgressBar variant="success" now={this.state.now} label={`${this.state.now}%`} />
          :null}
          {this.state.fileNames.map((e,i)=><div key={i}>{e}</div>)}
          {this.state.now==100?
            <button onClick={this.onSubmit}>Submit</button>
            :null
          }
        </div>
      :
        <div className="table-graph">
          <BootstrapTable 
            keyField={this.state.fields[0]}
            data={this.state.data} 
            columns={this.state.columns}
            striped
            hover
            // pagination={ paginationFactory() }
          />
          <div>
            {!this.state.isGraphVisible?
              <div>
                <select onChange={this.selectFields} name="xaxis">
                  <option value="">
                      X-Axis
                  </option>
                  {this.state.fields.map(e=>
                    <option value={e}>{e}</option>
                  )}
                </select>
                <select onChange={this.selectFields} name="yaxis">
                  <option value="">
                    Y-Axis
                  </option>
                  {this.state.fields.map(e=>
                    <option value={e}>{e}</option>
                  )}
                </select>
                <select onChange={this.viewChart}>
                  <option value="">
                    Chart Type
                  </option>
                  <option value="bar">
                    Bar Chart
                  </option>
              </select>
              </div>
            :
              <div id="container"></div>
            }

            {JSON.stringify(this.state.fields)}
          </div>
        </div>
      }
            
      </div>
    );
  }
}

export default App;
