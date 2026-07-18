import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './index.css';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import WebsitePage from './pages/WebsitePage';
import ThreeDPage from './pages/ThreeDPage';
import RangerPage from './pages/RangerPage';
import ContactPage from './pages/ContactPage';
import PlayPage from './pages/PlayPage';
import ToolsPage from './pages/ToolsPage';
import AskLvtsPage from './pages/AskLvtsPage';

const VALID_PAGES = ['home', 'services', 'website', 'threed', 'ranger', 'play', 'tools', 'ask', 'contact'];

function initialPage() {
  const hash = window.location.hash.replace('#', '');
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

function renderPage(page: string, onNav: (p: string) => void) {
  switch (page) {
    case 'home':     return <HomePage     onNav={onNav} />;
    case 'services': return <ServicesPage onNav={onNav} />;
    case 'website':  return <WebsitePage  onNav={onNav} />;
    case 'threed':   return <ThreeDPage   onNav={onNav} />;
    case 'ranger':   return <RangerPage />;
    case 'play':     return <PlayPage />;
    case 'tools':    return <ToolsPage />;
    case 'ask':      return <AskLvtsPage />;
    case 'contact':  return <ContactPage />;
    default:         return null;
  }
}

// Apple's UINavigationController easing curve — gives page swaps an iOS "push" feel.
const IOS_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

export default function App() {
  const [page, setPage] = useState(initialPage);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <NavBar page={page} onNav={setPage} />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={page}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -12 }}
          transition={{ duration: 0.32, ease: IOS_EASE }}
        >
          {renderPage(page, setPage)}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
