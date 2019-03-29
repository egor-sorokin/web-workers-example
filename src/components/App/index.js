import React, {Component} from 'react';
import axios from 'axios';
import WebWorker from '../../webWorkers/index';
import worker from '../../webWorkers/worker';
import {BASE_URL} from '../../constnats/index';
import VoiceAssistant from '../../components/VoiceAssistant/index';
import './style.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.cities = [
      'Stuttgart',
      'Berlin',
      'Bremen'
    ];
    this.recognition = {};
    this.worker = {};
    this.state = {
      count: 0,
      isItemsDisplayed: false,
      isSoundInput: false,
      isFetching: false,
      isTestRunning: false,
      fibResult: 0,
      item: {}
    }
  }

  /* ui interaction part */
  handleFetchData = () => {
    this.setState({
      isFetching: true
    });

    axios.get(BASE_URL)
      .then((res) => {
        const data = res.data.data;

        this.setState({
          item: data[Math.floor(Math.random() * data.length)]
        });
      })
      .catch((err) => {
        this.setState({
          fetchError: err.message
        });
      })
      .finally(() => {
        this.setState({
          isFetching: false,
          count: this.state.count + 1
        })
      });
  };


  toggleItemsVisibility = () => {
    this.setState({
      isItemsDisplayed: !this.state.isItemsDisplayed
    });
  };


  /* web worker part */
  _enableWebWorker() {
    if (window.Worker) {
      this.worker = new WebWorker(worker);

      this.worker.addEventListener('message', this._showFibResult); // listen message from worker.js
    }
  }


  _showFibResult = (event) => {
    const data = event.data;

    this.setState({
      fibResult: data.data.result,
      isFibCalculating: false
    });
  };


  toggleSoundStartLoader = (isSoundInput) => {
    this.setState({
      isSoundInput: isSoundInput
    });
  };


  handleFib = () => {
    this.setState({
      fibResult: 0,
      isFibCalculating: true
    });

    this.worker.postMessage({
      event: 'fibonacci'
    });
  };


  componentDidMount() {
    this._enableWebWorker();
  }


  componentWillUmnount() {
    this.worker.removeEventListener('message', this._showFibResult);
  }


  render() {
    let fetchedDataComponent;
    let recognitionDataComponent;
    let citiesComponent = this.cities.map((item, i) => (
      <li key={i}>
        <p>{item}</p>
      </li>
    ));

    if (this.state.isFetching) {
      fetchedDataComponent = (<div>Loading...</div>);
    } else {
      fetchedDataComponent = (<div>Fetched data: {this.state.item.name} - {this.state.item.unit}</div>)
    }

    if (this.state.isFibCalculating) {
      recognitionDataComponent = (<div>Loading...</div>)
    } else {
      recognitionDataComponent = (<div>Result: {this.state.fibResult}</div>)
    }


    return (
      <div className="app">
        <div className="app-item requests">
          <div>Amount of requests: {this.state.count}</div>
          {fetchedDataComponent}
          <div className="requests-buttons">
            <button
              onClick={this.handleFetchData}
              disabled={this.state.isFetching}
            >Request data
            </button>
            <button onClick={this.toggleItemsVisibility}>
              {this.state.isItemsDisplayed ? 'hide data' : 'show data'}
            </button>
          </div>
          <ul className="items"
              style={{display: this.state.isItemsDisplayed ? 'block' : 'none' }}>
            {citiesComponent}
          </ul>
        </div>

        <div className="app-item assistant">
          <VoiceAssistant
            toggleSoundStartLoader={this.toggleSoundStartLoader}
            handleFib={this.handleFib}
          >
            <div className="assistant-header">
              <div>Voice assistant is enabled</div>
              <div>Say 'Fibonacci' to count 25th number of Fibonacci</div>
            </div>
            <div className="assistant-main">
              {recognitionDataComponent}
            </div>
          </VoiceAssistant>
        </div>
      </div>
    );
  }
}

export default App;
