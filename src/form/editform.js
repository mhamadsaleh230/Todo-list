import React from 'react';
import './todoform.css';
import axios from 'axios';
import { Todaytodos } from '../todays list/todaytodos';

export default function Editform({ todo, onClose }) {
  const today = new Date().toISOString().split('T')[0];

  function formatDateLocal(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const formattedDate = todo.date ? formatDateLocal(todo.date) : today;
  
  function handleEdit(event) {
    event.preventDefault();

    const editedtodo = {
      todo: event.target.Todo.value,
      description: event.target.Description?.value ?? "",
      date: event.target.Date.value || todo.date || today,
      priority: event.target.Priority?.value || "Low",
      id: todo.id,
    };

    axios.put('http://localhost:8081/edittodo', editedtodo)
      .then(response => {
        console.log('Edited:', response.data);
        onClose();
        
      })
      .catch(error => {
        console.error('Error:', error);
      });


  }

  return (
    <div className="Form" style={{width:'100%', minWidth:'300px'}} >
      <div className='title'>
        <h3>Edit Todo</h3>
      </div>

      <form
        style={{ width: "100%", textAlign: "center", alignContent: "center" }}
        onSubmit={handleEdit}
      >
        <input
          type="text"
          autoComplete="off"
          placeholder="ToDo*"
          name="Todo"
          maxLength={50}
          required
          defaultValue={todo.todo}
        />

        <textarea
          placeholder="Description**"
          name="Description"
          defaultValue={todo.description}
        ></textarea>

        <input
          type="date"
          name="Date"
          defaultValue={formattedDate}
          min={today}
        />

        <div
          style={{
            margin: "5px",
            display: "grid",
            gridTemplateColumns: "1fr 4fr",
            width: '50%',
            marginInline: 'auto'
          }}
        >
          <label style={{ fontWeight: "bold" }}>Priority: </label>
          <select
            name="Priority"
            defaultValue={todo.priority || "Low"}
            style={{ width: "100%", borderRadius: "20px", border: "1px solid black" }}
          >
            <option style={{ color: "red" }} value="High">High</option>
            <option style={{ color: "blue" }} value="Medium">Medium</option>
            <option style={{ color: "green" }} value="Low">Low</option>
          </select>
        </div>

        <div style={{ marginTop: "10px" }}>
          <button className='addbutton' type="submit">save</button>
          <button
            type="button"
            onClick={onClose}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              borderRadius: '4px',
              backgroundColor: '#ccc',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
