import React from "react";
import Axios from "axios";
import { useState, useEffect } from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-edit-text/dist/index.css";

import TasksBody from "./components/TasksBody";

function App() {
  const endpoint = "http://localhost:4000";

  const [tagOptions, setTagOptions] = useState([]);

  const [taskName, setTaskName] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(0);
  const [taskDueTime, setTaskDueTime] = useState(0);
  const [taskTags, setTaskTags] = useState([]);

  const [taskList, setTaskList] = useState([]);
  const [dailyList, setDailyList] = useState([]);

  const time_start_index = 7; // IN 24 HOUR CLOCK
  const time_end_index = 23; // IN 24 HOUR CLOCK

  useEffect(() => {
    getTagOptions();
    refreshTasks();
  }, []);

  const refreshTasks = () => {
    getAllTasks();
    getDailyTasksFromTime();
  };

  const getTagOptions = async () => {
    const { status, data } = await Axios.get(endpoint + "/getTagOptions");
    if (status === 200) {
      let temp_array = [];
      data.forEach((element) => {
        temp_array.push({ value: element.tag_name, label: element.tag_name });
      });
      setTagOptions(temp_array);
    }
  };

  const getAllTasks = async () => {
    const { status, data } = await Axios.get(endpoint + "/getAllTasks");
    if (status === 200) {
      setTaskList(data);
    }
  };

  const getDailyTasksFromTime = async () => {
    const data_storage = [];
    for (let i = time_start_index; i < time_end_index + 1; i++) {
      const { status, data } = await Axios.get(
        endpoint + `/getDailyTasksFromTime/${i}`
      );
      if (status === 200) {
        data_storage.push(data);
      }
    }
    setDailyList(data_storage);
  };

  const addTask = async () => {
    let task_id = 0;

    const { status } = await Axios.post(endpoint + "/addTask", {
      task_name: taskName,
      task_due_date: taskDueDate,
      task_due_time: taskDueTime,
    });
    if (status === 200) {
      task_id = await getLastInsertedId();
      console.log("TASKID:");
      console.log(task_id);
    }

    taskTags.forEach((tag_name) => {
      console.log("TASKID: " + task_id + " TAGNAME: " + tag_name.value);
      addTagToTask(task_id, tag_name.value);
    });

    clearStates();
    clearInputs();
  };

  const getLastInsertedId = async () => {
    const { status, data } = await Axios.get(endpoint + "/getLastInsertedId");
    if (status === 200) return data[0].last_id;
    return 0;
  };

  const addTagToTask = async (task_id, tag_name) => {
    const { status } = await Axios.post(endpoint + "/addTagToTask", {
      taskid: task_id,
      tagname: tag_name,
    });
    if (status === 200) getAllTasks();
  };

  const clearStates = () => {
    setTaskName(null);
    setTaskDueDate(null);
    setTaskDueTime(null);
    // setTaskTags(null);
  };

  const clearInputs = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    // ToDo: clear Select dropdown field
  };

  const deleteTask = async (id) => {
    const { status } = await Axios.delete(endpoint + `/deleteTask/${id}`);
    if (status === 200) refreshTasks();
  };

  const updateTaskName = async ({ value }, id) => {
    const { status } = await Axios.put(endpoint + "/updateTaskName", {
      id: id,
      task_name: value,
    });
    if (status === 200) refreshTasks();
  };

  const updateTaskDueDate = async ({ value }, id) => {
    const { status } = await Axios.put(endpoint + "/updateTaskDueDate", {
      id: id,
      task_due_date: value,
    });
    if (status === 200) refreshTasks();
  };

  const updateTaskDueTime = async ({ value }, id) => {
    const { status } = await Axios.put(endpoint + "/updateTaskDueTime", {
      id: id,
      task_due_time: value,
    });
    if (status === 200) refreshTasks();
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // if not dragged to droppable area
    if (destination)
      setDaily(taskList[source.index].id, destination.droppableId);
  };

  const setDaily = async (id, time) => {
    const { status } = await Axios.put(endpoint + "/setDaily", {
      id: id,
      time: time,
    });
    if (status === 200) getDailyTasksFromTime();
  };

  const clearAllDailyTasks = async () => {
    const { status } = await Axios.delete(endpoint + "/clearAllDailyTasks");
    if (status === 200) getDailyTasksFromTime();
  };

  const clearDailyTask = async (id, time) => {
    const { status } = await Axios.delete(
      endpoint + `/clearDailyTask/${id}/${time}`
    );
    if (status === 200) getDailyTasksFromTime();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ToDo App</h1>
        <h1>Time</h1>
      </header>

      <body className="App-body">
        <TasksBody
          onDragEnd={onDragEnd}
          clearAllDailyTasks={clearAllDailyTasks}
          dailyList={dailyList}
          time_start_index={time_start_index}
          clearDailyTask={clearDailyTask}
          taskList={taskList}
          tagOptions={tagOptions}
          setTaskName={setTaskName}
          setTaskDueDate={setTaskDueDate}
          setTaskDueTime={setTaskDueTime}
          setTaskTags={setTaskTags}
          addTask={addTask}
          updateTaskName={updateTaskName}
          updateTaskDueDate={updateTaskDueDate}
          updateTaskDueTime={updateTaskDueTime}
          deleteTask={deleteTask}
        />
      </body>
    </div>
  );
}

export default App;
