import './App.css';
import React, { useState, useEffect } from 'react';
import { Form } from "./form/todoform";
import { Todaytodos } from "./todays list/todaytodos";
import { Othertodos } from './othertodos/othertodos';
import axios from 'axios';

function App() {
  const [todayTodos, setTodayTodos] = useState([]);
  const [otherTodos, setOtherTodos] = useState([]);

  const fetchTodayTodos = async () => {
    try {
      const res = await axios.get('http://localhost:8081/todaytodos');
      setTodayTodos(res.data);
    } catch (error) {
      console.error("Error fetching today's todos", error);
    }
  };

  const fetchOtherTodos = async () => {
    try {
      const res = await axios.get('http://localhost:8081/othertodos');
      setOtherTodos(res.data);
    } catch (error) {
      console.error("Error fetching other todos", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTodayTodos();
    fetchOtherTodos();
  }, []);

  return (
    <div className="App">
      <header className='header'>
        <img className='logo' src="/to-do.png" alt="to do icon"/>
        <h1>To Do List</h1>
      </header>

      <div className='container'>
        <Form
          refreshTodayTodos={fetchTodayTodos}
          refreshOtherTodos={fetchOtherTodos}
        />
      </div>

      <h3>Today's Todos</h3>
      <div className='container'>
        <Todaytodos
          todos={todayTodos}
          refreshTodayTodos={fetchTodayTodos}
          refreshOtherTodos={fetchOtherTodos}
        />
      </div>

      <h3>Other Todos</h3>
      <div className='container'>
        <Othertodos
          todos={otherTodos}
          refreshTodayTodos={fetchTodayTodos}
          refreshOtherTodos={fetchOtherTodos}
        />
      </div>
    </div>
  );
}

export default App;
