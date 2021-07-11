import React, { memo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import TableCell from "@material-ui/core/TableCell";
import { AutoSizer, Column, Table } from "react-virtualized";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CheckIcon from "@material-ui/icons/Check";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

const MuiVirtualizedTable = ({
    classes,
    columns,
    rowHeight,
    headerHeight,
    key,
    expand,
    rowSelected,
    ...tableProps
}) => {

    const getRowClassName = ({ index }) => {
        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: false
        });
    };

    const cellRenderer = ({ cellData, columnIndex, rowData, dataKey }) => {
       
        const style = rowData.child
            ? { height: rowHeight, backgroundColor: "#E8E8E8" }
            : { height: rowHeight, paddingLeft: 8, paddingRight: 4 };

        let isChild = rowData.child;
        let isExpanded = rowData.open;

        if (dataKey === "open") {
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
                            onClick={event => expand(rowData)}
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
        } else if (dataKey === "select") {
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
                            onClick={() => rowSelected(rowData)}
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

export const MemoizeTable = memo(MuiVirtualizedTable);


