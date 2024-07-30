import { styled } from '@mui/system';

// Styled ImageEditor Container
export const ImageEditorContainer = styled('div')(({ theme }) => ({
  '& .tui-image-editor-container' : {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    minHeight: '300px',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    letterSpacing: '0.3px',
  },
  '& .tui-image-editor-container div, & .tui-image-editor-container ul, & .tui-image-editor-container label, & .tui-image-editor-container input, & .tui-image-editor-container li' : {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    // -ms-user-select: 'none',
    // -moz-user-select: -moz-'none',
    // -khtml-user-select: 'none',
    // -webkit-user-select: 'none',
    userSelect: 'none',
  },
  '& .tui-image-editor-container .tui-image-editor-header ' : {
  /* BUTTON AND LOGO */
    minWidth: '533px',
    position: 'absolute',
    top: 0,
    width: '100%',
    display: 'none !important',
  },
  '& .tui-image-editor-container .tui-image-editor-header-buttons, & .tui-image-editor-container .tui-image-editor-controls-buttons': {
    float: 'right',
    margin: '8px',
  },
  '& .tui-image-editor-container .tui-image-editor-header-logo, & .tui-image-editor-container .tui-image-editor-controls-logo' : {
    float: 'left',
    width: '30%',
    padding: '17px',
  },
  '& .tui-image-editor-container .tui-image-editor-controls-logo, & .tui-image-editor-container .tui-image-editor-controls-buttons' : {
    width: '270px',
    height: '100%',
    display: 'none',
  },
  '& .tui-image-editor-container .tui-image-editor-header-buttons button, & .tui-image-editor-container .tui-image-editor-header-buttons div, & .tui-image-editor-container .tui-image-editor-controls-buttons button, & .tui-image-editor-container .tui-image-editor-controls-buttons div' : {
    display: 'inline-block',
    position: 'relative',
    width: '120px',
    height: '40px',
    padding: '0',
    lineHeight: '40px',
    outline: 'none',
    borderRadius: '20px',
    border: '1px solid #ddd',
    fontFamily: "'Noto Sans', sans-serif",
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    verticalAlign: 'middle',
    letterSpacing: '0.3px',
    textAlign: 'center',
  },
  '& .tui-image-editor-container .tui-image-editor-download-btn' : {
    backgroundColor: '#fdba3b',
    borderColor: '#fdba3b',
    color: '#fff',
  },
  '& .tui-image-editor-container .tui-image-editor-load-btn' : {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'inline-block',
    top: 0,
    bottom: 0,
    width: '100%',
    cursor: 'pointer',
    opacity: 0,
  },
  '& .tui-image-editor-container .tui-image-editor-main-container' : {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: '64px',
    borderRadius: '5px 5px 0px 0px',
    border: '1px solid #E9eef9 !important',
    borderBottom: 'none !important',
  },
  '& .tui-image-editor-container .tui-image-editor-main' : {
    position: 'absolute',
    textAlign: 'center',
    top: '0px',
    bottom: 0,
    right: 0,
    left: 0,
  },
  '& .tui-image-editor-container .tui-image-editor-wrap' : {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    overflow: 'auto',
  },
  '& .tui-image-editor-container .tui-image-editor-wrap .tui-image-editor-size-wrap' : {
    display: 'table',
    width: '100%',
    height: '100%',
  },
  '& .tui-image-editor-container .tui-image-editor-wrap .tui-image-editor-size-wrap .tui-image-editor-align-wrap' : {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  '& .tui-image-editor-container .tui-image-editor' : {
    position: 'relative',
    display: 'inline-block',
  },
  '& .tui-image-editor-container .tui-image-editor-menu' : {
    width: 'auto',
    listStyle: 'none',
    padding: 0,
    margin: '0 auto',
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  },
  '& .tui-image-editor-container .tui-image-editor-menu > .tui-image-editor-item' : {
    position: 'relative',
    display: 'inline-block',
    borderRadius: '2px',
    padding: '7px 8px 7px 8px',
    cursor: 'pointer',
    margin: '0 4px',
    verticalAlign: 'middle',
  },
  '& .tui-image-editor-container .tui-image-editor-menu > .tui-image-editor-item[tooltip-content]:hover:before' : {
    content: '""',
    position: 'absolute',
    display: 'inline-block',
    margin: '0 auto 0',
    width: 0,
    height: 0,
    borderRight: '7px solid transparent',
    borderTop: '7px solid #2f2f2f',
    borderLeft: '7px solid transparent',
    left: '13px',
    top: '-2px',
  },
  '& .tui-image-editor-container .tui-image-editor-menu > .tui-image-editor-item[tooltip-content]:hover:after' : {
    content: 'attr(tooltip-content)',
    position: 'absolute',
    display: 'inline-block',
    backgroundColor: '#2f2f2f',
    color: '#fff',
    padding: '5px 8px',
    fontSize: '11px',
    fontWeight: 'lighter',
    borderRadius: '3px',
    maxHeight: '23px',
    top: '-25px',
    left: 0,
    minWidth: '24px',
  },
  '& .tui-image-editor-container .tui-image-editor-menu > .tui-image-editor-item.active' : {
    backgroundColor: '#fff',
    transition: 'all 0.3s ease',
  },
  '& .tui-image-editor-container .tui-image-editor-grid-visual' : {
    display: 'none',
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '1px solid rgba(255,255,255,0.7)',
  },
  '& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-flip .tui-image-editor, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-rotate .tui-image-editor' : {
    transition: 'none',
  },
  '& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-flip .tui-image-editor-grid-visual, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-rotate .tui-image-editor-grid-visual' : {
    display: 'block',
  },
  '& .tui-image-editor-container .tui-image-editor-grid-visual table' : {
    width: '100%',
    height: '100%',
    borderCollapse: 'collapse',
  },
  '& .tui-image-editor-container .tui-image-editor-grid-visual table td' : {
    border: '1px solid rgba(255,255,255,0.3)',
  },
  '& .tui-image-editor-container .tui-image-editor-grid-visual table td.dot:before' : {
    content: '""',
    position: 'absolute',
    boxSizing: 'border-box',
    width: '10px',
    height: '10px',
    border: 0,
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.3)',
    borderRadius: '100%',
    backgroundColor: '#fff',
  },
  '& .tui-image-editor-container .tui-image-editor-grid-visual table td.dot.left-top:before' : {
    top: '-5px',
    left: '-5px',
  },
  '& .tui-image-editor-container .tui-image-editor-grid-visual table td.dot.right-top:before' : {
    top: '-5px',
    right: '-5px',
  },
  '& .tui-image-editor-container .tui-image-editor-grid-visual table td.dot.left-bottom:before' : {
    bottom: '-5px',
    left: '-5px',
  },
  '& .tui-image-editor-container .tui-image-editor-grid-visual table td.dot.right-bottom:before' : {
    bottom: '-5px',
    right: '-5px',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu' : {
    display: 'none',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '150px',
    /* whiteSpace: nowrap, */
    zIndex: 2,
  },
  '& .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-button:hover svg > use.active' : {
    display: 'block',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-submenu-item' : {
    background: 'rgba(239, 244, 247, 0.9)',
    padding: '20px 0px 20px 0px',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-submenu-item li' : {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-submenu-item .tui-image-editor-newline' : {
    display: 'block',
    marginTop: 0,
  },
  '& .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-submenu-item .tui-image-editor-button' : {
    position: 'relative',
    cursor: 'pointer',
    display: 'inline-block',
    fontWeight: 'normal',
    fontSize: '11px',
    margin: '0 9px 0 9px',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-submenu-item .tui-image-editor-button.preset' : {
    margin: '0 9px 20px 5px',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-submenu-item label > span' : {
    display: 'inline-block',
    cursor: 'pointer',
    paddingTop: '5px',
    fontFamily: '"Noto Sans", sans-serif',
    fontSize: '11px',
    color:'#000',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-submenu-item .tui-image-editor-button.apply label & .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-submenu-item .tui-image-editor-button.cancel label' : {
    verticalAlign:'middle',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu > div' : {
    display: 'none',
    verticalAlign: 'bottom',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu .tui-image-editor-submenu-style' : {
    opacity: '0.95',
    zIndex: '-1',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'block',
  },
  '& .tui-image-editor-container .tui-image-editor-partition > div' : {
    width: '1px',
    height: '52px',
    borderLeft: '1px solid #3c3c3c',
    margin:' 0 8px 0 8px',
  },
  '& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-filter .tui-image-editor-partition > div' : {
    height: '108px',
    margin: '0 29px 0 0px',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu-align' : {
    textAlign: 'left',
    marginRight: '30px',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu-align label > span' : {
    width: '55px',
    whiteSpace: 'nowrap',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu-align:first-child' : {
    marginRight: 0,
  },
  '& .tui-image-editor-container .tui-image-editor-submenu-align:first-child label > span' : {
    width: '70px',
  },
  '& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-crop .tui-image-editor-submenu > div.tui-image-editor-menu-crop,& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-flip .tui-image-editor-submenu > div.tui-image-editor-menu-flip,& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-rotate .tui-image-editor-submenu > div.tui-image-editor-menu-rotate,& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-shape .tui-image-editor-submenu > div.tui-image-editor-menu-shape,& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-text .tui-image-editor-submenu > div.tui-image-editor-menu-text,& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-mask .tui-image-editor-submenu > div.tui-image-editor-menu-mask,& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-icon .tui-image-editor-submenu > div.tui-image-editor-menu-icon,& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-draw .tui-image-editor-submenu > div.tui-image-editor-menu-draw,& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-filter .tui-image-editor-submenu > div.tui-image-editor-menu-filter' : {
    display: 'table-cell',
  },
  '& .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-crop .tui-image-editor-submenu, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-flip .tui-image-editor-submenu, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-rotate .tui-image-editor-submenu, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-shape .tui-image-editor-submenu, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-text .tui-image-editor-submenu, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-mask .tui-image-editor-submenu, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-icon .tui-image-editor-submenu, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-draw .tui-image-editor-submenu, & .tui-image-editor-container .tui-image-editor-main.tui-image-editor-menu-filter .tui-image-editor-submenu' : {
    display: 'table',
  },
  '& .tui-image-editor-container .filter-color-item' : {
    display: 'inline-block',
  },
  '& .tui-image-editor-container .filter-color-item .tui-image-editor-checkbox' : {
    display: 'block',
    marginTop: 0,
  },
  '& .tui-image-editor-container .tui-image-editor-checkbox-wrap' : {
    display: 'inline-block !important',
    textAlign: 'left',
  },
  '& .tui-image-editor-container .tui-image-editor-checkbox-wrap.fixed-width' : {
    width: '187px',
    whiteSpace: 'normal',
  },
  '& .tui-image-editor-container .tui-image-editor-checkbox' : {
    display: 'inline-block',
    margin: '1px 0 1px 0',
  },
  '& .tui-image-editor-container .tui-image-editor-checkbox input' : {
    width: '14px',
    height: '14px',
    opacity: 0,
  },
  '& .tui-image-editor-container .tui-image-editor-checkbox > label > span' : {
    color: '#fff',
    height: '14px',
    position: 'relative',
  },
  '& .tui-image-editor-container .tui-image-editor-checkbox input + label:before, & .tui-image-editor-container .tui-image-editor-checkbox > label > span:before' : {
    content: '""',
    position: 'absolute',
    width: '14px',
    height: '14px',
    backgroundColor: '#fff',
    top: '6px',
    left: '-19px',
    display: 'inline-block',
    margin: 0,
    textAlign: 'center',
    fontSize: '11px',
    border: 0,
    borderRadius: '2px',
    paddingTop: '1px',
    boxSizing: 'border-box',
  },
  '& .tui-image-editor-container .tui-image-editor-checkbox input[type="checkbox"]:checked + span:before' : {
    backgroundSize: 'cover',
    backgroundColor:'#f00',
    backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAMBJREFUKBWVkjEOwjAMRe2WgZW7IIHEDdhghhuwcQ42rlJugAQS54Cxa5cq1QM5TUpByZfS2j9+dlJVt/tX5ZxbS4ZU9VLkQvSHKTIGRaVJYFmKrBbTCJxE2UgCdDzMZDkHrOV6b95V0US6UmgKodujEZbJg0B0ZgEModO5lrY1TMQf1TpyJGBEjD+E2NPN7ukIUDiF/BfEXgRiGEw8NgkffYGYwCi808fpn/6OvfUfsDr/Vc1IfRf8sKnFVqeiVQfDu0tf/nWH9gAAAABJRU5ErkJggg==)',

  },
  '& .tui-image-editor-container .tui-image-editor-selectlist-wrap' : {
    position: 'relative',
  },
  '& .tui-image-editor-container .tui-image-editor-selectlist-wrap select' : {
    width: '100%',
    height: '28px',
    marginTop: '4px',
    outline: 0,
    borderRadius: 0,
    border: '1px solid #cbdbdb',
    backgroundColor: '#fff',
    // -webkit-appearance: 'none',
    // -moz-appearance: 'none',
    appearance: 'none',
    padding: '0 7px 0 10px',
  },
  '& .tui-image-editor-container .tui-image-editor-selectlist-wrap .tui-image-editor-selectlist' : {
    display: 'none',
    position: 'relative',
    top: '-1px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    borderTop: '0px',
    padding: '4px 0',
  },
  '& .tui-image-editor-container .tui-image-editor-selectlist-wrap .tui-image-editor-selectlist li' : {
    display: 'block',
    textAlign: 'left',
    padding: '7px 10px',
    fontFamily:" 'Noto Sans', sans-serif",
  },
  '& .tui-image-editor-container .tui-image-editor-selectlist-wrap .tui-image-editor-selectlist li:hover' : {
    backgroundColor: 'rgba(81,92,230,0.05)',
  },
  '& .tui-image-editor-container .tui-image-editor-selectlist-wrap:before' : {
    content: '""',
    position: 'absolute',
    display: 'inline-block',
    width: '14px',
    height: '14px',
    right: '5px',
    top: '10px',
    backgroundImage: 'url(data:image/png,base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAHlJREFUKBVjYBgFOEOAEVkmPDxc89+/f6eAYjzI4kD2FyYmJrOVK1deh4kzwRggGiQBVJCELAZig8SQNYHEmEEEMrh69eo1HR0dfqCYJUickZGxf9WqVf3IakBsFBthklpaWmVA9mEQhrJhUoTp0NBQCRAmrHL4qgAAuu4cWZOZIGsAAAAASUVORK5CYII=)',
    backgroundSize: 'cover',
  },
  '& .tui-image-editor-container .tui-image-editor-selectlist-wrap select::-ms-expand' : {
    display: 'none',
  },
  '& .tui-image-editor-container .tui-image-editor-virtual-range-bar .tui-image-editor-disabled, & .tui-image-editor-container .tui-image-editor-virtual-range-subbar .tui-image-editor-disabled, & .tui-image-editor-container .tui-image-editor-virtual-range-pointer .tui-image-editor-disabled' : {
    backbroundColor: '#f00',
  },
  '& .tui-image-editor-container .tui-image-editor-range' : {
    position: 'relative',
    top: '5px',
    width: '166px',
    height: '17px',
    display: 'inline-block',
  },
  '& .tui-image-editor-container .tui-image-editor-virtual-range-bar' : {
    top: '7px',
    position: 'absolute',
    width: '100%',
    height: '2px',
    backgroundColor: '#666',
  },
  '& .tui-image-editor-container .tui-image-editor-virtual-range-subbar' : {
    position: 'absolute',
    height: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#d1d1d1',
  },
  '& .tui-image-editor-container .tui-image-editor-virtual-range-pointer' : {
    position: 'absolute',
    cursor: 'pointer',
    top: '-5px',
    left: 0,
    width: '12px',
    height: '12px',
    backgroundColor: '#fff',
    borderRadius: '100%',
  },
  '& .tui-image-editor-container .tui-image-editor-range-wrap' : {
    display: 'inline-block',
    marginLeft: '4px',
  },
  '& .tui-image-editor-container .tui-image-editor-range-wrap.short .tui-image-editor-range' : {
    width: '100px',
  },
  '& .tui-image-editor-container .color-picker-control .tui-image-editor-range' : {
    width: '108px',
    marginLeft: '10px',
  },
  '& .tui-image-editor-container .color-picker-control .tui-image-editor-virtual-range-pointer' : {
    backgroundColor: '#333',
  },
  '& .tui-image-editor-container .color-picker-control .tui-image-editor-virtual-range-bar' : {
    backgroundColor: '#ccc',
  },
  '& .tui-image-editor-container .color-picker-control .tui-image-editor-virtual-range-subbar' : {
    backgroundColor: '#606060',
  },
  '& .tui-image-editor-container .tui-image-editor-range-wrap.tui-image-editor-newline.short' : {
    marginTop: '-2px',
    marginLeft: '19px',
  },
  '& .tui-image-editor-container .tui-image-editor-range-wrap.tui-image-editor-newline.short label' : {
    color: '#8e8e8e',
    fontWeight: 'normal',
  },
  '& .tui-image-editor-container .tui-image-editor-range-wrap label' : {
    verticalAlign: 'baseline',
    fontSize: '11px',
    marginRight: '7px',
    color: '#fff',
  },
  '& .tui-image-editor-container .tui-image-editor-range-value' : {
    cursor: 'default',
    width: '40px',
    height: '24px',
    outline: 'none',
    borderRadius: '2px',
    boxShadow: 'none',
    border: '1px solid #d5d5d5',
    textAlign: 'center',
    backgroundColor: '#1c1c1c',
    color: '#fff',
    fontWeight: 'lighter',
    verticalAlign: 'baseline',
    fontFamily: "'Noto Sans', sans-serif",
    marginTop: '21px',
    marginLeft: '4px',
  },
  '& .tui-image-editor-container .tui-image-editor-controls' : {
    position: 'absolute',
    backgroundColor: '#0492f2',
    width: '100%',
    height: '64px',
    display: 'table',
    bottom: 0,
    zIndex: 2,
  },
  '& .tui-image-editor-container .tui-image-editor-icpartition' : {
    display: 'inline-block',
    backgroundColor: '#0f76bb',
    width: '1px',
    height: '24px',
    verticalAlign: 'middle',
  },
  '& .tui-image-editor-container.left .tui-image-editor-menu > .tui-image-editor-item[tooltip-content]:before' : {
    left: '28px',
    top: '11px',
    borderRight: '7px solid #2f2f2f',
    borderTop: '7px solid transparent',
    borderBottom: '7px solid transparent',
  },
  '& .tui-image-editor-container.left .tui-image-editor-menu > .tui-image-editor-item[tooltip-content]:after' : {
    top: '7px',
    left: '42px',
    whiteSpace: 'nowrap',
  },
  '& .tui-image-editor-container.left .tui-image-editor-submenu' : {
    left: 0,
    height: '100%',
    width: '248px',
  },
  '& .tui-image-editor-container.left .tui-image-editor-main-container' : {
    left: '64px',
    width: 'calc(100% - 64px)',
    height: '100%',
  },
  '& .tui-image-editor-container.left .tui-image-editor-controls' : {
    width: '64px',
    height: '100%',
    display: 'table',
  },
  '& .tui-image-editor-container.left .tui-image-editor-menu, & .tui-image-editor-container.right .tui-image-editor-menu' : {
    whiteSpace: 'inherit',
  },
  '& .tui-image-editor-container.left .tui-image-editor-submenu, & .tui-image-editor-container.right .tui-image-editor-submenu' : {
    whiteSpace: 'normal',
  },
  '& .tui-image-editor-container.left .tui-image-editor-submenu > div, & .tui-image-editor-container.right .tui-image-editor-submenu > div' : {
    verticalAlign: 'middle',
  },
  '& .tui-image-editor-container.left .tui-image-editor-controls li, & .tui-image-editor-container.right .tui-image-editor-controls li' : {
    display: 'inline-block',
    margin: '4px auto',
  },
  '& .tui-image-editor-container.left .tui-image-editor-icpartition, & .tui-image-editor-container.right .tui-image-editor-icpartition' : {
    position: 'relative',
    top: '-7px',
    width: '24px',
    height: '1px',
  },
  '& .tui-image-editor-container.left .tui-image-editor-submenu .tui-image-editor-partition, & .tui-image-editor-container.right .tui-image-editor-submenu .tui-image-editor-partition' : {
    display: 'block',
    width: '75%',
    margin: 'auto',
  },
  '& .tui-image-editor-container.left .tui-image-editor-submenu .tui-image-editor-partition > div, & .tui-image-editor-container.right .tui-image-editor-submenu .tui-image-editor-partition > div' : {
    borderLeft: 0,
    height: '10px',
    borderBottom: '1px solid #3c3c3c',
    width: '100%',
    margin: 0,
  },
  '& .tui-image-editor-container.left .tui-image-editor-submenu .tui-image-editor-submenu-align, & .tui-image-editor-container.right .tui-image-editor-submenu .tui-image-editor-submenu-align' : {
    marginRight: 0,
  },
  '& .tui-image-editor-container.left .tui-image-editor-submenu .tui-image-editor-submenu-item li, & .tui-image-editor-container.right .tui-image-editor-submenu .tui-image-editor-submenu-item li' : {
    marginTop: '15px',
  },
  '& .tui-image-editor-container.left .tui-image-editor-submenu .tui-image-editor-submenu-item .tui-colorpicker-clearfix li, & .tui-image-editor-container.right .tui-image-editor-submenu .tui-image-editor-submenu-item .tui-colorpicker-clearfix li' : {
    marginTop: 0,
  },
  '& .tui-image-editor-container.left .tui-image-editor-checkbox-wrap.fixed-width, & .tui-image-editor-container.right .tui-image-editor-checkbox-wrap.fixed-width' : {
    width: '182px',
    whiteSpace: 'normal',
  },
  '& .tui-image-editor-container.left .tui-image-editor-range-wrap.tui-image-editor-newline label.range, & .tui-image-editor-container.right .tui-image-editor-range-wrap.tui-image-editor-newline label.range' : {
    display: 'block',
    textAlign: 'left',
    width: '75%',
    margin: 'auto',
  },
  '& .tui-image-editor-container.left .tui-image-editor-range, & .tui-image-editor-container.right .tui-image-editor-range' : {
    width: '136px',
  },
  '& .tui-image-editor-container.right .tui-image-editor-menu > .tui-image-editor-item[tooltip-content]:before' : {
    left: '-3px',
    top: '11px',
    borderLeft: '7px solid #2f2f2f',
    borderTop: '7px solid transparent',
    borderBottom: '7px solid transparent',
  },
  '& .tui-image-editor-container.right .tui-image-editor-menu > .tui-image-editor-item[tooltip-content]:after' : {
    top: '7px',
    left: 'unset',
    right: '43px',
    whiteSpace: 'nowrap',
  },
  '& .tui-image-editor-container.right .tui-image-editor-submenu' : {
    right: 0,
    height: '100%',
    width: '248px',
  },
  '& .tui-image-editor-container.right .tui-image-editor-main-container' : {
    right: '64px',
    width: 'calc(100% - 64px)',
    height: '100%',
  },
  '& .tui-image-editor-container.right .tui-image-editor-controls' : {
    right: 0,
    width: '64px',
    height: '100%',
    display: 'table',
  },
  '& .tui-image-editor-container.top .tui-image-editor-submenu .tui-image-editor-partition.only-left-right, & .tui-image-editor-container.bottom .tui-image-editor-submenu .tui-image-editor-partition.only-left-right' : {
    display: 'none',
  },
  '& .tui-image-editor-container.bottom .tui-image-editor-submenu > div' : {
    paddingBottom: '0px',
  },
  '& .tui-image-editor-container.top .color-picker-control .triangle' : {
    top: '-8px',
    borderRight: '7px solid transparent',
    borderTop: '0px',
    borderLeft: '7px solid transparent',
    borderBottom: '8px solid #fff',
  },
  '& .tui-image-editor-container.top .tui-image-editor-size-wrap' : {
    height: '100%',
  },
  '& .tui-image-editor-container.top .tui-image-editor-main-container' : {
    bottom: 0,
  },
  '& .tui-image-editor-container.top .tui-image-editor-menu > .tui-image-editor-item[tooltip-content]:before' : {
    left: '13px',
    borderTop: 0,
    borderBottom: '7px solid #2f2f2f',
    top: '33px',
  },
  '& .tui-image-editor-container.top .tui-image-editor-menu > .tui-image-editor-item[tooltip-content]:after' : {
    top: '38px',
  },
  '& .tui-image-editor-container.top .tui-image-editor-submenu' : {
    top: 0,
    bottom: 'auto',
  },
  '& .tui-image-editor-container.top .tui-image-editor-submenu > div' : {
    paddingTop: '24px',
    verticalAlign: 'top',
  },
  '& .tui-image-editor-container.top .tui-image-editor-controls-logo' : {
    display: 'table-cell',
  },
  '& .tui-image-editor-container.top .tui-image-editor-controls-buttons' : {
    display: 'table-cell',
  },
  '& .tui-image-editor-container.top .tui-image-editor-main' : {
    top: '64px',
    height: 'calc(100% - 64px)',
  },
  '& .tui-image-editor-container.top .tui-image-editor-controls' : {
    top: 0,
    bottom: 'inherit',
  },
  '& .tui-image-editor-container .tie-icon-add-button .tui-image-editor-button' : {
    minWidth: '42px',
  },
  '& .tui-image-editor-container .svg_ic-menu, & .tui-image-editor-container .svg_ic-helpmenu' : {
    width: '24px',
    height: '24px',
  },
  '& .tui-image-editor-container .svg_ic-submenu' : {
    width: '32px',
    height: '32px',
  },
  '& .tui-image-editor-container .svg_img-bi' : {
    width: '257px',
    height: '26px',
  },
  '& .tui-image-editor-container .tui-image-editor-controls svg > use' : {
    display: 'none',
  },
  '& .tui-image-editor-container .tui-image-editor-controls .enabled svg:hover > use.hover, & .tui-image-editor-container .tui-image-editor-controls .normal svg:hover > use.hover' : {
    display: 'block',
  },
  '& .tui-image-editor-container .tui-image-editor-controls .active svg:hover > use.hover' : {
    display: 'none',
  },
  '& .tui-image-editor-container .tui-image-editor-controls svg > use.normal' : {
    display: 'block',
  },
  '& .tui-image-editor-container .tui-image-editor-controls .active svg > use.active' : {
    display: 'block',
  },
  '& .tui-image-editor-container .tui-image-editor-controls .enabled svg > use.enabled' : {
    display: 'block',
  },
  '& .tui-image-editor-container .tui-image-editor-controls .active svg > use.normal, & .tui-image-editor-container .tui-image-editor-controls .enabled svg > use.normal' : {
    display: 'none',
  },
  '& .tui-image-editor-container .tui-image-editor-controls .help svg > use.disabled, & .tui-image-editor-container .tui-image-editor-controls .help.enabled svg > use.normal' : {
    display: 'block',
  },
  '& .tui-image-editor-container .tui-image-editor-controls .help.enabled svg > use.disabled' : {
    display: 'none',
  },
  '& .tui-image-editor-container .tui-image-editor-controls:hover' : {
    zIndex: 3,
  },
  '& .tui-image-editor-container div.tui-colorpicker-clearfix' : {
    width: '159px',
    height: '28px',
    border: '1px solid #d5d5d5',
    borderRadius: '2px',
    backgroundColor: '#f5f5f5',
    marginTop: '6px',
    padding: '4px 7px 4px 7px',
  },
  '& .tui-image-editor-container .tui-colorpicker-palette-hex' : {
    width: '114px',
    backgroundColor: '#f5f5f5',
    border: 0,
    fontSize: '11px',
    marginTop: '2px',
    fontFamily: "'Noto Sans', sans-serif",
  },
  '& .tui-image-editor-container .tui-colorpicker-palette-hex[value="#ffffff"] + .tui-colorpicker-palette-preview, & .tui-image-editor-container .tui-colorpicker-palette-hex[value=""] + .tui-colorpicker-palette-preview' : {
    border: '1px solid #ccc',
  },
  '& .tui-image-editor-container .tui-colorpicker-palette-hex[value=""] + .tui-colorpicker-palette-preview' : {
    backgroundSize: 'cover',
    backgroundImage: 'url(data:image/png,base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAdBJREFUWAnFl0FuwjAQRZ0ukiugHqFSOQNdseuKW3ALzkA4BateICvUGyCxrtRFd4WuunH/TzykaYJrnLEYaTJJsP2+x8GZZCbQrLU5mj7Bn+EP8HvnCObd+R7xBV5lWfaNON4AnsA38E94qLEt+0yiFaBzAV/Bv+Cxxr4co7hKCDpw1q9wLeNYYdlAwyn8TYt8Hme3+8D5ozcTaMCZ68PXa2tnM2sbEcOZAJhrrpl2DAcTOGNjZPSfCdzkw6JrfbiMv+osBe4y9WOedhm4jZfhbENWuxS44H9Wz/xw4WzqLOAqh1+zycgAwzEMzr5k5gaHOa9ULBwuuDkFlHI1Kl4PJ66kgIpnoywOTmRFAYcbwYk9UMApWkD8zAV5ihcwHk4Rx7gl0IFTQL0EFc+CTQ9OZHWH3YhlVJiVpTHbrTGLhTHLZVgff6s9lyBsI9KduSS83oj+34rTwJutmBmCnMsvozRwZqB5GTkBw6/jdPDu69iJ6BYk6eCcfbcgcQIK/MByaaiMqm8rHcjol2TnpWDhyAKSGdA3FrxtJUToX0ODqatetfGE+8tyEUOV8GY5dGRwLP/MBS4RHQr4bT7NRAQjlcOTfZxmv2G+c4hI8nn+Ax5PG/zhI393AAAAAElFTkSuQmCC)',
  },
  '& .tui-image-editor-container .tui-colorpicker-palette-preview' : {
    borderRadius: '100%',
    float: 'left',
    width: '17px',
    height: '17px',
    border: 0,
  },
  '& .tui-image-editor-container .color-picker-control' : {
    position: 'absolute',
    display: 'none',
    zIndex: 99,
    width: '192px',
    backgroundColor: '#fff',
    boxShadow: '0 3px 22px 6px rgba(0,0,0,0.15)',
    padding: '16px',
    borderRadius: '2px',
  },
  '& .tui-image-editor-container .color-picker-control .tui-colorpicker-palette-toggle-slider' : {
    display: 'none',
  },
  '& .tui-image-editor-container .color-picker-control .tui-colorpicker-palette-button' : {
    border: 0,
    borderRadius: '100%',
    margin: '2px',
    backgroundSize: 'cover',
    fontSize: '1px',
    width: '10px',
    height: '10px',
    verticalAlign: 'middle',
  },
  '& .tui-image-editor-container .color-picker-control .tui-colorpicker-palette-button[title="#ffffff"]' : {
    border: '1px solid #ccc',
  },
  '& .tui-image-editor-container .color-picker-control .tui-colorpicker-palette-button[title=""]' : {
    border: '1px solid #ccc',
  },
  '& .tui-image-editor-container .color-picker-control .triangle' : {
    width: 0,
    height: 0,
    borderRight: '7px solid transparent',
    borderTop: '8px solid #fff',
    borderLeft: '7px solid transparent',
    position: 'absolute',
    bottom: '-8px',
    left: '84px',
  },
  '& .tui-image-editor-container .color-picker-control .tui-colorpicker-container, & .tui-image-editor-container .color-picker-control .tui-colorpicker-palette-container ul, & .tui-image-editor-container .color-picker-control .tui-colorpicker-palette-container' : {
    width: '100%',
    height: 'auto',
  },
  '& .tui-image-editor-container .filter-color-item .color-picker-control label' : {
    fontColor: '#333',
    fontWeight: 'normal',
    marginRight: '7px',
  },
  '& .tui-image-editor-container .filter-color-item .tui-image-editor-checkbox input + label:before, & .tui-image-editor-container .filter-color-item .tui-image-editor-checkbox > label:before' : {
    left: '-16px',
  },
  '& .tui-image-editor-container .color-picker' : {
    width: '100%',
    height: 'auto',
  },
  '& .tui-image-editor-container .color-picker-value' : {
    width: '32px',
    height: '32px',
    border: '0px',
    borderRadius: '100%',
    margin: 'auto',
    marginBottom: '1px',
  },
  '& .tui-image-editor-container .color-picker-value.transparent' : {
    border: '1px solid #cbcbcb',
    backgroundSize: 'cover',
    backgroundImage: 'url(data:image/png,base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAdBJREFUWAnFl0FuwjAQRZ0ukiugHqFSOQNdseuKW3ALzkA4BateICvUGyCxrtRFd4WuunH/TzykaYJrnLEYaTJJsP2+x8GZZCbQrLU5mj7Bn+EP8HvnCObd+R7xBV5lWfaNON4AnsA38E94qLEt+0yiFaBzAV/Bv+Cxxr4co7hKCDpw1q9wLeNYYdlAwyn8TYt8Hme3+8D5ozcTaMCZ68PXa2tnM2sbEcOZAJhrrpl2DAcTOGNjZPSfCdzkw6JrfbiMv+osBe4y9WOedhm4jZfhbENWuxS44H9Wz/xw4WzqLOAqh1+zycgAwzEMzr5k5gaHOa9ULBwuuDkFlHI1Kl4PJ66kgIpnoywOTmRFAYcbwYk9UMApWkD8zAV5ihcwHk4Rx7gl0IFTQL0EFc+CTQ9OZHWH3YhlVJiVpTHbrTGLhTHLZVgff6s9lyBsI9KduSS83oj+34rTwJutmBmCnMsvozRwZqB5GTkBw6/jdPDu69iJ6BYk6eCcfbcgcQIK/MByaaiMqm8rHcjol2TnpWDhyAKSGdA3FrxtJUToX0ODqatetfGE+8tyEUOV8GY5dGRwLP/MBS4RHQr4bT7NRAQjlcOTfZxmv2G+c4hI8nn+Ax5PG/zhI393AAAAAElFTkSuQmCC)',
  },
  '& .tui-image-editor-container .color-picker-value + label' : {
    color: '#fff',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu svg > use' : {
    display: 'none',
  },
  '& .tui-image-editor-container .tui-image-editor-submenu svg > use.normal' : {
    display: 'block',
  },
  '& .tie-icon-add-button.icon-bubble .tui-image-editor-button[data-icontype="icon-bubble"] svg > use.active, & .tie-icon-add-button.icon-heart .tui-image-editor-button[data-icontype="icon-heart"] svg > use.active, & .tie-icon-add-button.icon-location .tui-image-editor-button[data-icontype="icon-location"] svg > use.active, & .tie-icon-add-button.icon-polygon .tui-image-editor-button[data-icontype="icon-polygon"] svg > use.active, & .tie-icon-add-button.icon-star .tui-image-editor-button[data-icontype="icon-star"] svg > use.active, & .tie-icon-add-button.icon-star-2 .tui-image-editor-button[data-icontype="icon-star-2"] svg > use.active, & .tie-icon-add-button.icon-arrow-3 .tui-image-editor-button[data-icontype="icon-arrow-3"] svg > use.active, & .tie-icon-add-button.icon-arrow-2 .tui-image-editor-button[data-icontype="icon-arrow-2"] svg > use.active, & .tie-icon-add-button.icon-arrow .tui-image-editor-button[data-icontype="icon-arrow"] svg > use.active' : {
    display: 'block',
  },
  '& .tie-draw-line-select-button.line .tui-image-editor-button.line svg > use.normal, & .tie-draw-line-select-button.free .tui-image-editor-button.free svg > use.normal' : {
    display: 'none',
  },
  '& .tie-draw-line-select-button.line .tui-image-editor-button.line svg > use.active,& .tie-draw-line-select-button.free .tui-image-editor-button.free svg > use.active' : {
    display: 'block',
  }, 
  '& .tie-flip-button.resetFlip .tui-image-editor-button.resetFlip svg > use.normal, & .tie-flip-button.flipX .tui-image-editor-button.flipX svg > use.normal, & .tie-flip-button.flipY .tui-image-editor-button.flipY svg > use.normal' : {
    display: 'none',
  },
  '& .tie-flip-button.resetFlip .tui-image-editor-button.resetFlip svg > use.active, & .tie-flip-button.flipX .tui-image-editor-button.flipX svg > use.active, & .tie-flip-button.flipY .tui-image-editor-button.flipY svg > use.active' : {
    display: 'block',
  },
  '& .tie-mask-apply.apply.active .tui-image-editor-button.apply label' : {
    color: '#fff',
  },
  '& .tie-mask-apply.apply.active .tui-image-editor-button.apply svg > use.active' : {
    display: 'block',
  },
   '& .tie-crop-button .tui-image-editor-button.apply, & .tie-crop-preset-button .tui-image-editor-button.apply' : {
    marginRight: '24px',
  }, 
  '& .tie-crop-button .tui-image-editor-button.preset.active svg > use.active, & .tie-crop-preset-button .tui-image-editor-button.preset.active svg > use.active' : {
    display: 'block',
  }, 
  '& .tie-crop-button .tui-image-editor-button.apply.active svg > use.active, & .tie-crop-preset-button .tui-image-editor-button.apply.active svg > use.active' : {
    display: 'block',
  },
   '& .tie-shape-button.rect .tui-image-editor-button.rect svg > use.normal, & .tie-shape-button.circle .tui-image-editor-button.circle svg > use.normal, & .tie-shape-button.triangle .tui-image-editor-button.triangle svg > use.normal' : {
    display: 'none',
  }, 
  '& .tie-shape-button.rect .tui-image-editor-button.rect svg > use.active, & .tie-shape-button.circle .tui-image-editor-button.circle svg > use.active, & .tie-shape-button.triangle .tui-image-editor-button.triangle svg > use.active' : {
    display: 'block',
  }, 
  '& .tie-text-effect-button .tui-image-editor-button.active svg > use.active' : {
    display: 'block',
  }, 
  '& .tie-textAlign-button.left .tui-image-editor-button.left svg > use.active, & .tie-textAlign-button.center .tui-image-editor-button.center svg > use.active, & .tie-textAlign-button.right .tui-image-editor-button.right svg > use.active' : {
    display: 'block',
  }, 
  '& .tie-mask-image-file, & .tie-icon-image-file' : {
    opacity: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '1px solid #008000',
    cursor: 'inherit',
    left: 0,
    top: 0,
  },
  '& .tui-image-editor-container.top.tui-image-editor-top-optimization .tui-image-editor-controls ul' : {
    textAlign: 'right',
  },
  '& .tui-image-editor-container.top.tui-image-editor-top-optimization .tui-image-editor-controls-logo' : {
    display: 'none',
  },
  
}));

export default ImageEditorContainer;
