import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import Account from './auth/account.routes';
import Home from './auth/home.routes';
import Class from './auth/class.routes';
import Live from './auth/live.routes';
import Book from './auth/book.routes';

import Quiz from './quiz.routes';

const AuthRoutes: React.FC = () => {
  const routes = Home.concat(Account, Class, Live, Quiz, Book);

  return (
    <BrowserRouter>
      <Switch>
        <Route path={`/home`}>
          <Redirect to="/" />
        </Route>
        <Route path={`/login`}>
          <Redirect to="/" />
        </Route>

        {routes.map((entry) => (
          <Route key={entry.path} exact {...entry} />
        ))}
      </Switch>
    </BrowserRouter>
  );
};

export default AuthRoutes;
