/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import {
    Box, CircularProgress, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export const cellSx = {
    color: "#e2e8f0", fontSize: 13, borderColor: "#2a3a6a", py: 1.5,
};

export const headCellSx = {
    color: "#6b7280", fontSize: 11, fontWeight: 600,
    textTransform: "uppercase", letterSpacing: 0.8,
    borderColor: "#2a3a6a", bgcolor: "#131d38",
};

// Wrap this around every <TableRow> in your pages for staggered entrance
export function AnimatedRow({ children, index = 0, ...props }) {
    return (
        <motion.tr
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.tr>
    );
}

export default function MyTable({ loading, error, columns, empty, emptyMsg = "No results found.", children }) {
    return (
        <>
            <AnimatePresence>
                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <Typography sx={{ color: "#ef4444", fontSize: 13, mb: 2 }}>{error}</Typography>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="spinner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: "flex", justifyContent: "center", paddingTop: 64 }}
                    >
                        <CircularProgress sx={{ color: "#2563eb" }} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                    >
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
                                    <AnimatePresence>
                                        {empty ? (
                                            <motion.tr
                                                key="empty"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <TableCell
                                                    colSpan={columns.length}
                                                    sx={{ ...cellSx, textAlign: "center", color: "#6b7280", py: 6 }}
                                                >
                                                    {emptyMsg}
                                                </TableCell>
                                            </motion.tr>
                                        ) : children}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}