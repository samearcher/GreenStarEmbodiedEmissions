import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { alpha, styled } from '@mui/material/styles';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridCellModes,
  gridClasses,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridFilterModel,
  GridLinkOperator,
  useGridApiRef,
} from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import Dialogue from './Dialogue'

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

function AddToolbar(props) {
  const { handleOpenAddDialogue, tableName } = props;

  return (
    <GridToolbarContainer>
      <Button color="primary" 
        sx={{ "& .MuiButton-startIcon": { margin: "0px", paddingLeft: '0px !important' }}} 
        startIcon={<AddIcon />} onClick={handleOpenAddDialogue}>
        Add { tableName }
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid(props) {
  const [rows, setRows] = React.useState([]);
  const [cellModesModel, setCellModesModel] = React.useState({})
  const [cellFocusRowId, setCellFocusRowId] = React.useState(null)
  const [DeleteDialogueisOpen, setDeleteDialogueIsOpen] = React.useState(false);
  const [AddDialogueisOpen, setAddDialogueIsOpen] = React.useState(false);
  const [display, setDisplay ] = React.useState(false)
 
  let { columns, tableName, getDataRoute, 
        updateRoute, deleteRoute, addRoute, 
        newRowData 
      } = props

  const [snackbar, setSnackbar] = React.useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  const deleteColumn = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id }) => {
      return [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={(params) => handleOpenDeleteDialogue()}
          color="inherit"
        />,
      ];
    },
  }

  
  React.useEffect(() => {
    axios.get(getDataRoute)
        .then((response) => {
          if (response.data.length > 0) {
            setDisplay(true)
            setRows(response.data)
          } else {
            setDisplay(false)
          }
        })
  }, [getDataRoute])
  

  const handleOpenDeleteDialogue = () => {
    setDeleteDialogueIsOpen(true);
  };

  const handleOpenAddDialogue = () => {
    setAddDialogueIsOpen(true);
  };


  const handleAddProduct = () => {
    setAddDialogueIsOpen(false)
    axios.post(addRoute, newRowData).then((response) => {
          setRows((oldRows) => [...oldRows, response.data]);
          setSnackbar({ children: tableName + ' successfully added', severity: 'success' });
          setCellModesModel({
            ...cellModesModel,
            [response.data.id]: { ...cellModesModel[response.data.id], ['description']: { mode: GridCellModes.Edit } },
        });
      })
  };


  let keysPressed = {};
 
  document.addEventListener('keydown', (event) => {
    
    if (!event.repeat) {
      keysPressed['Control'] === false ? keysPressed[event.key] = false : keysPressed[event.key] = true

      if (keysPressed['Control'] && event.key == 'Enter') {
        keysPressed['Control'] = false
        console.log('data entered')
      }
    }
  });


  const handleCellClick = React.useCallback((params) => {
    setCellFocusRowId(params.id)
    if (params.field === 'actions' | params.isEditable === false) {
      return
    }
    setCellModesModel((prevModel) => {
      return {
        // Revert the mode of the other cells from other rows
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View }
              }),
              {}
            )
          }),
          {}
        ),
        [params.id]: {
          // Revert the mode of other cells in the same row
          ...Object.keys(prevModel[params.id] || {}).reduce(
            (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
            {}
          ),
          [params.field]: { mode: GridCellModes.Edit }
        }
      };
    });
  }, []);


  const handleDeleteProduct = () => {
    setDeleteDialogueIsOpen(false)
    axios.delete(deleteRoute + cellFocusRowId)
    .then(() => {
      setRows(rows.filter((row) => row.id !== cellFocusRowId));
      setSnackbar({ children: tableName + ' successfully deleted', severity: 'success' });  
    })
  };


  const processRowUpdate = (newRow, oldRow) => {
      const rowCompare = Object.values(newRow).filter((item, i) => item !== Object.values(oldRow)[i])
      if ( rowCompare.length === 0 ) {
        return oldRow
      } 
      const updatedRow = { ...newRow, isNew: false };
      axios.put(updateRoute, newRow, { timeout: 2000 })
      .then((response) => {
        const rowData = { ...response.data, isNew: false };
        setRows(rows.map((row) => (row.id === rowData.id ? rowData : row)));
        setSnackbar({ children: tableName + ' successfully updated', severity: 'success' });          
      })
      .catch(err => {
        setSnackbar({ children: 'There was a problem with the server', severity: 'error' })
        setRows(rows.map((row) => (row.id === newRow.id ? oldRow : row)));
      })
      return updatedRow
    };

    
  const handleProcessRowUpdateError = (error) => {
    console.log(error)
    setSnackbar({ children: error.message, severity: 'error' });
  };

  return (
    <Box
      sx={{
        paddingTop: '70px',
        height: '85vh',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <StripedDataGrid
        sx={{
          margin: 2,
          padding: 2,
          boxShadow: 20,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.secondary',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            textOverflow: "clip",
            whiteSpace: "initial",
            lineHeight: "16px",
            display: 'flex !important',
          },
          '& .MuiDataGrid-row': {
            maxHeight: "fit-content !important",
          },
          '& .MuiDataGrid-viewport': {
            maxHeight: 'fit-content !important'
          },
          '& .MuiDataGrid-row': {
            maxHeight: 'fit-content !important'
          },
          '& .MuiDataGrid-renderingZone': {
            maxHeight: 'fit-content !important'
          },
          '& .MuiDataGrid-cell': {
            maxHeight: 'fit-content !important',
            overflow: 'auto',
            whiteSpace: 'initial !important',
            lineHeight: '16px !important',
            display: 'flex !important',
            alignItems: 'center',
            paddingTop: '10px !important',
            paddingBottom: '10px !important',
            textAlign: 'left !important',
          }
        }}
        rows={rows}
        columns={[...columns, deleteColumn]}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
          sorting: {
            sortModel: [{ field: 'id', sort: 'asc' }],
          },
        }}
        processRowUpdate={processRowUpdate}
        disableSelectionOnClick
        onProcessRowUpdateError={handleProcessRowUpdateError}
        cellModesModel={cellModesModel}
        onCellModesModelChange={(newModel) => setCellModesModel(newModel)}
        getRowId={(row) => row.id}
        onCellClick={handleCellClick}
        components={{
          Toolbar: AddToolbar,
        }}s
        componentsProps={{
          toolbar: { 
            handleOpenAddDialogue, tableName },
          cell: {
            tabIndex: 1,
          }
        }}
        experimentalFeatures={{ newEditingApi: true }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        rowHeight={35}
      />
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={3000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      <Dialogue 
        isDialogOpened={DeleteDialogueisOpen}
        handleCloseDialog={() => setDeleteDialogueIsOpen(false)} 
        handleConfirm={handleDeleteProduct}
        title='Delete product' 
        contentText='Please confirm you want to delete this'/>
      <Dialogue 
        isDialogOpened={AddDialogueisOpen}
        handleCloseDialog={() => setAddDialogueIsOpen(false)} 
        handleConfirm={handleAddProduct}
        title='Add new item?' 
        contentText='Please confirm you want to add a new row'/>
    </Box>
  );
}
