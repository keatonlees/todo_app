import React from "react";
import { EditText } from "react-edit-text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTrash } from "@fortawesome/free-solid-svg-icons";

function TaskItem({
  data,
  updateTaskName,
  updateTaskDueDate,
  updateTaskDueTime,
  deleteTask,
}) {
  const tags_array = data.task_tags.split(",");
  const colours_array = data.tag_colours.split(",");

  return (
    <div className="item-content">
      <FontAwesomeIcon icon={faBars} className="item-handle" />
      <EditText
        className="item-name"
        type="text"
        defaultValue={data.task_name}
        onSave={(value) => {
          updateTaskName(value, data.id);
        }}
      />
      <EditText
        className="item-date"
        type="date"
        defaultValue={data.task_due_date}
        onSave={(value) => {
          updateTaskDueDate(value, data.id);
        }}
      />
      <EditText
        className="item-time"
        type="time"
        defaultValue={data.task_due_time}
        onSave={(value) => {
          updateTaskDueTime(value, data.id);
        }}
      />
      <div className="item-tags">
        {tags_array.map((tag_name, index) => {
          return (
            <div
              key={index}
              className="item-tags-tag"
              // style={{ backgroundColor: "lightgrey" }}
              style={{ backgroundColor: colours_array[index] }}
            >
              {tag_name}
            </div>
          );
        })}
      </div>

      <div
        className="item-delete-btn"
        onClick={() => {
          deleteTask(data.id);
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </div>
    </div>
  );
}

export default TaskItem;
