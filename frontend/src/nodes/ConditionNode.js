import React, { useState } from 'react';
import BaseNode from './BaseNode';
import {
  TextField,
  Box,
  Typography,
  Switch,
  MenuItem,
  Popover,
} from '@mui/material';
import RuleIcon from '@mui/icons-material/Rule';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const ConditionNode = ({ data }) => {
  const config = {
    operator: data?.operator || 'greater',
    value: data?.value || '',
    invert: data?.invert || false,
  };

  const [operatorAnchor, setOperatorAnchor] = useState(null);

  const operatorOptions = [
    { value: 'equals', label: '=' },
    { value: 'greater', label: '>' },
    { value: 'less', label: '<' },
    { value: 'notequal', label: '≠' },
  ];

  const getLabel = (value) =>
    operatorOptions.find((o) => o.value === value)?.label;

  return (
    <BaseNode
      data={data}
      type="condition"
      inputHandles={1}
      outputHandles={2}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <RuleIcon sx={{ color: '#f97316', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Conditional Logic
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ flex: 1 }}>
            If:
          </Typography>

          <Box sx={{ flex: 2 }}>
            <Box
              onClick={(e) => setOperatorAnchor(e.currentTarget)}
              sx={{
                border: '1px solid #cbd5e1',
                borderRadius: 1,
                p: 1,
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
                {getLabel(config.operator)}
              </Typography>
              <ArrowDropDownIcon sx={{ color: '#64748b' }} />
            </Box>
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
          placeholder="Threshold value"
          fullWidth
          value={config.value}
          onChange={(e) => data?.onChange?.({ value: e.target.value })}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1,
          }}
        >
          <Typography variant="body2">Invert Condition</Typography>
          <Switch
            size="small"
            color="warning"
            checked={config.invert}
            onChange={(e) =>
              data?.onChange?.({ invert: e.target.checked })
            }
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
            pt: 2,
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
            True Path
          </Typography>
          <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
            False Path
          </Typography>
        </Box>
      </Box>
    </BaseNode>
  );
};

export default ConditionNode;