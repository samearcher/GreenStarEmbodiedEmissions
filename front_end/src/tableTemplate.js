import ProductTable from './productTable';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { GridEditInputCell } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

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

const options = [
  {value: 1, label: 'STRUCTURE'}, 
  {value: 2, label: 'ENCLOSURE'}, 
  {value: 3, label: 'INTERIOR'},
  {value: 4, label: 'FINISH'},
  {value: 5, label: 'SERVICES'},
]

let columns = [
    { field: 'id', headerName: 'id', editable: false, hideable: false },
    { 
      ...styleMixin, field: 'material_class', 
      renderHeader: () => (
        <HeaderTooltip headerText={'Material Class'} toolTipText={'Some random text'}/>
      ), 
      minWidth: 200, editable: true, 
      valueOptions: () => options, 
      type: 'singleSelect',
      valueFormatter: ({ value }) =>
        options.find((opt) => parseInt(opt.value) === parseInt(value)).label
    },
    { ...styleMixin, ...columnMixin, field: 'elec_efficiency', headerName: 'Electrical efficiency', flex: 1, type: 'number', editable: true },
    { field: 'heat_recovery_eff', headerName: 'Heat recovery efficiency', flex: 1, type: 'number', editable: true },
    { field: 'range_low', headerName: 'Low flow rate', 
      type: 'number', flex: 1, editable: true,
    },
    { field: 'range_high', 
      headerName: 'High flow rate', 
      type: 'number', flex: 1, editable: true,
      preProcessEditCellProps: (params) => {
        let errorMessage
        if (params.props.value === null) {
            errorMessage = 'Value is required'
        } else if (params.props.value < 3) {
          errorMessage = 'Value is less than 3'
        } else {
            errorMessage = null
        };
        return { ...params.props, error: errorMessage } 
        },
      renderEditCell: renderEditName
    },
    { field: 'calced', headerName: 'calced', flex: 1, type: 'number', editable: false },
    { field: 'superseded', headerName: 'superseded', type: 'boolean', flex: 1, editable: true },
  ];

const newRowData = {
    "description": 1,
    "elec_efficiency": 0,
    "heat_recovery_eff": 0,
    "range_low": 200,
    "range_high": 100,
    "vent_type": "balanced",
    "superseded": true,
  }

export default function ventilationTable() {
    return (
        <div>
            <ProductTable 
                columns={columns}
                getDataRoute='http://localhost:8000/mvhr/all'
                updateRoute='http://localhost:8000/mvhr/'
                deleteRoute='http://localhost:8000/delete_mvhr/'
                addRoute='http://localhost:8000/mvhr/'
                tableName='Ventilation'
                newRowData={newRowData}
            />
        </div>
    );
}

  