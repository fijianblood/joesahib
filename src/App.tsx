import { useState, useEffect } from 'react';
import './index.css';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import WebsitePage from './pages/WebsitePage';
import RangerPage from './pages/RangerPage';
import ContactPage from './pages/ContactPage';
import PlayPage from './pages/PlayPage';
import ToolsPage from './pages/ToolsPage';
import AskLvtsPage from './pages/AskLvtsPage';

const VALID_PAGES = ['home', 'services', 'website', 'ranger', 'play', 'tools', 'ask', 'contact'];

function initialPage() {
  const hash = window.location.hash.replace('#', '');
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

export default function App() {
  const [page, setPage] = useState(initialPage);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  return (
    <>
      <NavBar page={page} onNav={setPage} />
      {page === 'home'     && <HomePage     onNav={setPage} />}
      {page === 'services' && <ServicesPage onNav={setPage} />}
      {page === 'website'  && <WebsitePage  onNav={setPage} />}
      {page === 'ranger'   && <RangerPage />}
      {page === 'play'     && <PlayPage />}
      {page === 'tools'    && <ToolsPage />}
      {page === 'ask'      && <AskLvtsPage />}
      {page === 'contact'  && <ContactPage />}
    </>
  );
}
