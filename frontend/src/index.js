import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './Redux/store';
// import Reload from './Components/Elements/Reload';
// import Preload from './Components/Elements/Preload';
//import {getConfigs, getLangList, getMenus, getTranslations} from './Redux/actions';
ReactDOM.render(<Provider store={store} >
                    <App  /> 
                </Provider>
                , document.getElementById("root"));





// function reload() {
//     ReactDOM.render(<Preload />, document.getElementById("root"));

//     store.dispatch(getConfigs()).then(response=> {
//         Promise.all([
//             store.dispatch(getTranslations(response.data.lang)).catch(error => { throw error;}),
//             store.dispatch(getMenus(response.data.lang)).catch(error => { throw error; }),
//             store.dispatch(getLangList()).catch(error => { throw error; })
//         ]).then(response => {
//             ReactDOM.render(
//                 <Provider store={store} >
//                     <App  /> 
//                 </Provider>
//                 , document.getElementById("root"));
//         }).catch(error => {
//             errorController(error);
//         });
//     }).catch(error => {
//         errorController(error);
//     });

// }

// function errorController(error){
//     console.log(error.message);
//     ReactDOM.render(<Reload reloadCall={reload} />,document.getElementById("root"));
// }

// reload();
