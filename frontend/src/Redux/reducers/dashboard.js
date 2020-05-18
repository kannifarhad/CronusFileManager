
import {LANG_CHANGE, SET_TRANSLATION}  from '../actions';

export default function reducer(state = {}, action){
    switch(action.type){
        case LANG_CHANGE:
            return {...state, lang: action.data};

        case SET_TRANSLATION:            
            return {...state, translations: action.data};

        default:
            return state;
    }
}