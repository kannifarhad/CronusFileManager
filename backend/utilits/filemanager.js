/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2019, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
**/

function escapePath(path){
    return (typeof path !== 'undefined' && path !== '' && !path.includes('..') && !path.includes('./')) ? path : '/uploads/';
}

function checkExtension(extension){
    const allowedFiles = ['.jpg', '.png', '.gif', '.jpeg', '.svg','.doc','.txt', '.csv', '.docx', '.xls','.xml','.pdf','.zip', '.ppt','.mp4','.ai','.psd','.mp3','.avi',];
    return (extension !== '') ? ((allowedFiles.indexOf(extension) === -1) ? false : true) : true; 
}
function checkVariables(variables){ 
    var result = true;
    variables.forEach(element => {
        if(element === '' || element=== undefined){
            result = false;
        }
    });
    return result;
}

module.exports = {
    escapePath,
    checkExtension,
    checkVariables
}