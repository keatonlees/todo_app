import React from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function NewTask({
  tagOptions,
  setTaskName,
  setTaskDueDate,
  setTaskDueTime,
  setTaskTags,
  addTask,
}) {
  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: 40,
      "&:hover": { border: "1px solid black" },
      border: "1px solid black",
      boxShadow: "none",
    }),
  };

  return (
    <div className="input-content">
      <FontAwesomeIcon icon={faPlus} className="input-handle" />

      <input
        className="input-name"
        type="text"
        placeholder="New Task"
        onChange={(event) => {
          setTaskName(event.target.value);
        }}
      ></input>

      <input
        className="input-date"
        type="date"
        onChange={(event) => {
          setTaskDueDate(event.target.value);
        }}
      ></input>

      <input
        className="input-time"
        type="time"
        onChange={(event) => {
          setTaskDueTime(event.target.value);
        }}
      ></input>

      <Select
        className="input-tags"
        options={tagOptions}
        isMulti
        // blurInputOnSelect
        // onBlur={{
        //   MultiValueRemove: () => null,
        // }}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        styles={customStyles}
        onChange={(values) => {
          setTaskTags(values);
          console.log(values);
        }}
      />

      <div className="input-add-btn" onClick={addTask}>
        <FontAwesomeIcon icon={faPlus} />
      </div>
    </div>
  );
}

export default NewTask;
