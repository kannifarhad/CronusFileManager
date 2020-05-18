import axios from 'axios';

const apiMiddleware = apiUrl => store => next => action => {
    if (!action.request) {
        return next(action);
    }

    let REQUEST, SUCCESS, FAILURE;
    if (action.types) {
        [REQUEST, SUCCESS, FAILURE] = action.types;
    } else {
        REQUEST = `${action.type}_REQUEST`;
        SUCCESS = action.type;
        FAILURE = `${action.type}_FAILURE`;
    }

    next({ type: REQUEST });
        return axios({
            method: action.request.method,
            headers: { 
                'Content-Type': 'application/json',
                'cronustoken' : window.localStorage.getItem('jwtToken')
            },
            url: `${apiUrl}${action.request.url}`,
            data: action.body
        }).then(({ data }) => next({
                type: SUCCESS,
            data
        }))
    .catch(error => {
        next({
            type: FAILURE,
            error: error.response
        });
        let message = typeof error.response !== undefined ? error.response : error;
        throw message; 
    });
};

export default apiMiddleware;