import { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate, useParams } from 'react-router-dom';

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
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [info, setInfo] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate(); // React Routerin hook navigointiin

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnecdote = {
      content,
      author,
      info,
      votes: 0,
      id: Math.round(Math.random() * 10000) // Luodaan uniikki id
    };

    props.addNew(newAnecdote);

    // Ilmoitus uuden anekdootin luomisesta
    setNotification(`a new anecdote: "${newAnecdote.content}" created`);

    // Siirretään takaisin anekdoottien listaan 5 sekunnin kuluttua
    setTimeout(() => {
      setNotification('');
      navigate('/');
    }, 5000);
  };

  return (
    <div>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
        </div>
        <button>Create</button>
      </form>

      {/* Notifikaatio */}
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
