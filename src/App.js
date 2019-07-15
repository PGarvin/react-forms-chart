import React from 'react';
import logo from './logo.svg';
import './App.css';
import domtoimage from 'dom-to-image';

const condensed = text => {
  return text.split(" ").join("");
}

const cleanNumber = value => {
  return Number(value.split('$').join('').split(',').join('').split('%').join(''));
}

const rowObject = text => {
  let assets = text.split('\t');
  return {"Name":assets[0], "Value":cleanNumber(assets[1])};
}

const makeArray = input => {
  const rows = input.split("\n");
  const rowArray = [];
  
  for (let i=0; i<rows.length; i+=1) {
    if (rows[i].indexOf("\t") !== -1) {
      rowArray.push(rowObject(rows[i]));
    }
  }
  return rowArray;
}

const cleanArray = array => {
  const finalArray = [];
  for (let i=0; i<array.length; i+=1) {
    let nameCondensed = condensed(array[i].Name);
    if (isNaN(Number(array[i].Value)) === false && array[i].Name) {
      finalArray.push(array[i]);
    }
  }
  return finalArray;
}


class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.',
      data: '',
      usable: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    let input = this.state.value;
    let initialArray = makeArray(input);
    let data = cleanArray(initialArray);
    console.log(data);
    

    if (data.length >= 2) {
    this.setState({
      usable:true 
    }) 
    } 
    
    event.preventDefault();
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <h1>The data is {this.state.usable ? 'usable' : 'unusable'}</h1>
          <textarea id="form-input" rows="10" cols="50" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" id="funkyButton"/>
      </form>
    );
  }
}

function App() {

  return (
  <div>
  <EssayForm />
  <div id="chart">
  </div>
  </div>
  );
}

export default App;