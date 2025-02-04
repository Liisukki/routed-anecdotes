import { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate, useParams } from 'react-router-dom';
import { useField } from './hooks'; // Tuodaan useField-hook

// Menu
const Menu = () => {
  const padding = {
    paddingRight: 5
  };

  return (
    <div>
      <Link to="/" style={padding}>anecdotes</Link>
      <Link to="/create" style={padding}>create new</Link>
      <Link to="/about" style={padding}>about</Link>
    </div>
  );
};

// Lista anekdooteista
const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/anecdote/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
);

// About
const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account...</em>
    <p>Software engineering is full of excellent anecdotes...</p>
  </div>
);

// Footer
const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>source code</a>.
  </div>
);

// Uusi anekdootti
const CreateNew = (props) => {
  const { value: content, onChange: handleContentChange, reset: resetContent } = useField('text');
  const { value: author, onChange: handleAuthorChange, reset: resetAuthor } = useField('text');
  const { value: info, onChange: handleInfoChange, reset: resetInfo } = useField('text');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAnecdote = {
      content,
      author,
      info,
      votes: 0,
      id: Math.round(Math.random() * 10000),
    };

    props.addNew(newAnecdote);

    // Ilmoitus onnistuneesta lisäyksestä
    setNotification(`a new anecdote: "${newAnecdote.content}" created`);

    // Poistetaan ilmoitus ja siirretään anekdoottien listaan 5 sekunnin kuluttua
    setTimeout(() => {
      setNotification('');
      navigate('/');
    }, 5000);
  };

  // Lomakkeen kenttien tyhjentäminen
  const handleReset = () => {
    resetContent();
    resetAuthor();
    resetInfo();
  };

  return (
    <div>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input type="text" value={content} onChange={handleContentChange} />
        </div>
        <div>
          author
          <input type="text" value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          url for more info
          <input type="text" value={info} onChange={handleInfoChange} />
        </div>
        <button>Create</button>
      </form>

      {/* Tyhjennä lomake -nappi */}
      <button type="button" onClick={handleReset}>
        Reset
      </button>

      {/* Näytetään notifikaatio */}
      {notification && <p>{notification}</p>}
    </div>
  );
};

// Yksittäinen anekdootti
const SingleAnecdote = ({ anecdotes }) => {
  const { id } = useParams(); // Haetaan anekdootin id polusta
  const anecdote = anecdotes.find(a => a.id === Number(id));

  if (!anecdote) {
    return <p>Anecdote not found</p>;
  }

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>For more information, visit <a href={anecdote.info} target="_blank" rel="noopener noreferrer">this link</a></p>
      <p>Has {anecdote.votes} votes</p>
    </div>
  );
};


const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ]);

  const addNew = (anecdote) => {
    setAnecdotes(anecdotes.concat(anecdote));
  };

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />

        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/about" element={<About />} />
          <Route path="/anecdote/:id" element={<SingleAnecdote anecdotes={anecdotes} />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
