import React, { useState } from 'react';
import BaseNode from './BaseNode';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  Popover,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const AggregateNode = ({ data }) => {
  const config = {
    groupBy: data?.groupBy || 'category',
    aggregation: data?.aggregation || 'sum',
    outputField: data?.outputField || 'result',
  };

  const [groupByAnchor, setGroupByAnchor] = useState(null);
  const [aggregationAnchor, setAggregationAnchor] = useState(null);

  const groupByOptions = [
    { value: 'category', label: 'Category' },
    { value: 'date', label: 'Date' },
    { value: 'type', label: 'Type' },
  ];

  const aggregationOptions = [
    { value: 'sum', label: 'Sum' },
    { value: 'average', label: 'Average' },
    { value: 'count', label: 'Count' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' },
  ];

  const getLabel = (options, value) =>
    options.find((o) => o.value === value)?.label;

  return (
    <BaseNode
      data={data}
      type="aggregate"
      inputHandles={2}
      outputHandles={1}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CalculateIcon sx={{ color: '#14b8a6', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Aggregation
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
            Group By
          </Typography>

          <Box
            onClick={(e) => setGroupByAnchor(e.currentTarget)}
            sx={{
              border: '1px solid #cbd5e1',
              borderRadius: 1,
              p: 1,
              minHeight: '40px',
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
              {getLabel(groupByOptions, config.groupBy)}
            </Typography>
            <ArrowDropDownIcon sx={{ color: '#64748b' }} />
          </Box>
        </Box>

        <Popover
          open={Boolean(groupByAnchor)}
          anchorEl={groupByAnchor}
          onClose={() => setGroupByAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              width: groupByAnchor?.clientWidth,
              border: '1px solid #e2e8f0',
            },
          }}
        >
          {groupByOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={config.groupBy === option.value}
              onClick={() => {
                data?.onChange?.({ groupBy: option.value });
                setGroupByAnchor(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Popover>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
            Aggregation
          </Typography>

          <Box
            onClick={(e) => setAggregationAnchor(e.currentTarget)}
            sx={{
              border: '1px solid #cbd5e1',
              borderRadius: 1,
              p: 1,
              minHeight: '40px',
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
              {getLabel(aggregationOptions, config.aggregation)}
            </Typography>
            <ArrowDropDownIcon sx={{ color: '#64748b' }} />
          </Box>
        </Box>

        <Popover
          open={Boolean(aggregationAnchor)}
          anchorEl={aggregationAnchor}
          onClose={() => setAggregationAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              width: aggregationAnchor?.clientWidth,
              border: '1px solid #e2e8f0',
            },
          }}
        >
          {aggregationOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={config.aggregation === option.value}
              onClick={() => {
                data?.onChange?.({ aggregation: option.value });
                setAggregationAnchor(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Popover>

        <TextField
          size="small"
          label="Output Field Name"
          placeholder="e.g., total_sales"
          value={config.outputField}
          onChange={(e) =>
            data?.onChange?.({ outputField: e.target.value })
          }
        />
      </Box>
    </BaseNode>
  );
};

export default AggregateNode;