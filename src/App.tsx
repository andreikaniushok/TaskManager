import React, { ChangeEvent, FC, useState } from "react";
import "./App.css";
import logo from "./assets/img/logo_task.png";

const localStorKey = "tasks";

interface ITask {
  text: string;
  completed: boolean;
}

const addItemsToLocalStor = (array: ITask[]) => {
  localStorage.setItem(localStorKey, JSON.stringify(array));
};

const getItemsFromLocalStor = (): ITask[] => {
  const storedItems = localStorage.getItem(localStorKey);
  return storedItems ? JSON.parse(storedItems) : [];
};

const App: FC = () => {
  const initialTasks = getItemsFromLocalStor();
  const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  const [task, setTask] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>(initialTasks);
  const [isEditTask, setIsEditTask] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editableTask, setEditableTask] = useState<string>("");
  const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(false); // Состояние для отображения блока фильтров

  const handleDeleteTask = (indexTask: number) => {
    const newTasksList = tasks.filter((_, index) => index !== indexTask);
    setTasks(newTasksList);
    setFilteredTasks(newTasksList);
    addItemsToLocalStor(newTasksList);
  };

  const handleEditTask = (index: number) => {
    setEditIndex(index);
    setEditableTask(tasks[index].text);
    setIsEditTask(true);
  };

  const handleCloseEditTask = () => {
    setIsEditTask(false);
    setEditIndex(null);
  };

  const handleSaveEditTask = () => {
    if (editIndex !== null) {
      const updatedTasks = tasks.map((task, index) =>
        index === editIndex ? { ...task, text: editableTask } : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      addItemsToLocalStor(updatedTasks);
      handleCloseEditTask();
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() !== "" && !tasks.some((t) => t.text === task.trim())) {
      const newTasksList = [...tasks, { text: task.trim(), completed: false }];
      setTasks(newTasksList);
      setFilteredTasks(newTasksList);
      addItemsToLocalStor(newTasksList);
      setTask("");
    }
  };

  const handleSortByAZ = () => {
    const newTasksList = [...tasks].sort((a, b) =>
      a.text.localeCompare(b.text)
    );
    setTasks(newTasksList);
    setFilteredTasks(newTasksList);
    addItemsToLocalStor(newTasksList);
  };

  const handleSortByZA = () => {
    const newTasksList = [...tasks].sort((a, b) =>
      b.text.localeCompare(a.text)
    );
    setTasks(newTasksList);
    setFilteredTasks(newTasksList);
    addItemsToLocalStor(newTasksList);
  };

  const handleUpdateTask = (e: ChangeEvent<HTMLInputElement>) => {
    setEditableTask(e.target.value);
  };

  const handleFilteredByText = (e: ChangeEvent<HTMLInputElement>) => {
    const filterText = e.target.value.toLowerCase();
    const filteredByText = tasks.filter((item) =>
      item.text.toLowerCase().includes(filterText)
    );
    setFilteredTasks(filteredByText);
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    addItemsToLocalStor(updatedTasks);
  };

  const toggleFiltersVisibility = () => {
    setIsFiltersVisible(!isFiltersVisible); // Переключаем видимость блока фильтров
  };

  return (
    <div className="container">
      <div className="title-wrapper">
        <img src={logo} alt="" className="logo"></img>

        <div className="title">
          <h1>TASK MANAGER</h1>
          <h3>Set goals, reach new heights</h3>
        </div>
      </div>

      <div className="button-wrapper">
        <button
          onClick={toggleFiltersVisibility}
          className="toggle-filters-button"
        >
          {isFiltersVisible ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {isFiltersVisible && ( // Условный рендеринг блока фильтров
        <div className="filters-sorting">
          <input
            onChange={handleFilteredByText}
            placeholder="Filter tasks"
            className="filter-input"
          />
          <button onClick={handleSortByAZ} className="sort-button">
            Sort A-Z
          </button>
          <button onClick={handleSortByZA} className="sort-button">
            Sort Z-A
          </button>
        </div>
      )}

      <hr />

      <div className="task-list">
        {filteredTasks && filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) =>
            !isEditTask || editIndex !== index ? (
              <div
                key={index}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(index)}
                  placeholder="v"
                />
                <p>{task.text}</p>
                <button onClick={() => handleDeleteTask(index)}>Delete</button>
                <button onClick={() => handleEditTask(index)}>Edit</button>
              </div>
            ) : (
              <div key={index} className="task-edit">
                <input
                  type="text"
                  placeholder="Edit task"
                  value={editableTask}
                  onChange={handleUpdateTask}
                />
                <button onClick={handleSaveEditTask}>Save</button>
                <button onClick={handleCloseEditTask}>Cancel</button>
              </div>
            )
          )
        ) : (
          <div className={`task-item ${""}`}>No tasks</div>
        )}
      </div>

      <hr />

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="New task"
          value={task}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTask(e.target.value)
          }
        />

        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default App;
