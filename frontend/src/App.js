import React, { Component } from "react"
import Modal from "./components/Modal"; 
import axios from "axios";
import { Nav, NavItem, NavLink } from "reactstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class App extends Component {
    state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
      },
      todoList: []
    };

    async componentDidMount() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_IP}`);
        const todoList = await res.data;
        this.setState({
          todoList
        });
      } catch (e) {
        console.log(e);
    }
    }

    toggle = () => {
      this.setState({ modal: !this.state.modal });
    };
  
    //Responsible for saving the task
    handleSubmit = item => {
      this.toggle();
      if (item.id) {
        axios
          .put(`${process.env.REACT_APP_BACKEND_IP}${item.id}/`, item)
        return;  
      }
      axios
        .post(`${process.env.REACT_APP_BACKEND_IP}`, item)
    };

    createItem = () => {
      const item = {title: "", description: "", completed: false };
      this.setState({ activeItem: item, modal: !this.state.modal });
    };

    displayCompleted = status => {
      if (status) {
        return this.setState({ viewCompleted: true});
      }
      return this.setState({ viewCompleted: false});
    };

    renderTabList = () => {
      return (
        <div className="my-5 tab-list">
          <Nav tabs>
            <NavItem>
              <NavLink onClick={() => this.displayCompleted(true)} className={this.state.viewCompleted ? "active" : ""}>
                Completos
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => this.displayCompleted(false)} className={this.state.viewCompleted ? "" : "active"}>
                Incompletos
              </NavLink>
            </NavItem>
          </Nav>
        </div>  
      );
    };

    renderItems = () => {
      this.componentDidMount()
      const { viewCompleted } = this.state;
      const newItems = this.state.todoList.filter(
        item => item.completed === viewCompleted
      );
      return newItems.map(item => (
        <li 
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span 
            className={`todo-title mr-2 ${
              this.state.viewCompleted ? "completed-todo" : ""
            }`}
            title={item.description}
            >
              {item.title}
            </span>
        </li>
      ));
    };

    render() {
      return (
        <main className="content">
        <h1 className="text-white text-uppercase text-center my-4">Todo App</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-success">Add Task <FontAwesomeIcon icon={faPlus} /></button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ): null}
      </main>
      )
    }
  }
  
export default App;