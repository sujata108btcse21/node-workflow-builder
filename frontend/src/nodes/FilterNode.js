import React, { useState } from 'react';
import BaseNode from './BaseNode';
import {
  TextField,
  Box,
  Typography,
  MenuItem,
  Popover,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const FilterNode = ({ data }) => {
  const config = {
    field: data?.field || 'value',
    operator: data?.operator || 'greater',
    value: data?.value || '',
  };

  const [fieldAnchor, setFieldAnchor] = useState(null);
  const [operatorAnchor, setOperatorAnchor] = useState(null);

  const fieldOptions = [
    { value: 'value', label: 'Value' },
    { value: 'date', label: 'Date' },
    { value: 'category', label: 'Category' },
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'greater', label: 'Greater than' },
    { value: 'less', label: 'Less than' },
    { value: 'contains', label: 'Contains' },
  ];

  const getLabel = (options, value) =>
    options.find((o) => o.value === value)?.label;

  return (
    <BaseNode
      data={data}
      type="filter"
      inputHandles={1}
      outputHandles={2}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <FilterListIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Filter Conditions
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
            Field
          </Typography>
          <Box
            onClick={(e) => setFieldAnchor(e.currentTarget)}
            sx={{
              border: '1px solid #cbd5e1',
              borderRadius: 1,
              p: 1,
              mt: 0.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: 'white',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            <Typography variant="body2">
              {getLabel(fieldOptions, config.field)}
            </Typography>
            <ArrowDropDownIcon sx={{ color: '#64748b' }} />
          </Box>
        </Box>

        <Popover
          open={Boolean(fieldAnchor)}
          anchorEl={fieldAnchor}
          onClose={() => setFieldAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              width: fieldAnchor?.clientWidth,
              border: '1px solid #e2e8f0',
            },
          }}
        >
          {fieldOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={config.field === option.value}
              onClick={() => {
                data?.onChange?.({ field: option.value });
                setFieldAnchor(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Popover>

        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
            Operator
          </Typography>
          <Box
            onClick={(e) => setOperatorAnchor(e.currentTarget)}
            sx={{
              border: '1px solid #cbd5e1',
              borderRadius: 1,
              p: 1,
              mt: 0.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: 'white',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            <Typography variant="body2">
              {getLabel(operatorOptions, config.operator)}
            </Typography>
            <ArrowDropDownIcon sx={{ color: '#64748b' }} />
          </Box>
        </Box>

        <Popover
          open={Boolean(operatorAnchor)}
          anchorEl={operatorAnchor}
          onClose={() => setOperatorAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              width: operatorAnchor?.clientWidth,
              border: '1px solid #e2e8f0',
            },
          }}
        >
          {operatorOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={config.operator === option.value}
              onClick={() => {
                data?.onChange?.({ operator: option.value });
                setOperatorAnchor(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Popover>

        <TextField
          size="small"
          label="Value"
          placeholder="Enter filter value"
          value={config.value}
          onChange={(e) => data?.onChange?.({ value: e.target.value })}
        />
      </Box>
    </BaseNode>
  );
};

export default FilterNode;