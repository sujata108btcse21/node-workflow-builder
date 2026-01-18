import React, { useState } from 'react';
import BaseNode from './BaseNode';
import { 
  TextField, 
  MenuItem, 
  Box, 
  Typography,
  Popover
} from '@mui/material';
import TransformIcon from '@mui/icons-material/Transform';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const TransformNode = ({ data }) => {
  const config = {
    operation: data?.operation || 'uppercase',
    pattern: data?.pattern || '',
    replacement: data?.replacement || '',
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    if (data?.onChange) {
      data.onChange({ operation: value });
    }
    handleClose();
  };

  const operationOptions = [
    { value: 'uppercase', label: 'To Uppercase' },
    { value: 'lowercase', label: 'To Lowercase' },
    { value: 'trim', label: 'Trim Whitespace' },
    { value: 'extract', label: 'Extract Pattern' },
    { value: 'replace', label: 'Find & Replace' },
  ];

  const selectedOption = operationOptions.find(opt => opt.value === config.operation);

  return (
    <BaseNode 
      data={data} 
      type="transform"
      inputHandles={1}
      outputHandles={1}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TransformIcon sx={{ color: '#ec4899', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Data Transformation
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="caption" sx={{ 
            color: 'text.secondary', 
            fontWeight: 500,
            ml: 0.5 
          }}>
            Operation
          </Typography>
          <Box
            sx={{
              border: '1px solid #cbd5e1',
              borderRadius: 1,
              p: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: 'white',
              minHeight: '40px',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f8fafc',
              },
            }}
            onClick={handleClick}
          >
            <Typography variant="body2" sx={{ color: '#1e293b' }}>
              {selectedOption?.label || 'Select operation...'}
            </Typography>
            <ArrowDropDownIcon sx={{ color: '#64748b' }} />
          </Box>
        </Box>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              width: anchorEl ? anchorEl.clientWidth : 200,
              maxHeight: 200,
              overflow: 'auto',
              mt: 0.5,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e2e8f0',
            }
          }}
        >
          {operationOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={config.operation === option.value}
              onClick={() => handleSelect(option.value)}
              sx={{
                py: 1.5,
                px: 2,
                borderBottom: '1px solid #f1f5f9',
                '&:last-child': { borderBottom: 'none' },
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
                '&.Mui-selected': {
                  backgroundColor: '#ec489910',
                  color: '#ec4899',
                  fontWeight: 600,
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#ec489915',
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Popover>
        
        <TextField
          size="small"
          label="Pattern (optional)"
          placeholder="e.g., [A-Z]+"
          variant="outlined"
          value={config.pattern}
          onChange={(e) => data?.onChange?.({ pattern: e.target.value })}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '0.875rem',
            },
            '& .MuiOutlinedInput-root': {
              fontSize: '0.875rem',
            }
          }}
        />
        
        <TextField
          size="small"
          label="Replacement (optional)"
          placeholder="e.g., MATCH"
          variant="outlined"
          value={config.replacement}
          onChange={(e) => data?.onChange?.({ replacement: e.target.value })}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '0.875rem',
            },
            '& .MuiOutlinedInput-root': {
              fontSize: '0.875rem',
            }
          }}
        />
      </Box>
    </BaseNode>
  );
};

export default TransformNode;