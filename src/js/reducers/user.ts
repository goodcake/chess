export const initialState = {};

function userReducer(state = initialState, action: any) {
    //
    // if (action.type === ADD_POST) {
    //     return {...state,
    //         posts: [],
    //         visibility: 'private'
    //     };
    // }

    if (action.type === "GET_USER") {
        return {
            ...state,
            lang: action.payload
        };
    }
    return state;
}

export default userReducer;