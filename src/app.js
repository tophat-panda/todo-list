import React, { Component } from "react";
import { toggleTodo, fetchTodos, createTodo } from "./api";

// TODO, update user interface to look nicer and allow ability to create todo and toggle todo

class App extends Component {
  state = { fetching: false, data: [], error: false };
  fetchData = () => {
    this.setState({ fetching: true, data: [], error: false });
    fetchTodos()
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
