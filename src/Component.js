import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CheckIcon from "@material-ui/icons/Check";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

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

const MuiVirtualizedTable = (props) => {

    const {
        classes,
        columns,
        rowHeight,
        headerHeight,
        key,
        expand,
        rowSelected,
        ...tableProps
    } = props;

    const getRowClassName = ({ index }) => {
        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: false
        });
    };

    const cellRenderer = props => {
        const { cellData, columnIndex } = props;

        const style = props.rowData.child
            ? { height: rowHeight, backgroundColor: "#E8E8E8" }
            : { height: rowHeight, paddingLeft: 8, paddingRight: 4 };

        let isChild = props.rowData.child;
        let isExpanded = props.rowData.open;

        if (props.dataKey === "open") {
            return (
                <TableCell
                    component="div"
                    className={clsx(classes.tableCell, classes.flexContainer, {
                        [classes.noClick]: false
                    })}
                    variant="body"
                    style={style}
                    align={
                        (columnIndex != null && columns[columnIndex].numeric) || false
                            ? "right"
                            : "left"
                    }
                >
                    {isChild ? (
                        <div />
                    ) : (
                        <IconButton
                            onClick={event => expand(props.rowData)}
                            className={classes.button}
                        >
                            {isExpanded ? (
                                <KeyboardArrowDownIcon style={{ fontSize: 24 }} />
                            ) : (
                                <ChevronRightIcon style={{ fontSize: 24 }} />
                            )}
                        </IconButton>
                    )}
                </TableCell>
            );
        } else if (props.dataKey === "select") {
            return (
                <TableCell
                    component="div"
                    className={clsx(classes.tableCell, classes.flexContainer, {
                        [classes.noClick]: false
                    })}
                    variant="body"
                    style={style}
                    align={
                        (columnIndex != null && columns[columnIndex].numeric) || false
                            ? "right"
                            : "left"
                    }
                >
                    {isChild ? (
                        <div />
                    ) : (
                        <IconButton
                            onClick={() => rowSelected(props.rowData)}
                            className={classes.button}
                        >
                            <CheckIcon fontSize="inherit" style={{ color: "#D71920" }} />
                        </IconButton>
                    )}
                </TableCell>
            );
        } else {
            return (
                <TableCell
                    component="div"
                    className={clsx(classes.tableCell, classes.flexContainer, {
                        [classes.noClick]: true
                    })}
                    variant="body"
                    style={style}
                    align={
                        (columnIndex != null && columns[columnIndex].numeric) || false
                            ? "right"
                            : "left"
                    }
                >
                    {cellData}
                </TableCell>
            );
        }
    };

    const headerRenderer = ({ label, columnIndex }) => {

        const textStyle = { color: "#D71920", fontSize: 14, fontWeight: 600 };

        return (
            <TableCell
                component="div"
                className={clsx(
                    classes.tableCell,
                    classes.flexContainer,
                    classes.noClick
                )}
                variant="head"
                style={{ height: headerHeight, paddingLeft: 8 }}
                align={columns[columnIndex].numeric || false ? "right" : "left"}
            >
                <span style={textStyle}>{label}</span>
            </TableCell>
        );
    };



    return (
        <AutoSizer>
            {({ height, width }) => (
                <Table
                    key={key}
                    height={height}
                    width={width}
                    rowHeight={rowHeight}
                    headerHeight={headerHeight}
                    {...tableProps}
                    rowClassName={getRowClassName}
                >
                    {columns.map(({ dataKey, ...other }, index) => {
                        return (
                            <Column
                                key={dataKey}
                                headerRenderer={headerProps =>
                                    headerRenderer({
                                        ...headerProps,
                                        columnIndex: index
                                    })
                                }
                                className={classes.flexContainer}
                                cellRenderer={cellRenderer}
                                dataKey={dataKey}
                                {...other}
                            />
                        );
                    })}
                </Table>
            )}
        </AutoSizer>
    );
}

MuiVirtualizedTable.defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
}

MuiVirtualizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            dataKey: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            numeric: PropTypes.bool,
            width: PropTypes.number.isRequired
        })
    ).isRequired,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    rowHeight: PropTypes.number
};

const MemoizeTable = memo(MuiVirtualizedTable);
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

    const columns = [
        { width: 40, maxWidth: 40, label: "", dataKey: "open", flexGrow: 1 },
        {
            width: 200,
            label: "Order Group Description",
            dataKey: "description",
            flexGrow: 1
        },
        { width: 100, label: "Item Number", dataKey: "itemNumber", flexGrow: 1 },
        {
            width: 200,
            label: "Item Description",
            dataKey: "itemDescription",
            flexGrow: 1
        },
        { width: 60, label: "", dataKey: "select", flexGrow: 1 }
    ];

    let rowCount = rows && rows.data ? rows.data.length : 0;

    return (
        <React.Fragment>
            <Paper style={{ height: "100vh", width: "100%" }}>
                <VirtualizedTable
                    rowCount={rowCount}
                    rowGetter={({ index }) => rows.data[index]}
                    columns={columns}
                    expand={expRow}
                    rowSelected={selectRow}
                    onRowClick={rowClick}
                />
            </Paper>
        </React.Fragment>
    );
}
