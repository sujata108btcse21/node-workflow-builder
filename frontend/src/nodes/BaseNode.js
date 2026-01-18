import React from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, Typography, Box } from '@mui/material';

const BaseNode = ({ 
  data, 
  type = 'default',
  inputHandles = 1,
  outputHandles = 1,
  children,
  onDoubleClick 
}) => {
  const getColor = () => {
    const colors = {
      input: '#10b981',
      output: '#ef4444',
      text: '#f59e0b',
      llm: '#3b82f6',
      filter: '#8b5cf6',
      transform: '#ec4899',
      aggregate: '#14b8a6',
      condition: '#f97316',
      join: '#6366f1',
      default: '#64748b'
    };
    return colors[type] || colors.default;
  };

  const color = getColor();

  return (
    <Card 
      onDoubleClick={onDoubleClick}
      sx={{ 
        minWidth: 220,
        maxWidth: 300,
        borderLeft: `4px solid ${color}`,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 8px 30px ${color}40`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {Array.from({ length: inputHandles }).map((_, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`input-${index}`}
          style={{
            top: `${((index + 1) * 100) / (inputHandles + 1)}%`,
            background: color,
            width: 12,
            height: 12,
            border: '2px solid white',
          }}
        />
      ))}

      <Box sx={{ 
        p: 1.5, 
        bgcolor: `${color}15`,
        borderBottom: `1px solid ${color}30`,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ 
            color: color, 
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontSize: '0.7rem',
          }}>
            {type}
          </Typography>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: color 
          }} />
        </Box>
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 600, 
          mt: 0.5,
          color: '#1e293b',
        }}>
          {data.label}
        </Typography>
      </Box>

      <CardContent sx={{ p: 2 }}>
        {children || (
          <Typography variant="body2" color="text.secondary">
            Double-click to configure
          </Typography>
        )}
      </CardContent>

      {Array.from({ length: outputHandles }).map((_, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={`output-${index}`}
          style={{
            top: `${((index + 1) * 100) / (outputHandles + 1)}%`,
            background: color,
            width: 12,
            height: 12,
            border: '2px solid white',
          }}
        />
      ))}
    </Card>
  );
};

export default BaseNode;