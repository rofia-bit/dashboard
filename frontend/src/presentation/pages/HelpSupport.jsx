import {
    Box, Typography, Stack, Accordion, AccordionSummary,
    AccordionDetails, Chip, Divider
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";


//static data
const FAQ_SECTIONS = [
    {
        category: "Users Mnagement",
        icon: <PeopleOutlineIcon fontSize="small" />,
        color: "#2563eb",
        items: [
            {
                q: "How do I add a new user?",
                a: "Navigate to the Users page, click 'Add User', fill in the full name, email, password, and role, then click Add. The user will appear in the table immediately.",
            },
            {
                q: "How do I delete a user?",
                a: "On the Users page, click the delete icon on the right of the user row. A confirmation dialog will appear — confirm to permanently remove the user.",
            },
            {
                q: "What roles are available?",
                a: "The system supports four roles: Admin, Resident, Security Guard, and Staff. Each role has different access levels defined by the backend.",
            },
            {
                q: "Can I change a user's role after creation?",
                a: "Currently, role editing is available via the Edit button on the user row. This will be wired to the PATCH /users/{userId} endpoint.",
            },
        ],
    },
    {
        category: "Incidents",
        icon: <WarningAmberOutlinedIcon fontSize="small" />,
        color: "#f59e0b",
        items: [
            {
                q: "How do I update an incident's status?",
                a: "On the Incidents page, find the incident row and use the status dropdown in the Status column. Changes are saved to the backend immediately with optimistic updates.",
            },
            {
                q: "What statuses can an incident have?",
                a: "Incidents can be marked as Open, In Progress, Resolved, or Closed. The color coding helps distinguish them at a glance.",
            },
            {
                q: "How do I view full incident details?",
                a: "Click the eye icon on any incident row to open the detail dialog. It shows the full description, category, reported date, and current status.",
            },
            {
                q: "Can I filter incidents by status?",
                a: "Yes! use the status dropdown in the toolbar above the incidents table to filter by any specific status, or select 'All Statuses' to see everything.",
            },
        ],
    },
];


export default function HelpSupport() {
    return (
        <Box sx={{ p: 4, bgcolor: "#0f1523", minHeight: "100vh" }}>
            {/* header */}
            <Box mb={4}>
                <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>Help & Support</Typography>
                <Typography sx={{ color: "#a0a9c9", fontSize: 13 }}>Find answers and get in touch with the support team</Typography>
            </Box>


            <Divider sx={{ borderColor: "#2a3a6a", mb: 4 }} />

            {/* questions */}
            <Stack spacing={4}>
                {FAQ_SECTIONS.map(section => (
                    <Box key={section.category}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                            <Box sx={{ color: section.color }}>{section.icon}</Box>
                            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
                                {section.category}
                            </Typography>
                        </Stack>

                        <Stack spacing={1}>
                            {section.items.map((item, i) => (
                                <Accordion key={i} disableGutters elevation={0} sx={{
                                    bgcolor: "#1a2444",
                                    border: "1px solid #2a3a6a",
                                    borderRadius: "8px !important",
                                    "&:before": { display: "none" },
                                    "&.Mui-expanded": { border: `1px solid ${section.color}50` },
                                }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: "#6b7280" }} />}
                                        sx={{ px: 2.5, py: 0.5, "& .MuiAccordionSummary-content": { my: 1.5 } }}
                                    >
                                        <Typography sx={{ color: "#e2e8f0", fontSize: 14, fontWeight: 500 }}>
                                            {item.q}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2 }}>
                                        <Divider sx={{ borderColor: "#2a3a6a", mb: 2 }} />
                                        <Typography sx={{ color: "#a0a9c9", fontSize: 13, lineHeight: 1.7 }}>
                                            {item.a}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}