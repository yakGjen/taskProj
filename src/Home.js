import './App.scss';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import { Link } from "react-router-dom";


SwiperCore.use([Navigation, Pagination]);


const Home = ({logged, logInToken}) => {
  // const [board, setBoard] = useState({
  //   tasks: [
  //     {
  //       id: 1,
  //       username: "Test User",
  //       email: "test_user_1@example.com",
  //       text: "Hello, world!",
  //       status: 10,
  //     },
  //     {
  //       id: 2,
  //       username: "Test User 2",
  //       email: "test_user_2@example.com",
  //       text: "Hello from user 2!",
  //       status: 0,
  //     },
  //     {
  //       id: 3,
  //       username: "Test User 3",
  //       email: "test_user_3@example.com",
  //       text: "Hello from user 3!",
  //       status: 0,
  //     },
  //     {
  //       id: 4,
  //       username: "Test User 4",
  //       email: "test_user_3@example.com",
  //       text: "Hello from user 4!",
  //       status: 0,
  //     }
  //   ]
  // });
  const [board, setBoard] = useState({
    tasks: []
  });
  const [isBoard, setIsBoard] = useState(false);
  const [modalIsOpen,setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newText, setNewText] = useState('');
  const [slider, setSlider] = useState({});

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
      console.log('data:', data);
      console.log(data.message);

      board.tasks.push(data.message);
      setBoard(board);

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

  const saveChangedData = (id, text) => {
    let newData = new FormData();
    newData.append("token", logInToken);
    newData.append("text", text);
    newData.append("status", 10);

    fetch(`https://uxcandy.com/~shapoval/test-task-backend/v2/edit/${id}?developer=Evgeniy`, {
      method: 'POST',
      mode: 'cors',
      body: newData
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
  };

  useEffect(() => {
    Modal.setAppElement('.app');
    fetch('https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Evgeniy', {
      method: 'GET',
      mode: 'cors',
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      setBoard({
        tasks: data.message.tasks
      });
      setIsBoard(true);
      console.log(slider);
    });
  }, []);

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
        <div>
          <Link
            to={'/login'}
            exact='true'
            className=''
          >
            Авторизация
          </Link>
        </div>
      </div>
      <h1 className='header'>Задачи</h1>
      <div className='tasks'>
        <Swiper
          spaceBetween={65}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          onSwiper={(swiper) => setSlider(swiper)}
          loop
        >
          {board.tasks.map((task, idx) => 
            <SwiperSlide key={`key-${idx}`}>
              <div className='task'>
                <p className='task__point'>Имя:</p>
                <p className='task__name'>{task.username}</p>

                <p className='task__point'>Email:</p>
                <p className='task__email'>{task.email}</p>

                <p className='task__point'>Текст:</p>
                {/* <p className='task__text'>{task.text}</p> */}
                <textarea 
                  readOnly={logged ? false : true}
                  style={logged ? {} : {outline: 'none'}}
                  rows='4'
                  value={task.text}
                  onChange={(e) => handleTaskText(e, task)}
                  className='task__text'
                ></textarea>

                <p className='task__point'>Статус задачи:</p>
                <p className='task__status'>{task.status}</p>

                {logged ? 
                  <div className='task__save-wrap'>
                    <button 
                      onClick={() => saveChangedData(task.id, task.text)}
                      className='task__save'
                    >
                      Сохранить
                    </button>
                  </div>
                  :
                  null
                }
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Home;
