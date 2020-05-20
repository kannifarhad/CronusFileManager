import React from 'react';
import { connect } from 'react-redux';
import { getTranslations, langChange } from './Redux/actions';
import FileManager from './FileManager/FileManager';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
    root: {
    }
}));

function App(props){
    const classes = useStyles();

    if(props.translations.lang !== props.lang){
        import(`./Data/Languages/${props.lang}`)
        .then(result => {
            props.getTranslations({
                lang:props.lang,
                data: result.default
            });
        }).catch(e =>{
            props.getTranslations({
                lang:props.lang,
                data: {}
            });
        });
    }

    const handleCallBack = (filePath)=> {
        console.log('Image Path Returend', filePath);
    }

    return (
        <div className={classes.root} >
            <FileManager height='580' callback={handleCallBack} />
        </div>
    );

}

const mapStateToProps = store => ({
    store,
    translations : store.dashboard.translations,
    lang : store.dashboard.lang,
});

const mapDispatchToProps = dispatch => ({
    langChange: (lang) => dispatch(langChange(lang)),
    getTranslations: (data) => dispatch(getTranslations(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);