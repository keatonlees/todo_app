import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { EditText } from "react-edit-text";

function TaskItem(
  data,
  updateTaskName,
  updateTaskDueDate,
  updateTaskDueTime,
  deleteTask
) {
  return (
    <Container fluid>
      <Row>
        <Col>+</Col>

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
          <h4 style={{ fontSize: "16px" }}>**tags**</h4>
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
  );
}

export default TaskItem;
