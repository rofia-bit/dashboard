import {
    Box, CircularProgress, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";

export const cellSx = {
    color: "#e2e8f0", fontSize: 13, borderColor: "#2a3a6a", py: 1.5,
};

export const headCellSx = {
    color: "#6b7280", fontSize: 11, fontWeight: 600,
    textTransform: "uppercase", letterSpacing: 0.8,
    borderColor: "#2a3a6a", bgcolor: "#131d38",
};

/**
 * @param {boolean}  loading
 * @param {string}   [error]
 * @param {Array}    columns 
 * @param {boolean}  [empty]
 * @param {string}   [emptyMsg]
 * @param {node}     children 
 */
export default function table({ loading, error, columns, empty, emptyMsg = "No results found.", children }) {
    return (
        <>
            {error && (
                <Typography sx={{ color: "#ef4444", fontSize: 13, mb: 2 }}>{error}</Typography>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" pt={8}>
                    <CircularProgress sx={{ color: "#2563eb" }} />
                </Box>
            ) : (
                <TableContainer sx={{ bgcolor: "#1a2444", borderRadius: 2, border: "1px solid #2a3a6a" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((col, i) => (
                                    <TableCell
                                        key={i}
                                        align={col.align ?? "left"}
                                        sx={headCellSx}
                                    >
                                        {col.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {empty ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        sx={{ ...cellSx, textAlign: "center", color: "#6b7280", py: 6 }}
                                    >
                                        {emptyMsg}
                                    </TableCell>
                                </TableRow>
                            ) : children}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}