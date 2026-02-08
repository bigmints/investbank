import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppLayout from './layouts/AppLayout';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Invest = React.lazy(() => import('./pages/Invest'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ChatGreeting = React.lazy(() => import('./pages/ChatGreeting'));
const Chat = React.lazy(() => import('./pages/Chat'));
const FamilyCircle = React.lazy(() => import('./pages/FamilyCircle'));

// Wrapper to handle AnimatePresence location
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat-greeting" element={<ChatGreeting />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/family-circle" element={<FamilyCircle />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/investbank">
      <React.Suspense fallback={<div className="flex items-center justify-center h-screen bg-bg-app">Loading...</div>}>
        <AnimatedRoutes />
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
