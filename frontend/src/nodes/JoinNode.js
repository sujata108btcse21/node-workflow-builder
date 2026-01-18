import React, { useState } from 'react';
import BaseNode from './BaseNode';
import {
  TextField,
  Box,
  Typography,
  MenuItem,
  Popover,
} from '@mui/material';
import MergeIcon from '@mui/icons-material/Merge';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const JoinNode = ({ data }) => {
  const config = {
    joinType: data?.joinType || 'inner',
    leftKey: data?.leftKey || '',
    rightKey: data?.rightKey || '',
  };

  const [joinAnchor, setJoinAnchor] = useState(null);

  const joinOptions = [
    { value: 'inner', label: 'Inner Join' },
    { value: 'left', label: 'Left Join' },
    { value: 'right', label: 'Right Join' },
    { value: 'full', label: 'Full Outer Join' },
  ];

  const getLabel = (value) =>
    joinOptions.find((o) => o.value === value)?.label;

  return (
    <BaseNode
      data={data}
      type="join"
      inputHandles={2}
      outputHandles={1}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <MergeIcon sx={{ color: '#6366f1', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Data Join
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
            Join Type
          </Typography>
          <Box
            onClick={(e) => setJoinAnchor(e.currentTarget)}
            sx={{
              border: '1px solid #cbd5e1',
              borderRadius: 1,
              p: 1,
              mt: 0.5,
              minHeight: '36px',
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
              {getLabel(config.joinType)}
            </Typography>
            <ArrowDropDownIcon sx={{ color: '#64748b' }} />
          </Box>
        </Box>

        <Popover
          open={Boolean(joinAnchor)}
          anchorEl={joinAnchor}
          onClose={() => setJoinAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: {
              width: joinAnchor?.clientWidth,
              border: '1px solid #e2e8f0',
            },
          }}
        >
          {joinOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={config.joinType === option.value}
              onClick={() => {
                data?.onChange?.({ joinType: option.value });
                setJoinAnchor(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Popover>

        <TextField
          size="small"
          label="Left Key"
          placeholder="e.g., user_id"
          value={config.leftKey}
          onChange={(e) => data?.onChange?.({ leftKey: e.target.value })}
        />

        <TextField
          size="small"
          label="Right Key"
          placeholder="e.g., customer_id"
          value={config.rightKey}
          onChange={(e) => data?.onChange?.({ rightKey: e.target.value })}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1,
            p: 1,
            bgcolor: '#f8fafc',
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Inputs: <strong>2</strong> | Output: <strong>1</strong>
          </Typography>
        </Box>
      </Box>
    </BaseNode>
  );
};

export default JoinNode;