import React, { Component } from "react";
import { toggleTodo, fetchTodos, createTodo } from "./api";
import { toUnicode } from "punycode";

// TODO, update user interface to look nicer and allow ability to create todo and toggle todo

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      fetching: false,
      data: [],
      error: false 
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
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

  handleChange(event) {
    //this.setState({value: event.target.value});
    // var joined = this.state.data.concat(event.target.value);
    // this.setState({ data: joined })
    let newToDo = event.target.value;
    createTodo(newToDo);
    console.log(newToDo)
  }
  
  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    

    const todos = this.state.data.map((todo, i) => {
        return (todo.name)
    })
    console.log(todos)

   let ulStyles = {
     listStyle: 'none',
     backgroundColor: 'grey',
     margin: '0',
     padding: '0'
   }

   let liStyles = {
     border: '1px solid grey',
     backgroundColor: '#9A9E98',
     fontSize: '30px',
     padding: '.5em'
   }

   let buttonStyles = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer'
   }

    return (
      <div>
        {/* <pre>{JSON.stringify(this.state, null, 4)}</pre> */}
        <h2>TODO LIST</h2>
        <ul style={ulStyles}>
              {todos.map(function(todo, i){
                    return <li style={liStyles} key={i}>{todo}</li>;
                  })}
        </ul>
        <button style={buttonStyles} onClick={this.fetchData}>Fetch ToDos list</button>

        <form onSubmit={this.handleSubmit}>
          <label>
            Add todo:
            <input type="text" value={this.state.value} onChange={this.handleChange}/> 
          </label>
          <input style={buttonStyles} type="submit" value="Submit" />
      </form>
      </div>
    );
  }
}

export default App;
