import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import NewTask from "./NewTask.js";
import TaskItem from "./TaskItem.js";

function TasksBody({
  onDragEnd,
  clearAllDailyTasks,
  dailyList,
  time_start_index,
  clearDailyTask,
  taskList,
  tagOptions,
  setTaskName,
  setTaskDueDate,
  setTaskDueTime,
  setTaskTags,
  addTask,
  updateTaskName,
  updateTaskDueDate,
  updateTaskDueTime,
  deleteTask,
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container fluid>
        <Row>
          <Col className="left-col">
            <h1>Daily tasks</h1>

            <div className="clear-all-daily-btn" onClick={clearAllDailyTasks}>
              Clear All
            </div>

            {dailyList.map((timeSlot, i) => {
              return (
                <div key={i} className="daily-timeSlot">
                  <div className="daily-time-display">
                    {i + time_start_index > 12
                      ? i - 12 + time_start_index
                      : i + time_start_index}
                    :00
                  </div>

                  <Droppable droppableId={`${i + time_start_index}`}>
                    {(provided) => (
                      <div className="daily-task-list" ref={provided.innerRef}>
                        {timeSlot.length ? (
                          timeSlot.map((data, index) => {
                            return (
                              <div className="daily-content" key={index}>
                                <div className="daily-name">
                                  {data.task_name}
                                </div>

                                <div
                                  className="daily-clear-btn"
                                  onClick={() => {
                                    clearDailyTask(
                                      data.id,
                                      i + time_start_index
                                    );
                                  }}
                                >
                                  Clear
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="empty-dropzone">DROP TASKS HERE</div>
                        )}
                        {provided.placeHolder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </Col>

          <Col className="right-col">
            <h1>All tasks</h1>

            <div className="new-task">
              <NewTask
                tagOptions={tagOptions}
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
                                <TaskItem
                                  data={data}
                                  updateTaskName={updateTaskName}
                                  updateTaskDueDate={updateTaskDueDate}
                                  updateTaskDueTime={updateTaskDueTime}
                                  deleteTask={deleteTask}
                                />
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
  );
}

export default TasksBody;
