import React,{useState} from 'react';
import './todoform.css';
import axios from 'axios';
export function Form() {



const[showallfields,setshowallfields]=useState(false)
const today = new Date().toISOString().split('T')[0];
function handelform(event){
   
    event.preventDefault()

  const newtodo = {
  todo: event.target.Todo.value,
  description: event.target.Description?.value ?? "",
 date: event.target.Date?.value || today,
  priority: event.target.Priority?.value || "Low",
  iscompleted: 0,
};

axios.post('http://localhost:8081/addtodo/', newtodo)
.then(response => {
  console.log('Added:', response.data);
  window.location.reload();
})
.catch(error => {
  console.error('Error:', error);
});
};  


return(<div className="Form">
   <div className='title'><h3>New Todo</h3>
  <button
    className='titlebutton'
    onClick={() => setshowallfields(!showallfields)}
    type="button"
  >
    {showallfields ? "Hide" : "Show"} all fields
  </button>
    </div>
    <form style={{width:"100%",textAlign:"center",alignContent:"center"}}onSubmit={handelform}>
    <input type="text" autoComplete="off" placeholder="ToDo*"name='Todo' maxLength={50} required></input>
    {showallfields && <>
    <textarea type="" placeholder="Description**" name='Description'></textarea>  
    <input type="date" placeholder="ToDo*" name='Date' defaultValue={today} min={today}></input>
    <div style={{margin : "5px",display:"grid",gridTemplateColumns:"1fr 4fr",width:'50%'}}>
        <label style={{width : '20%',fontWeight:"bold"}}>priority: </label>
    <select  style={{width : '100%',borderRadius:"20px",    border: "1px solid black"}}defaultValue='Low'name="Priority">
        <option style={{color: "red"}}value="High">High</option>
        <option style={{color: "blue"}}value="Medium">Medium</option>
        <option style={{color: "green"}}value="Low">Low</option>

    </select>
    
    </div></>}
    <button className='addbutton' type="submit">Add Task</button>
</form>

</div>
) ;}