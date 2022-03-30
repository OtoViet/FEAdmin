import Pagi from '@mui/material/Pagination';
function Pagination(props) {
    return <Pagi count={props.count} sx={{mt:4}} variant="outlined" color="primary"
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        onChange={(e, value) => {
            e.preventDefault();
            props.onClick(value);
        }}
    />;
}
export default Pagination;