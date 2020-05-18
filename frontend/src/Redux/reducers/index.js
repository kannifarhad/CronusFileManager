import { combineReducers } from 'redux';
import dashboardReducers from './dashboard';
import filemanagerReducers from './filemanager';

const reducer = combineReducers({
    dashboard: dashboardReducers,
    filemanager: filemanagerReducers
});

export default reducer;