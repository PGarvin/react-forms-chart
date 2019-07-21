import React from "react";
import { Map } from "./Map";
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
  finalArray.sort(function(a, b) {
    var aConcat = Number(a["Value"]);
    var bConcat = Number(b["Value"]);

    if (aConcat < bConcat) {
      return 1;
    } else if (aConcat > bConcat) {
      return -1;
    } else {
      return 0;
    }
  });
  return finalArray;
};

const numbersWithCommas = x => {
  return x;
};

const percent = (number, largest, percentage) => {
  return (percentage * number) / largest;
};

const Bar = ({ name, number, largest }) => {
  return (
    <div className="row">
      <div className="Name">{name}</div>
      <div
        className="Value"
        style={{ width: percent(number, largest, 60) + "%" }}
      >
        <span style={{ opacity: percent(number, largest, 1) }}></span>
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
        <div className="horizontalBarChart">
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
    const { headlineText } = this.props;
    return <h2>{headlineText}</h2>;
  }
}

class Intro extends React.Component {
  render() {
    const { intro } = this.props;
    return <h4>{intro}</h4>;
  }
}

class ChartHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      data: [],
      unusable: false,
      largest: "",
      headline: "This is a great headline",
      intro: "This is great introductory text!"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleHeadline = this.handleHeadline.bind(this);
    this.handleIntro = this.handleIntro.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleHeadline(e) {
    this.setState({ headline: e.target.value });
  }

  handleIntro(e) {
    this.setState({ intro: e.target.value });
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


    if (data.length >= 2) {
      this.setState({
        unusable: false,
        largest: Math.max.apply(Math, valueArray),
        data: data
      });

      const states = document.querySelectorAll(".state");
      const statesData = Object.keys(data).map(function(key) {
        return data[key];
      });


      for (let i = 0; i < statesData.length; i += 1) {
        //console.log(statesData[i].Name);
        for (let j = 0; j < states.length; j += 1) {
          if (
            states[j].classList.contains(
              condensed(statesData[i].Name).toLowerCase()
            )
          ) {
            let opacity = percent(
              statesData[i].Value,
              Math.max.apply(Math, valueArray),
              1
            );
            states[j].style.fill = `rgba(88,136,158,${opacity})`;
            states[j].style.stroke = "rgba(88,136,158,1)";
          }
        }
      }

      domtoimage
        .toJpeg(document.getElementById("chart"), { quality: 0.95 })
        .then(function(dataUrl) {
          var link = document.createElement("a");
          link.download = "map-chart.jpeg";
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
          <h1>Use this form to make a map and chart of US data</h1>
          <h6>
            This data generates a JPEG of a map and bar chart showing how US
            states compare with one another. To try this out, paste data from an
            Excel spreadsheet, a Google Sheets document, or a CSV. When you
            click on the "Submit" button, this code will evaluate if the data is
            usable. If it is, it will automatically begin downloading a
            600px-wide chart for you to use on your website, newsletter,
            document, etc. If the data you pasted doesn't work, you'll get a
            message.
          </h6>
          <h6>
            Not sure if you have data that works?{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/13EX9CJm0thaE5U8TCkWsSuQa4LIk6tQMrmpY4uvZNwg/edit?usp=sharing"
              target="_blank"
            >
              Check out this link to see examples of data that works.
            </a>
          </h6>
          <h6>Feel free to paste in that data to see how it works! </h6>
          <div className="label-input">
            <div className="label">Please type your headline here.</div>
            <input
              className="text-input"
              type="input"
              defaultValue="Headline goes here."
              id="headline"
              defaultValue={this.state.headline}
              onChange={this.handleHeadline}
            />
          </div>
          <div className="label-input">
            <div className="label">Please type your intro text here.</div>
            <input
              className="text-input"
              type="input"
              defaultValue="This is great intro text."
              id="intro"
              defaultValue={this.state.intro}
              onChange={this.handleIntro}
            />
          </div>
        <div className="label">Please paste your data here.</div>

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
            <div className="packageHolder">
              <h2>
                Sorry, this data is unusable. Please paste data from an Excel
                spreadsheet, a Google Sheets document, or a CSV.
              </h2>
            </div>
          ) : (
            <div className="packageHolder">
              <div className="chartHolder" id="chart">
                <Headline headlineText={this.state.headline} />
                <Intro intro={this.state.intro} />
                <Map />
                <BarChart bars={this.state.data} largest={this.state.largest} />
              </div>
            </div>
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
