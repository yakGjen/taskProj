import './App.scss';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';

SwiperCore.use([Navigation, Pagination]);

const App = () => {
  // const [boards, setBoards] = useState([
  //   {id: 1, title: 'Задачи', items: [
  //     {id: 1, title: 'Задача 1'},
  //     {id: 2, title: 'Задача 2'},
  //   ]},
  //   {id: 2, title: 'Выполнено', items: [
  //     {id: 3, title: 'Задача 3'},
  //     {id: 3, title: 'Задача 4'},
  //   ]}
  // ]);

  const [board, setBoards] = useState({
    tasks: [
      {
        id: 1,
        username: "Test User",
        email: "test_user_1@example.com",
        text: "Hello, world!",
        status: 10,
      },
      {
        id: 2,
        username: "Test User 2",
        email: "test_user_2@example.com",
        text: "Hello from user 2!",
        status: 0,
      },
      {
        id: 3,
        username: "Test User 3",
        email: "test_user_3@example.com",
        text: "Hello from user 3!",
        status: 0,
      },
      {
        id: 4,
        username: "Test User 4",
        email: "test_user_3@example.com",
        text: "Hello from user 3!",
        status: 0,
      }
    ]
  });
  const [modalIsOpen,setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newText, setNewText] = useState('');

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

    const arr = newTask.getAll('username');

    fetch('https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=Evgeniy', {
      method: 'POST',
      mode: 'cors',
      body: newTask
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      setNewName('');
      setNewEmail('');
      setNewText('');
    });
  };

  // const [currentBoard, setCurrentBoard] = useState(null);
  // const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    Modal.setAppElement('.app');
    // fetch('https://uxcandy.com/~shapoval/test-task-backend/v2/?developer=Evgeniy', {
    //   method: 'GET',
    //   mode: 'cors',
    // })
    // .then((response) => {
    //   return response.json();
    // })
    // .then((data) => {
    //   console.log(data);
    // });
  });



  return (
    <div className='app'>
      <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          className='new-task'
      >
 
          {/* <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2> */}
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
      </div>
      <h1 className='header'>Задачи</h1>
      <div className='tasks'>
        <Swiper
          spaceBetween={55}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {board.tasks.map(task => 
            <SwiperSlide>
              <div className='task'>
                <p className='task__point'>Имя:</p>
                <p className='task__name'>{task.username}</p>

                <p className='task__point'>Email:</p>
                <p className='task__email'>{task.email}</p>

                <p className='task__point'>Текст:</p>
                <p className='task__text'>{task.text}</p>

                <p className='task__point'>Статус задачи:</p>
                <p className='task__status'>{task.status}</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
        {/* {board.tasks.map(task => 
          <div className='task'>
            <p className='task__point'>Имя:</p>
            <p className='task__name'>{task.username}</p>

            <p className='task__point'>Email:</p>
            <p className='task__email'>{task.email}</p>

            <p className='task__point'>Текст:</p>
            <p className='task__text'>{task.text}</p>

            <p className='task__point'>Статус задачи:</p>
            <p className='task__status'>{task.status}</p>
          </div>
        )} */}
      </div>

      
      {/*boards.map(board => 
        <div 
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropCardHandler(e, board)}
          className='board'
        >
          <h3 className='board__header'>{board.title}</h3>
          <div className='board__tasks'>
            {board.items.map(item =>
              <p
                draggable={true}
                onDragOver={(e) => dragOverHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragStart={(e) => dragStartHandler(e, board, item)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDrop={(e) => dropHandler(e, board, item)}
                className='board__task'
              >
                {item.text}
              </p>
            )}
          </div>
        </div>
      )*/}
    </div>
  );
};

// const dragOverHandler = (e) => {
  //   e.preventDefault();
  //   if (e.target.className === 'board__task') {
  //     e.target.style.boxShadow = '0 4px 3px blue';
  //   }
  // };

  // const dragLeaveHandler = (e) => {
  //   e.target.style.boxShadow = 'none';
  // };

  // const dragStartHandler = (e, board, item) => {
  //   setCurrentBoard(board);
  //   setCurrentItem(item);
  // };

  // const dragEndHandler = (e) => {
  //   e.target.style.boxShadow = 'none';
  // };

  // const dropHandler = (e, board, item) => {
  //   e.preventDefault();
  //   e.target.style.boxShadow = 'none';

  //   const currentIndex = currentBoard.items.indexOf(currentItem);
  //   currentBoard.items.splice(currentIndex, 1);

  //   const dropIndex = board.items.indexOf(item);
  //   board.items.splice(dropIndex + 1, 0, currentItem);

  //   setBoards(boards.map(b => {
  //     if (b.id === board.id) {
  //       return board;
  //     }

  //     if (b.id === currentBoard.id) {
  //       return currentBoard;
  //     }

  //     return b;
  //   }));
  // };

  // const dropCardHandler = (e, board) => {
  //   board.items.push(currentItem);

  //   const currentIndex = currentBoard.items.indexOf(currentItem);
  //   currentBoard.items.splice(currentIndex, 1);

  //   setBoards(boards.map(b => {
  //     if (b.id === board.id) {
  //       return board;
  //     }

  //     if (b.id === currentBoard.id) {
  //       return currentBoard;
  //     }

  //     return b;
  //   }));
  // };

// function App() {
//   return (
//     <div className="app">
      
//     </div>
//   );
// }

export default App;
