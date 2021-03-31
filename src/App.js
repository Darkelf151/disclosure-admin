import './App.css';
import React from "react";
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware  } from "redux";
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import businessReducer from './store/reducers/business';
import adminReducer from './store/reducers/admin';
import clientReducer from './store/reducers/clients'

import AuthRoute from "./components/AuthRoute";
import Navbar from "./components/Navbar";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import ClientsScreen from "./screens/ClientsScreen/ClientsScreen";
import OffersScreen from "./screens/OffersScreen/OffersScreen";
import EditOffersScreen from "./screens/EditOffersScreen/EditOffersScreen";
import SystemScreen from "./screens/SystemScreen/SystemScreen";
import ForgottenPasswordScreen from "./screens/ForgottenPasswordScreen/ForgottenPasswordScreen";

const rootReducer = combineReducers( {
  auth: authReducer,
  business: businessReducer,
  admin: adminReducer,
  clients: clientReducer

})

const middleware = [
  ReduxThunk,
];

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(...middleware),
    // other store enhancers if any
));


//const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

function App() {
  return (
      <Provider store = {store}>
        <Router basename="/disclosure-admin">
          <Navbar/>
          <Switch>
            <AuthRoute path="/" exact component={ClientsScreen} type="private" index={Math.random()}/>
            <AuthRoute path="/clients" exact component={ClientsScreen} type="private" index={Math.random()}/>
            <AuthRoute path="/offers" exact component={OffersScreen} type="private" index={Math.random()}/>
            <AuthRoute path="/editoffer" exact component={EditOffersScreen} type="private" index={Math.random()}/>
            <AuthRoute path="/system" exact component={SystemScreen} type="private" index={Math.random()}/>
            <AuthRoute path="/login" type="guest">
              <LoginScreen />
            </AuthRoute>
            <AuthRoute path="/forgotten" type="guest">
              <ForgottenPasswordScreen />
            </AuthRoute>

          </Switch>
        </Router>
      </Provider>
  );
}

export default App;
