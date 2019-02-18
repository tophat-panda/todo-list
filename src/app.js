import React, { Component } from "react";
import Axios from "axios";

class App extends Component {
  state = { fetching: false, data: [], error: false };
  fetchData = () => {
    this.setState({ fetching: true, data: [], error: false });
    Axios.get("/.netlify/functions/todos")
      .then(response => {
        this.setState({ fetching: false, data: response.data });
      })
      .catch(error => {
        this.setState({ fetching: false, error });
      });
  };
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 4)}</pre>
        <button onClick={this.fetchData}>Fetch</button>
      </div>
    );
  }
}

export default App;
