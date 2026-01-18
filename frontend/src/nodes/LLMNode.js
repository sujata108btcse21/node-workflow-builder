import React, { useState } from 'react';
import BaseNode from './BaseNode';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  Popover,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const LLMNode = ({ data }) => {
  const config = {
    model: data?.model || 'gpt-4',
    prompt: data?.prompt || '',
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    data?.onChange?.({ model: value });
    handleClose();
  };

  const modelOptions = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-2', label: 'Claude 2' },
    { value: 'llama-2', label: 'Llama 2' },
  ];

  const selectedOption = modelOptions.find(
    (opt) => opt.value === config.model
  );

  return (
    <BaseNode data={data} type="llm">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 500, ml: 0.5 }}
          >
            Model
          </Typography>

          <Box
            onClick={handleClick}
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
            <Typography variant="body2" sx={{ color: '#1e293b' }}>
              {selectedOption?.label || 'Select model...'}
            </Typography>
            <ArrowDropDownIcon sx={{ color: '#64748b' }} />
          </Box>
        </Box>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              width: anchorEl ? anchorEl.clientWidth : 200,
              maxHeight: 200,
              mt: 0.5,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            },
          }}
        >
          {modelOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={config.model === option.value}
              onClick={() => handleSelect(option.value)}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: '#3b82f610',
                  color: '#3b82f6',
                  fontWeight: 600,
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#3b82f615',
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Popover>

        <TextField
          size="small"
          multiline
          rows={2}
          label="Prompt"
          placeholder="Enter prompt..."
          value={config.prompt}
          onChange={(e) =>
            data?.onChange?.({ prompt: e.target.value })
          }
        />
      </Box>
    </BaseNode>
  );
};

export default LLMNode;