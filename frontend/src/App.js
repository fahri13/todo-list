import { useReducer, useState } from "react";
import { Card, Button, ListGroup, Form } from "react-bootstrap";

function reducer(tasks, action) {
  switch (action.type) {
    case "addTask":
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    case "updateTask":
      return tasks.map(t => (t.id === action.task.id ? action.task : t));
    case "deleteTask":
      return tasks.filter(t => t.id !== action.id);
  }
}

function TaskList({ tasks, onAdd, onUpdate, onDelete }) {
  const [task, setTask] = useState();
  const [isUpdate, setIsUpdate] = useState(false);

  const taskList = tasks.map(task => {
    return (
      <ListGroup.Item key={task.id}>
        {task.text}
        <Button
          onClick={() => {
            handleUpdateState(false);
            setTask(task);
          }}
          className="mx-2 badge"
        >
          Ubah
        </Button>
        <Button onClick={() => onDelete(task.id)} className="badge">
          Hapus
        </Button>
      </ListGroup.Item>
    );
  });

  function handleUpdateState(updateState) {
    updateState ? setIsUpdate(false) : setIsUpdate(true);
  }

  const form = isUpdate ? (
    <FormUpdateTask
      task={task}
      onUpdateTask={onUpdate}
      setUpdate={handleUpdateState}
    />
  ) : (
    <FormAddTask onAddTask={onAdd} />
  );

  return (
    <>
      <Card.Title>{form}</Card.Title>
      <Card.Body>
        <ListGroup>{taskList}</ListGroup>
      </Card.Body>
    </>
  );
}

// .>

function FormUpdateTask({ task, onUpdateTask, setUpdate }) {
  const [value, setValue] = useState(task.text);

  return (
    <>
      <input
        type="text"
        onChange={e => setValue(e.target.value)}
        className="mx-2"
        value={value}
      />
      <Button
        className="mx-2"
        onClick={() => {
          setValue("");
          setUpdate(true);
          onUpdateTask({ ...task, text: value });
        }}
      >
        Simpan Task
      </Button>
      <Button
        onClick={() => {
          setValue("");
          setUpdate(true);
        }}
      >
        Batal
      </Button>
    </>
  );
}

// .>

function FormAddTask({ onAddTask }) {
  const [value, setValue] = useState("");
  return (
    <>
      <Form.Control
        type="text"
        onChange={e => setValue(e.target.value)}
        className="mx-2"
        value={value}
      />
      <Button
        onClick={() => {
          setValue("");
          onAddTask(value);
        }}
      >
        Tambah Task
      </Button>
    </>
  );
}

export default function App() {
  // .>
  const [tasks, dispatch] = useReducer(reducer, [{ id: 1, text: "test" }]);

  function handleAddTask(value) {
    if (value !== "") {
      dispatch({
        type: "addTask",
        id: tasks.length + 1,
        text: value,
        done: false,
      });
    }
  }

  function handleDeleteTask(id) {
    dispatch({ type: "deleteTask", id });
  }

  function handleUpdateTask(task) {
    dispatch({ type: "updateTask", task });
  }

  return (
    <>
      <Card key="list" className="my-4">
        <Card.Header> To Do List</Card.Header>
        <TaskList
          tasks={tasks}
          onAdd={handleAddTask}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      </Card>
    </>
  );
}
// .>
