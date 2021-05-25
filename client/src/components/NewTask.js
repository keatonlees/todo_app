import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
// import makeAnimated from "react-select/animated";
// import moment from "react-moment";

function NewTask({
  setTaskName,
  setTaskDueDate,
  setTaskDueTime,
  setTaskTags,
  addTask,
}) {
  const tagOptions = [
    { value: "school", label: "School" },
    { value: "work", label: "Work" },
    { value: "other", label: "Other" },
  ];

  return (
    <Container fluid>
      <Row>
        {/* ---------- TASK NAME ---------- */}
        <Col className="new-input">
          <h1>Task Name</h1>
          <input
            type="text"
            placeholder="New Task"
            onChange={(event) => {
              setTaskName(event.target.value);
            }}
          ></input>
        </Col>

        {/* ---------- DATE ---------- */}
        <Col className="new-input">
          <h1>Due Date</h1>
          <input
            type="date"
            onChange={(event) => {
              setTaskDueDate(event.target.value);
            }}
          ></input>
        </Col>

        {/* ---------- TIME ---------- */}
        <Col className="new-input">
          <h1>Due Time</h1>
          <input
            type="time"
            onChange={(event) => {
              setTaskDueTime(event.target.value);
            }}
          ></input>
        </Col>

        {/* ---------- TAGS ---------- */}
        <Col className="new-input">
          <h1>Tags</h1>
          <Select
            options={tagOptions}
            isMulti
            // components={makeAnimated()}
            onChange={(values) => {
              setTaskTags(values);
            }}
          />
        </Col>

        {/* ---------- ADD TASK ---------- */}
        <Col xs={2.5}>
          <Button variant="success" onClick={addTask}>
            Add Task
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default NewTask;
