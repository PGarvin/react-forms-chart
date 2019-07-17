import React from "react";
import logo from "./logo.svg";
import "./App.css";
import domtoimage from "dom-to-image";

const condensed = text => {
  return text.split(" ").join("");
};

const cleanNumber = value => {
  return Number(
    value
      .split("$")
      .join("")
      .split(",")
      .join("")
      .split("%")
      .join("")
  );
};

const rowObject = text => {
  let assets = text.split("\t");
  return { Name: assets[0], Value: cleanNumber(assets[1]) };
};

const makeArray = input => {
  const rows = input.split("\n");
  const rowArray = [];

  for (let i = 0; i < rows.length; i += 1) {
    if (rows[i].indexOf("\t") !== -1) {
      rowArray.push(rowObject(rows[i]));
    }
  }
  return rowArray;
};

const cleanArray = array => {
  const finalArray = [];
  for (let i = 0; i < array.length; i += 1) {
    let nameCondensed = condensed(array[i].Name);
    if (isNaN(Number(array[i].Value)) === false && array[i].Name) {
      finalArray.push(array[i]);
    }
  }
  return finalArray;
};

const numbersWithCommas = x => {
  return x;
};

const percent = (number, largest) => {
  return (60 * number) / largest;
};

const Bar = ({ name, number, largest }) => {
  return (
    <div className="row">
      <div className="Name">{name}</div>
      <div className="Value" style={{ width: percent(number, largest) + "%" }}>
        <span></span>
      </div>
      <div className="ValueNumber">{numbersWithCommas(number)}</div>
    </div>
  );
};

class BarChart extends React.Component {
  render() {
    const { bars, largest } = this.props;
    return (
      <div className="chartHolder">
        <div className="horizontalBarChart" id="chart">
          {bars.map((bar, i) => (
            <Bar key={i} name={bar.Name} number={bar.Value} largest={largest} />
          ))}
        </div>
      </div>
    );
  }
}

class Headline extends React.Component {
  render() {
    const { text } = this.props;
    return <h1>{text}</h1>;
  }
}

class ChartHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "Please write an essay about your favorite DOM element.",
      data: [],
      unusable: false,
      largest: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    let unusability;
    let largest_number = "";
    let input = this.state.value;
    let initialArray = makeArray(input);
    let data = cleanArray(initialArray);
    let valueArray = data.map(function(datum) {
      return Number(datum.Value);
    });
    console.log(valueArray);

    if (data.length >= 2) {
      this.setState({
        unusable: false,
        largest: Math.max.apply(Math, valueArray),
        data: data
      });

      domtoimage
        .toJpeg(document.getElementById("chart"), { quality: 0.95 })
        .then(function(dataUrl) {
          var link = document.createElement("a");
          link.download = "my-image-name.jpeg";
          link.href = dataUrl;
          link.click();
        });
    } else {
      this.setState({
        unusable: true,
        largest: "",
        data: data
      });
    }

    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form className="form-holder" onSubmit={this.handleSubmit}>
          <h1>{this.state.unusable ? "The data is unusable" : ""}</h1>
          <div className="label-input">
            <div className="label">Headline:</div>
            <input
              className="text-input"
              type="input"
              defaultValue="Headline goes here."
              id="headline"
            />
          </div>
          <div className="label-input">
            <div className="label">Intro text:</div>
            <input
              className="text-input"
              type="input"
              defaultValue="This is great intro text."
              id="headline"
            />
          </div>
          <textarea
            className="form-input"
            rows="10"
            cols="80"
            defaultValue={this.state.value}
            onChange={this.handleChange}
          />

          <input type="submit" defaultValue="Submit" id="submitButton" />
        </form>
        <div>
          {this.state.unusable ? (
            ""
          ) : (
            <BarChart bars={this.state.data} largest={this.state.largest} />
          )}
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <ChartHolder />
    </div>
  );
}

export default App;
