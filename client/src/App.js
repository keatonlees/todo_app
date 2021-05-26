import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Axios from "axios";
import { EditText } from "react-edit-text";
// import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import NewTask from "./components/NewTask.js";
import TaskItem from "./components/TaskItem.js";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-edit-text/dist/index.css";

function App() {
  const endpoint = "http://localhost:4000";

  const [taskName, setTaskName] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(0);
  const [taskDueTime, setTaskDueTime] = useState(0);
  const [taskTags, setTaskTags] = useState([]);
  const [taskList, setTaskList] = useState([]);

  const dailyList = ["Daily Task 1"];

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    const { status, data } = await Axios.get(endpoint + "/getTasks");
    if (status === 200) {
      // console.log("GET TASK STATUS GOOD!");
      setTaskList(data);
    }
  };

  const addTask = async () => {
    const { status } = await Axios.post(endpoint + "/addTask", {
      task_name: taskName,
      task_due_date: taskDueDate,
      task_due_time: taskDueTime,
      task_tags: taskTags,
    });
    if (status === 200) {
      // console.log("ADD TASK STATUS GOOD!");
      getTasks();
    }

    // clear states
    setTaskName(null);
    setTaskDueDate(null);
    setTaskDueTime(null);
    setTaskTags(null);

    // clear inputs
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    // ToDo: clear Select dropdown field
  };

  const deleteTask = async (id) => {
    const { status } = await Axios.delete(endpoint + `/deleteTask/${id}`);
    if (status === 200) {
      // console.log("DELETE TASK STATUS GOOD!");
      getTasks();
    }
  };

  const updateTaskName = async ({ value }, id) => {
    const { status } = await Axios.put(endpoint + "/updateTaskName", {
      id: id,
      task_name: value,
    });
    if (status === 200) {
      console.log("UPDATE TASK NAME STATUS GOOD!");
      getTasks();
    }
  };

  const updateTaskDueDate = async ({ value }, id) => {
    const { status } = await Axios.put(endpoint + "/updateTaskDueDate", {
      id: id,
      task_due_date: value,
    });
    if (status === 200) {
      console.log("UPDATE TASK DUE DATE STATUS GOOD!");
      getTasks();
    }
  };

  const updateTaskDueTime = async ({ value }, id) => {
    const { status } = await Axios.put(endpoint + "/updateTaskDueTime", {
      id: id,
      task_due_time: value,
    });
    if (status === 200) {
      console.log("UPDATE TASK DUE TIME STATUS GOOD!");
      getTasks();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ToDo App</h1>
        <h1>Time</h1>
      </header>

      <body className="App-body">
        <DragDropContext>
          <Container fluid>
            <Row>
              <Col className="left-col">
                <h1>Daily tasks</h1>

                <Droppable droppableId="daily-tasks">
                  {(provided) => (
                    <div className="daily-task-list" ref={provided.innerRef}>
                      {dailyList.length ? (
                        dailyList.map((data, index) => {
                          return (
                            <Draggable
                              key={data}
                              draggableId={data}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className="task-item"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={provided.draggableProps.style}
                                  {...provided.dragHandleProps}
                                >
                                  {data}
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      ) : (
                        <div>HERE</div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>

              <Col className="right-col">
                <h1>All tasks</h1>

                <div className="new-task">
                  <NewTask
                    setTaskName={setTaskName}
                    setTaskDueDate={setTaskDueDate}
                    setTaskDueTime={setTaskDueTime}
                    setTaskTags={setTaskTags}
                    addTask={addTask}
                  />
                </div>

                <Droppable droppableId="all-tasks" isDropDisabled={true}>
                  {(provided) => (
                    <div className="overall-task-list" ref={provided.innerRef}>
                      {taskList.map((data, index) => {
                        return (
                          <Draggable
                            key={data.id}
                            draggableId={data.task_name}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <React.Fragment>
                                <div
                                  className="task-item"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={provided.draggableProps.style}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskItem
                                    data={data}
                                    updateTaskName={updateTaskName}
                                    updateTaskDueDate={updateTaskDueDate}
                                    updateTaskDueTime={updateTaskDueTime}
                                    deleteTask={deleteTask}
                                  />
                                </div>
                                {snapshot.isDragging && (
                                  <div className="task-item">
                                    <Container fluid>
                                      <Row>
                                        <Col>
                                          <EditText
                                            type="text"
                                            defaultValue={data.task_name}
                                            style={{ fontSize: "16px" }}
                                            onSave={(value) => {
                                              updateTaskName(value, data.id);
                                            }}
                                          />
                                        </Col>
                                        <Col>
                                          <EditText
                                            type="date"
                                            defaultValue={data.task_due_date}
                                            style={{ fontSize: "16px" }}
                                            onSave={(value) => {
                                              updateTaskDueDate(value, data.id);
                                            }}
                                          />
                                        </Col>
                                        <Col>
                                          <EditText
                                            type="time"
                                            defaultValue={data.task_due_time}
                                            style={{ fontSize: "16px" }}
                                            onSave={(value) => {
                                              updateTaskDueTime(value, data.id);
                                            }}
                                          />
                                        </Col>
                                        <Col>
                                          {/* <h4>{data.task_tags}</h4> */}
                                          <h4 style={{ fontSize: "16px" }}>
                                            **tags**
                                          </h4>
                                        </Col>
                                        <Col xs={2.5}>
                                          <Button
                                            variant="danger"
                                            onClick={() => {
                                              deleteTask(data.id);
                                            }}
                                          >
                                            Delete
                                          </Button>
                                        </Col>
                                      </Row>
                                    </Container>
                                  </div>
                                )}
                              </React.Fragment>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
            </Row>
          </Container>
        </DragDropContext>
      </body>
    </div>
  );
}

export default App;
