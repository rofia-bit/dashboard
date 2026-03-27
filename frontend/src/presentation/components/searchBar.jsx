import { Stack, TextField, Select, MenuItem, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

//delete later ig

const inputSx = {
    flex: 1,
    minWidth: 220,
    "& .MuiOutlinedInput-root": {
        bgcolor: "#1a2444", color: "#fff", fontSize: 13,
        "& fieldset": { borderColor: "#2a3a6a" },
        "&:hover fieldset": { borderColor: "#4b5563" },
        "&.Mui-focused fieldset": { borderColor: "#2563eb" },
    },
    "& input::placeholder": { color: "#6b7280", opacity: 1 },
};

const selectSx = {
    minWidth: 160, bgcolor: "#1a2444", color: "#fff", fontSize: 13,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a3a6a" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4b5563" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
    "& .MuiSvgIcon-root": { color: "#6b7280" },
};

/**
 * SearchToolbar
 * @param {string}   search
 * @param {function} onSearch
 * @param {string}   searchPlaceholder
 * @param {string}   filterValue
 * @param {function} onFilterChange
 * @param {string}   filterAllLabel
 * @param {Array}    filterOptions
 */
export default function SearchToolbar({
    search, onSearch,
    searchPlaceholder = "Search…",
    filterValue, onFilterChange,
    filterAllLabel = "All",
    filterOptions = [],
}) {
    return (
        <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
            <TextField
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => onSearch(e.target.value)}
                size="small"
                sx={inputSx}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#6b7280", fontSize: 18 }} />
                        </InputAdornment>
                    ),
                }}
            />
            <Select
                value={filterValue}
                onChange={e => onFilterChange(e.target.value)}
                size="small"
                sx={selectSx}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#1a2444", color: "#fff" } } }}
            >
                <MenuItem value="ALL">{filterAllLabel}</MenuItem>
                {filterOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
            </Select>
        </Stack>
    );
}