import './App.scss';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Link } from "react-router-dom";
import Carousel from 'react-elastic-carousel';

const Home = ({logged, logInToken, logOut, board, setBoard}) => {
  const [isBoard, setIsBoard] = useState(false);
  const [modalIsOpen,setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newText, setNewText] = useState('');

  let pages = 0;
  let allTasks = [];

  const getOtherTasks = (page) => {
    fetch(`https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Evgeniy&page=${page}`, {
      method: 'GET',
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      allTasks = [...allTasks, ...data.message.tasks];
      
      if (pages === page) {
        setBoard({
          tasks: allTasks
        });
      }
    });
  };

  const getTasks = () => {
    fetch('https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Evgeniy', {
      method: 'GET',
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const allTasksNumb = data.message.total_task_count;
      pages = Math.ceil( allTasksNumb / 3 );

      allTasks = [...allTasks, ...data.message.tasks];
      
      setBoard({
        tasks: data.message.tasks
      });
      setIsBoard(true);

      for (let i = 2; i <= pages; i++) {
        getOtherTasks(i);
      }
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };
  const handleNewEmail = (e) => {
    setNewEmail(e.target.value);
  };
  const handleNewText = (e) => {
    setNewText(e.target.value);
  };

  const sendNewTask = (e) => {
    e.preventDefault();

    let newTask = new FormData();
    newTask.append("username", newName);
    newTask.append("email", newEmail);
    newTask.append("text", newText);

    fetch('https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=Evgeniy', {
      method: 'POST',
      mode: 'cors',
      body: newTask
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === 'ok') {
        board.tasks.push(data.message);
        setBoard(board);
        closeModal();
      } else {
        alert(`${JSON.stringify(data.message)}`);
      }

      setNewName('');
      setNewEmail('');
      setNewText('');
    });
  };

  const handleTaskText = (e, task) => {
    const changedTaskIdx = board.tasks.indexOf(task);

    board.tasks[changedTaskIdx].text = e.target.value;

    setBoard({
      tasks: board.tasks
    });
  };

  const handleStatus = (e, task) => {
    const changedTaskIdx = board.tasks.indexOf(task);

    board.tasks[changedTaskIdx].status = e.target.value;

    setBoard({
      tasks: board.tasks
    });
  };

  const saveChangedData = (task) => {
    let newData = new FormData();
    newData.append("token", logInToken);
    newData.append("text", task.text);
    newData.append("status", task.status);

    fetch(`https://uxcandy.com/~shapoval/test-task-backend/v2/edit/${task.id}?developer=Evgeniy`, {
      method: 'POST',
      mode: 'cors',
      body: newData
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === 'error') {
        alert(data.message);
        return;
      }

      handleTaskText({
        target: {
          value: task.text
        }
      }, task);
      handleStatus({
        target: {
          value: task.status
        }
      }, task);
    });
  };


  const sortByName = () => {
    board.tasks.sort((a, b) => {
      if (a.username > b.username) {
        return 1;
      }
      if (a.username < b.username) {
        return -1;
      }
      return 0;
    });
    setBoard({
      tasks: board.tasks
    });
  };

  const sortByEmail = () => {
    board.tasks.sort((a, b) => {
      if (a.email > b.email) {
        return 1;
      }
      if (a.email < b.email) {
        return -1;
      }
      return 0;
    });
    setBoard({
      tasks: board.tasks
    });
  };

  const sortByStatus = () => {
    board.tasks.sort((a, b) => {
      return +b.status - +a.status;
    });
    setBoard({
      tasks: board.tasks
    });
  };

  useEffect(() => {
    Modal.setAppElement('.app');
    getTasks();
  }, []);

  const switchStatus = (status) => {
    switch (status) {
      case 0:
        return 'задача не выполнена';
      case 1:
        return 'задача не выполнена, отредактирована админом';
      case 10:
        return 'задача выполнена';
      default:
        return 'задача отредактирована админом и выполнена';
    }
  };

  if (!isBoard) return (
    <div className='app'>Loading...</div>
  );

  if (isBoard) return (
    <div className='app'>
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          className='new-task'
      >
          <button 
            onClick={closeModal}
            className='new-task__close'
          >
            close
          </button>
          <h3>Новая задача</h3>
          <form className='new-task__form'>
            <input name="name" value={newName} onChange={handleNewName} className='new-task__form-item' type='text' placeholder='Имя' />
            <input name="email" value={newEmail} onChange={handleNewEmail} className='new-task__form-item' type='text'placeholder='Email' />
            <textarea name="text" rows='7' value={newText} onChange={handleNewText} className='new-task__form-item' placeholder='Текст задачи'></textarea>
            <button onClick={sendNewTask} className='new-task__form-item'>Создать задачу</button>
          </form>
        </Modal>

      <div className='top-bar'>
        <button onClick={openModal}>Создать задачу</button>
        <div className='sorting'>
          <p>Сортировать:</p>
          <button onClick={sortByName}>по имени</button>
          <button onClick={sortByEmail}>по email</button>
          <button onClick={sortByStatus}>по статусу</button>
        </div>
        <div className='top-bar__login-section'>
          {logged ? <p>Привет, Admin</p> : null}
          
          <Link
            to={'/login'}
            exact='true'
            className=''
            onClick={logged ? logOut : null}
          >
            {logged ? 'Выйти' : 'Авторизация'}
          </Link>
        </div>
      </div>
      <h1 className='header'>Задачи</h1>
      <div className='tasks'>
        <Carousel itemsToScroll={3} itemsToShow={3}>
          {board.tasks.map((task, idx) =>
            <div key={`key-${idx}`} className='task'>
              <p className='task__point'>Имя:</p>
              <p className='task__name'>{task.username}</p>

              <p className='task__point'>Email:</p>
              <p className='task__email'>{task.email}</p>

              <p className='task__point'>Текст:</p>
              <textarea 
                readOnly={logged ? false : true}
                style={logged ? {} : {outline: 'none'}}
                rows='4'
                value={task.text}
                onChange={(e) => handleTaskText(e, task)}
                className='task__text'
              ></textarea>

              <p className='task__point'>Статус задачи:</p>
              {logged ? 
                <select value={task.status} onChange={(e) => handleStatus(e, task)}>
                  <option value="0">задача не выполнена</option>
                  <option value="1">задача не выполнена, отредактирована админом</option>
                  <option value="10">задача выполнена</option>
                  <option value="11">задача отредактирована админом и выполнена</option>
                </select>
                : 
                <p className='task__status'>
                  {switchStatus(task.status)}
                </p>
              }

              {logged ? 
                <div className='task__save-wrap'>
                  <button 
                    onClick={() => saveChangedData(task)}
                    className='task__save'
                  >
                    Сохранить
                  </button>
                </div>
                :
                null
              }
            </div>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
