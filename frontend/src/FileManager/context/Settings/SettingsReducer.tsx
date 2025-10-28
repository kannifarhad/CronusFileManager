import { LOCASTORAGE_SETTINGS_KEY } from "../../config";
import { writeJsonToLocalStorage } from "../../utils";
import { SettingsActionTypes } from "../../types";
import type { FileManagerAction, SettingsStateType } from "../../types";

export const settingsReducer = (state: SettingsStateType, action: FileManagerAction): SettingsStateType => {
  switch (action.type) {
    case SettingsActionTypes.SET_IMAGE_SETTINGS: {
      const settings = { ...state, showImages: action.payload };
      writeJsonToLocalStorage(LOCASTORAGE_SETTINGS_KEY, settings);
      return settings;
    }

    case SettingsActionTypes.SET_SELECTED_THEME: {
      const settings = { ...state, selectedTheme: action.payload };
      writeJsonToLocalStorage(LOCASTORAGE_SETTINGS_KEY, settings);
      return settings;
    }

    case SettingsActionTypes.SET_SORT_ORDER_BY: {
      const settings = {
        ...state,
        orderFiles: {
          field: action.payload.field,
          orderBy: action.payload.orderBy,
        },
      };
      writeJsonToLocalStorage(LOCASTORAGE_SETTINGS_KEY, settings);
      return settings;
    }

    case SettingsActionTypes.SET_ITEM_VIEW: {
      const settings = { ...state, itemsViewType: action.payload };
      writeJsonToLocalStorage(LOCASTORAGE_SETTINGS_KEY, settings);
      return settings;
    }

    default:
      return state;
  }
};

export default settingsReducer;
