import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from '../reducers';
import apiMiddleware from '../middleware/api';
import Config from '../../Data/Config';

import filemanager from './filemanager';
import dashboard from './dashboard';

let state = {
    filemanager,
    dashboard
};

const store = createStore(reducer, state, applyMiddleware(apiMiddleware(Config.serverPath), thunk, promise, logger));

export default store;
