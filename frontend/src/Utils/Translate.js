import React from "react";

function Translate(props){
    const {translations, children, replace } = props;
    const replaceArr = (typeof replace !== 'undefined') ? replace : [];
    const checkWord = (dictionary, word) => {
        try {
            return (typeof dictionary[word] !== 'undefined') ? dictionary[word]: word;
        } catch (error) {
            return word;
        }
    }

    const stringInject = (str, arr) => {
        if(arr.length > 0) {
            if (typeof str !== 'string' || !(arr instanceof Array)) {
                return false;
            }
             return str.replace(/(%\d)/g, function(i) {
                let index = parseInt(i.replace(/%/, ''))-1;
                return (typeof arr[index] != 'undefined') ? arr[index] : '';
             });
        } else {
            return str;
        }
       
    }
    
    return (
        <>
            {stringInject(checkWord(translations.data, children), replaceArr)}
        </>
    );
}
export default Translate;