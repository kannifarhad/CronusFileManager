import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    root: {
     position:"relative",
    },
    table: {
      padding:"0px",
    },
    tableCell: {
      padding:"0px",
    },
    tableListRow:{
      '&:hover td, &.selectmodeTable td': {
        background:'#f1f1f1',
      },
      '&.selected td': {
        background:'#e0f0fb',
      }
    },
    tableHead: {
      '& th': {
        background:"#0492f2",
        color:"#fff",
        padding:'10px 0px 10px 0px',
        fontSize: "13px",
        lineHeight: "19px",
        fontWeight: "700"
      },
      '& th:first-child': {
        borderRadius:'5px 0px 0px 0px'
      },
      '& th:last-child': {
        borderRadius:'0px 5px 0px 0px'
      }
    },
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
      margin:'5px',
      padding: '10px',
      width: '100px',
      position: 'relative',
      borderRadius: "5px",
      verticalAlign: 'top',
      display: 'inline-block',
      maxHeight:'100px',
      '&.fileCuted': {
        opacity:'0.5'
      },
      '&.notDragging': {
        transform:'translate(0px, 0px) !important',
      },
      '&:hover, &.selectmode': {
        background:'#f1f1f1',
        '& .MuiCheckbox-root':{
          display: 'block !important'
        }
      },
      '&.selected': {
        background:'#e0f0fb',
        '& .MuiCheckbox-root':{
          display: 'block !important'
        }
      },
    },
    itemTitle:{
      fontSize:'12px',
      textAlign: 'center',
      '& span':{
        textAlign: "center",
        maxHeight: "2.4em",
        lineHeight: "1.2em",
        whiteSpace: "pre-line",
        overflow: "hidden",
        textOverflow: "ellipsis",
        margin: "3px 1px 0",
        padding: "1px",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        display: "-webkit-box",
        "-webkit-line-clamp": "2",
        "-webkit-box-orient": "vertical"
      },
      '& :hover': {
        background: ''
      }
    },
    checkbox:{
      position: 'absolute',
      top:'0px',
      left: '0px',
      padding: '0px',
      display: 'none'
    },
    locked:{
      position: 'absolute',
      right: '0',
      top: '0',
      borderRadius: '3px',
      fontSize: '12px',
      background:'#ffa600',
      color: '#fff',
      padding:'5px'
    },
    extension:{
      position: 'absolute',
      left: '0',
      top: '45px',
      borderRadius: '3px',
      fontSize: '9px',
      background:'#ccc',
      color: '#fff',
      padding:'1px 5px'
    },
    infoBox: {
      width:'100%',
      height: '50px',
      overflow: 'hidden',
      borderRadius: '3px',
      '& img':{
        minWidth:'100%',
        maxHeight:'50px',
        margin: '0px auto',
        display: 'block'
      }
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
    messagesBox:{
      zIndex: '66',
      position:'absolute',
      top:'20px',
      right:'20px',
      width:'300px',
      float:'right'
    },
    dialogDescription: {
      '& .list':{
        textAlign: "left"
      },
      '& img':{
        maxWidth: "100%",
        display: 'block'
      }
    }
  }));