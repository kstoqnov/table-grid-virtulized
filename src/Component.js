import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { MemoizeTable } from "./MuiVirtualizedTable";

const styles = theme => ({
    flexContainer: {
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box"
    },
    tableRow: {
        cursor: "pointer"
    },
    tableRowHover: {
        "&:hover": {
            backgroundColor: theme.palette.grey[200]
        }
    },
    tableCell: {
        flex: 1
    },
    noClick: {
        cursor: "initial"
    },
    button: {
        "&:hover": {
            backgroundColor: "transparent"
        }
    }
});


const VirtualizedTable = withStyles(styles)(MemoizeTable);

// ---

export default function OrderGroupGrid(props) {
    const [rows, setRows] = React.useState({ data: [] });

    const expRow = data => {
        console.log("onSelectExpandRow: ", data);
        let row = rows.data.find(e => e.id === data.id);
        row.open = !row.open;

        let newRows = [];

        if (row.open) {
            rows.data.forEach(r => {
                if (r.id !== row.id) {
                    newRows.push(r);
                } else {
                    newRows.push(r);
                    r.items.forEach(child => {
                        child.parentId = r.id;
                        child.child = true;
                        newRows.push(child);
                    });
                }
            });
        } else {
            newRows = rows.data.filter(r => r.parentId !== row.id);
        }

        setRows({ data: newRows });
    };

    const selectRow = row => {
        console.log("Selected Order Group: ", row);
        props.selectOrderGroup(row);
    };

    const rowClick = e => {
        console.log("rowClick - ", e.event);
        if (e && e.event && e.event.stopPropagation) {
            e.event.stopPropagation();
        }
    };

    if (rows.data.length === 0 && props.rows) {
        let newData = props.rows.map(r => {
            r.open = false;
            r.itemNumber = r.items.length + " items";
            return r;
        });
        setRows({ data: newData });
    }


    let rowCount = rows && rows.data ? rows.data.length : 0;

    return (
        <React.Fragment>
            <Paper style={{ height: "100vh", width: "100%" }}>
                <VirtualizedTable
                    rowCount={rowCount}
                    rowGetter={({ index }) => rows.data[index]}
                    columns={props.columns}
                    expand={expRow}
                    rowSelected={selectRow}
                    onRowClick={rowClick}
                />
            </Paper>
        </React.Fragment>
    );
}
