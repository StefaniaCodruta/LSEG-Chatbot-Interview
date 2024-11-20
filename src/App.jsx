import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomeView from './views/HomeView';
import ChatView from './views/ChatView';
import Header from './components/Header';

function App() {
  return (
    // <BrowserRouter>
    <div className="container max-w-screen-lg mx-auto">
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/chat" element={<ChatView />} />
      </Routes>
    </div>
  );
}

export default App;
