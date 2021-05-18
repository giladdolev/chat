import React from 'react';

import Chat from './components/Chat';
import Join from './components/Join';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <RecoilRoot>
        <Route path="/" exact component={Join} />
        <Route path="/chat" component={Chat} />
      </RecoilRoot>
    </Router>
  );
}

export default App;
