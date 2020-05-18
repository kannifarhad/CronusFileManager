export const LANG_CHANGE = 'LANG_CHANGE';
export const SET_TRANSLATION = 'SET_TRANSLATION';

export function langChange(lang) {
    return {
        lang,
        type:LANG_CHANGE
    }
}

export function getTranslations(data){
    return {
        data,
        type:SET_TRANSLATION
    }
}
