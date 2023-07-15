import { useRef, useState } from "react";
import "./css/Todo.css";
import { v4 as uuidv4 } from "uuid";
import "./css/others.css";
import axios from "axios";

export default function Todo(props) {
  const [newItem, setNewItem] = useState("");

  const [todos, setTodos] = useState([]);
  const [canloadrecent, setCanloadrecent] = useState(true);

  const inputRef = useRef(null);
  let username = props.user;

  function convertbool(x) {
    if (x == "true") return true;
    else return false;
  }

  const loadrecent = (e) => {
    e.preventDefault();
    setCanloadrecent(false);
    if (canloadrecent) {
      axios.post("https://example-host/onload", { username }).then((res) => {
        console.log(res.data);
        res.data.tasks.forEach((element, i) => {
          return setTodos((currentTodos) => {
            setNewItem("");

            return [
              ...currentTodos,
              {
                id: uuidv4(),
                title: element,
                completed: convertbool(res.data.completed[i]),
              },
            ];
          });
        });
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // if (todos.length >= 5) {
    //   alert("login to add more todos");
    //   return null;
    // }

    if (inputRef.current.value !== "")
      return setTodos((currentTodos) => {
        setNewItem("");

        return [
          ...currentTodos,
          { id: uuidv4(), title: newItem, completed: false },
        ];
      });
  };

  function toggleTodo(id, completed) {
    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed };
        }

        return todo;
      });
    });
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => {
      return currentTodos.filter((todo) => todo.id != id);
    });
  }

  function onsave(e) {
    e.preventDefault();

    axios.post("https://example-host/delete", { username }).then((res) => {
      for (let i in todos) {
        let description = todos[i].title;
        let completed = todos[i].completed;
        axios
          .post("https://example-host/save-todos", {
            username,
            description,
            completed,
          })
          .then((res) => {
            console.log(res.data);
          });
      }
      console.log(res.data);
    });
  }

  return (
    <>
      <div className="todo-btns">
        <button onClick={() => props.onclick("sign-in")} className="logout-btn">
          Log Out
        </button>
        <p>
          welcome back <span>@{props.user}</span>
        </p>
        <div className="todo-left-btns">
          <button onClick={onsave} className="save-btn">
            Save
          </button>
          <button onClick={loadrecent} className="load-btn">
            load recent
          </button>
        </div>
      </div>

      <div className="container">
        <div className="interaction">
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="item">New item</label>
            <input
              ref={inputRef}
              value={newItem}
              placeholder="Enter your Todo"
              onChange={(e) => setNewItem(e.target.value)}
              type="text"
              id="item"
            />
            <button className="btn">Add to list</button>
          </form>
        </div>
        <div className="list-div">
          <h1 className="heading">Todo List</h1>
          <ul className="list">
            {todos.length === 0 && "------No Todos Yet------"}
            {todos.map((todo) => {
              return (
                <li key={todo.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                    />
                    {todo.title}
                  </label>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
