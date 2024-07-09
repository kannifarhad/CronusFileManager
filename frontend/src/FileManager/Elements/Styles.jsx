import { makeStyles } from '@mui/material/styles';

export default makeStyles(theme => ({
    root: {
     position:"relative",
    },
    table: {},
    container: {
      padding: '10px',
      minHeight: '400px',
      position:"relative",
      paddingBottom:"60px"
    },
    gridList: {},
    menu:{
    },
    menuItem:{
      padding:'9px 10px',
      fontSize:'12px',
      lineHeight: '12px',
      minWidth:'200px',
      '& span':{
        fontSize:'12px',
        padding:'0px 10px 0px 0px'
      }
    },
    trash: {
      width:'60px',
      height:'60px',
      backgroundPosition:'center center',
      left: '30px',
      bottom: '10px',
      position:'absolute',
      opacity:'0.8'
    },
    itemFile:{

    },
    itemTitle:{
    },
    checkbox:{
     
    },
    locked:{
     
    },
    extension:{

    },
    infoBox: {
   
    },
    loadingBlock: {
      position: 'absolute',
      zIndex: '55',
      top: '0px',
      left: '0px',
      width:"100%",
      height:"100%",
      '& .opaOverlaw':{
        opacity: '0.8',
        background:'#fff',
        position: 'absolute',
        width:"100%",
        height:"100%",
      }
    },
    messagesBox:{} 
  }));