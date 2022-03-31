import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Avatar,
    Box,
    Table,
    Typography,
    TableCell,
    TableBody,
    TableContainer,
    TableFooter,
    TablePagination,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';
import clockFill from '@iconify/icons-eva/clock-fill';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function renderContent(notification) {
    const title = (
        <Typography variant="subtitle2">
            {notification.title}
            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                &nbsp; {notification.content}
            </Typography>
        </Typography>
    );

    if (notification.type === 'order') {
        return {
            avatar: <img alt={notification.title} src="/static/icons/ic_notification_package.svg" />,
            title
        };
    }
    if (notification.type === 'delivery') {
        return {
            avatar: <img alt={notification.title} src="/static/icons/ic_notification_shipping.svg" />,
            title
        };
    }
    if (notification.type === 'mail') {
        return {
            avatar: <img alt={notification.title} src="/static/icons/ic_notification_mail.svg" />,
            title
        };
    }
    if (notification.type === 'message') {
        return {
            avatar: <img alt={notification.title} src="/static/icons/ic_notification_chat.svg" />,
            title
        };
    }
    return {
        avatar: <img alt={notification.title} src={notification.avatar} />,
        title
    };
}

function Detail({ notifications }) {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notifications.length) : 0;
    return (
        <div className="container">
            <Box sx={{ width: '100%', mt: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{
                        [`& .${tableCellClasses.root}`]: {
                            border: "none"
                        }
                    }}
                        aria-label="custom pagination table">
                        <TableBody>
                            {(rowsPerPage > 0
                                ? notifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : notifications
                            ).map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <ListItemButton
                                            to="#"
                                            disableGutters
                                            component={RouterLink}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'background.neutral' }}>{renderContent(row).avatar}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={renderContent(row).title}
                                                secondary={
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            mt: 0.5,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            color: 'text.disabled'
                                                        }}
                                                    >
                                                        <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
                                                        {formatDistanceToNow(new Date(row.createdAt))}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </TableCell>
                                </TableRow>

                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[]}
                                    colSpan={3}
                                    count={notifications.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
}
export default Detail;