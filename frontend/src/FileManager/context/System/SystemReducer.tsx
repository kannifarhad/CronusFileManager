import { SystemActionTypes } from "../../types";
import type { FileManagerAction, SystemStateType } from "../../types";

export const systemReducer = (state: SystemStateType, action: FileManagerAction): SystemStateType => {
  switch (action.type) {
    case SystemActionTypes.SET_MESSAGES:
      return { ...state, messages: [...state.messages, action.payload] };

    case SystemActionTypes.REMOVE_MESSAGES:
      return {
        ...state,
        messages: state.messages.filter((message) => message.id !== action.payload.id),
      };

    case SystemActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case SystemActionTypes.SET_SELECTED_VOLUME: {
      // If selected volume had been changed then we need to reset rest of the data as well beside volumesList
      const selectedVolume = state.volumesList.find((vol) => vol.id === action.payload.id);
      if (selectedVolume && selectedVolume.id !== state.selectedVolume?.id) {
        const newState = {
          ...state,
          selectedVolume: action.payload,
        };
        return newState;
      }
      return state;
    }

    default:
      return state;
  }
};

export default systemReducer;
