import React, { useEffect } from "react";
import styled from "styled-components";
import { useTable, usePagination } from "react-table";

import makeData from "./makeData";
import Search from "grommet-icons";
import { Layer, Button, Box, Text, TextInput } from "grommet";
import FormLayer from "./layer";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 2 }
    },
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function MyCell({ value }) {
  return <a href="#">{value}</a>;
}

function App() {
  const [layerdata, setLayerdata] = React.useState();
  const [layer, setLayer] = React.useState(false);
  const [show, setShow] = React.useState(true);
  //const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState();
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "First Name",
        accessor: "firstName"
      },
      {
        Header: "Last Name",
        accessor: "lastName"
      },
      {
        Header: "Status",
        accessor: "status"
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ value }) => (
          <div>
            <button onClick={() => handleEdit(value)}>View</button>
          </div>
        )
      }
    ],
    []
  );

  function handleEdit(row) {
    console.log("row", row);
    setShow(true);
    setLayer(true);
    setLayerdata(row);
  }
  const searchData = (event) => {
    console.log("hit", event.target.value);
    setSearch(event.target.value);
    const abc = data.filter(
      (e) =>
        e.id == event.target.value ||
        e.status === event.target.value ||
        e.firstName === event.target.value ||
        e.lastName === event.target.value
    );
    //setData(abc);
    console.log("abc", abc, search);
  };

  const data = React.useMemo(
    () => makeData(100000).map((item) => ({ ...item, action: item })),
    []
  );

  React.useEffect(() => {
    // Update the document title using the browser API
    // setData(data1);
  }, []);

  //
  return (
    <>
      {/* <TextInput icon={<Search />} placeholder="search ..." /> */}
      <div style={{ backgroundColor: "pink" }}>
        <h1>Table Data</h1>
        <TextInput
          placeholder="search........"
          onChange={searchData}
          value={search}
        />
        <Styles>
          <Table columns={columns} data={data} />
        </Styles>
        <div>
          {console.log(show)}
          {console.log("layerdata", layerdata)}
          {layer && (
            <Box
              size="small"
              direction="row"
              border={{ color: "brand", size: "large" }}
              pad="medium"
            >
              <Layer
                id="hello world"
                position="center"
                //onClickOutside={setLayer(false)}
                //onEsc={setLayer(false)}
              >
                <Box size="small" pad="medium" gap="small" width="medium">
                  <Text>ID - {layerdata.id}</Text>
                  <Text>First Name - {layerdata.firstName} </Text>
                  <Text>Last Name - {layerdata.lastName} </Text>
                  <Text>Status - {layerdata.status} </Text>
                  {/* <Box align="center" pad="medium">
                    8 <Button label="Default" onClick={() => setLayer(false)} />
                    9{" "}
                  </Box> */}
                  <Button
                    size="small"
                    label="Close"
                    onClick={() => setLayer(false)}
                    color="dark-3"
                  />
                </Box>
              </Layer>
            </Box>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
