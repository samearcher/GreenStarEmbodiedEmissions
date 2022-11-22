import ProductTable from './productTable';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import { GridEditInputCell, useGridApiContext } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';

export function ColEditText(props) {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  function handleMessageBox(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.setState({
        messageBox: ""
      });
    }
  }

  return (
    <TextField
      sx={{
        "& fieldset": { border: 'none' },
      }}
      inputProps={{style: {fontSize: 14}}}
      fullWidth
      multiline
      defaultValue={value}
      onKeyPress={(e) => { handleMessageBox(e) }}
      onChange={(e) => {
        apiRef.current.setEditCellValue({ id, field, value: e.target.value });
      }}
    >{value}
    </TextField>
  );
}

const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }}>
        {props.children}
    </Tooltip>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }));

StyledTooltip.muiName = 'Tooltip';

function NameEditInputCell(props) {
    const { error } = props;
  
    return (
      <StyledTooltip open={!!error} title={error}>
        <GridEditInputCell {...props} />
      </StyledTooltip>
    );
  }
  
function renderEditName(params) {
    return <NameEditInputCell {...params} />;
}

const HeaderTooltip = (props) => {

  const { headerText, toolTipText } = props

  return (
    <StyledTooltip disableFocusListener disableTouchListener title={toolTipText}>
      <div>
        { headerText }
      </div>
    </StyledTooltip>
  )
}


const columnMixin = {
  valueFormatter: (params) => {
    const value = +params.value
    return value.toFixed(1)
  },
}

const styleMixin = {
  headerClassName: 'super-app-theme--header',
}

let materialClassOptions
let dataQualityOptions

let columns = [
    { field: 'id', headerName: 'id', editable: false, hideable: false },
    { 
      ...styleMixin, field: 'material_class', 
      renderHeader: () => (
        <HeaderTooltip headerText={'Material Class'} toolTipText={'Some random text'}/>
      ), 
      minWidth: 150, editable: true, 
      valueOptions: () => materialClassOptions, 
      type: 'singleSelect',
    },
    { field: 'sheet_title', headerName: 'Sheet title', type: 'string', minWidth: 150, editable: true },
    { 
      field: 'table_heading', 
      headerName: 'Table heading', 
      type: 'string',  
      editable: true, 
      align: 'left',
      minWidth: 300,
    },
    { field: 'table_subheading', headerName: 'Table subheading', type: 'string', editable: true },
    { field: 'product_code', headerName: 'Product code', type: 'string', editable: true },
    { field: 'material', 
      cellClassName: 'material', 
      minWidth: 400, headerName: 'Material', 
      type: 'string', editable: true, 
      align: "left",
      renderEditCell: (params) => (
        <ColEditText {...params}></ColEditText>
      )
    },
    { field: 'qty_basis', headerName: 'Qty basis', type: 'string', editable: true },
    { field: 'a1_a3_CO2', headerName: 'A1-A3 CO2', type: 'number', editable: true },
    { field: 'a1_a3_energy_total', headerName: 'A1-A3 total energy', type: 'number', editable: true },
    { field: 'a1_a3_energy_non_renewable', headerName: 'A1-A3 non-renewable energy', type: 'number', editable: true },
    { field: 'a1_a3_energy_renewable', headerName: 'A1-A3 renewable energy', type: 'number', editable: true },
    { field: 'notes', headerName: 'Notes', type: 'string', editable: true },
    { field: 'data_quality', align: 'center', headerName: 'Data quality', type: 'singleSelect', editable: true, valueOptions: () => dataQualityOptions, },
    { field: 'density', headerName: 'Density', type: 'number', editable: true },
    { field: 'area_density', headerName: 'Area density', type: 'number', editable: true },
    { field: 'linear_density', headerName: 'linear density', type: 'number', editable: true },
    { field: 'mass_per_unit', headerName: 'Mass per unit density', type: 'number', editable: true },
  ];

const newRowData = {}

export default function Table() {

  React.useEffect(() => {
    axios.get('http://localhost:8000/static_data')
        .then((response) => {
          materialClassOptions = response.data.material_classes
          dataQualityOptions = response.data.data_quality
        })
  }, [])
  
  return (
      <div>
          <ProductTable 
              columns={columns}
              getDataRoute='http://localhost:8000/a1_a3_data/all'
              updateRoute='http://localhost:8000/a1_a3_data/'
              deleteRoute='http://localhost:8000/delete_a1_a3_data/'
              addRoute='http://localhost:8000/a1_a3_data/'
              tableName='A1-A3 data'
              newRowData={newRowData}
          />
      </div>
  );
}

