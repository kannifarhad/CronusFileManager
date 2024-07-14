import React, { useEffect, useRef, useState, memo } from 'react';
import { AlertTitle, IconButton, Collapse, LinearProgress } from '@mui/material';
import { Message } from '../types';
import { StyledInfoBox } from './styled';

interface InfoBoxesProps {
    alert: Message;
}

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

const InfoBoxes: React.FC<InfoBoxesProps> = (props) => {
    const { alert } = props;
    const [open, setOpen] = useState(true);
    const prevAlert = usePrevious(alert);

    useEffect(() => {
        if (prevAlert !== alert) {
            setOpen(true);
        }
    }, [alert, prevAlert]);

    useEffect(() => {
        if (alert.timer) {
            const timerId = setTimeout(() => {
                setOpen(false);
            }, alert.timer);
            return () => clearTimeout(timerId); // Cleanup the timer on unmount or when alert changes
        }
    }, [alert]);

    return (
        <>
            <Collapse in={open}>
                <StyledInfoBox
                    key={alert.id}
                    severity={alert.type}
                    action={
                        !alert.disableClose && (
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => { setOpen(false); }}
                            >
                                <span className="icon-cancel"></span>
                            </IconButton>
                        )
                    }
                >
                    <AlertTitle className={'fmInfoBoxtitle'}>{alert.title}</AlertTitle>
                    <p className={'fmInfoBoxmessage'}>{alert.message}</p>
                </StyledInfoBox>
                {alert.progress && <LinearProgress className={'fmInfoBoxprogress'} />}
            </Collapse>
        </>
    );
};

export default memo(InfoBoxes);
