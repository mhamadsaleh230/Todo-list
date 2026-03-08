import React, { useState } from 'react';
import axios from 'axios';
import './todaytodos.css';
import Editform from '../form/editform';

export function Todaytodos({ todos = [], refreshTodayTodos, refreshOtherTodos }) {
  const [editTodo, setEditTodo] = useState(null);

  const handleCheckboxChange = async (todo) => {
    try {
      await axios.put('http://localhost:8081/completetodos', {
        id: todo.id,
        iscompleted: todo.iscompleted,
      });
      refreshTodayTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete('http://localhost:8081/deletetodo', { data: { id } });
      refreshTodayTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="todaytodos">
      <ul style={{ minWidth: '250px' }}>
        {todos.map(todo => (
          <li style={{ minWidth: '200px' }} key={todo.id}>
            {editTodo && editTodo.id === todo.id ? (
              <Editform
                todo={editTodo}
                onClose={() => {
                  setEditTodo(null);
                  refreshTodayTodos();
                  refreshOtherTodos(); // update both lists on edit
                }}
              />
            ) : (
              <div className="card">
                <table style={{ tableLayout: 'fixed', width: '100%' }}>
                  <colgroup>
                    <col style={{ width: '90px' }} />
                    <col style={{ width: '100%', minWidth: '100px' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Todo :</td>
                      <td data-completed={todo.iscompleted} style={{ overflowWrap: 'break-word' }}>{todo.todo}</td>
                    </tr>

                    {todo.description?.trim() && (
                      <tr>
                        <td style={{ textAlign: 'right', fontWeight: 'bold', verticalAlign: 'top' }}>Description :</td>
                        <td style={{ overflowWrap: 'break-word' }} data-completed={todo.iscompleted}>
                          {todo.description}
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', verticalAlign: 'top' }}>Priority :</td>
                      <td data-completed={todo.iscompleted}>{todo.priority}</td>
                    </tr>

                    <tr>
                      <td style={{ float: 'right', fontWeight: 'bold' }}>
                        <input
                          type='checkbox'
                          checked={todo.iscompleted}
                          onChange={() => handleCheckboxChange(todo)}
                        />
                      </td>
                      <td>{todo.iscompleted ? 'Completed' : 'Not completed'}</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className='editbutton' onClick={() => setEditTodo(todo)}>Edit</button>
                        <button className='deletbutton' onClick={() => deleteTodo(todo.id)}>X</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
