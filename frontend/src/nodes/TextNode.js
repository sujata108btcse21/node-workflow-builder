import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import BaseNode from './BaseNode';
import { TextField, Box, Chip, Typography, IconButton } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const TextNode = ({ data, id }) => {
  const [content, setContent] = useState(data.content || '');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    const regex = /{{([^{}]+)}}/g;
    const matches = [...content.matchAll(regex)];
    const extractedVars = matches
      .map(match => match[1].trim())
      .filter((value, index, self) => self.indexOf(value) === index);
    
    setVariables(extractedVars);
  }, [content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(60, textareaRef.current.scrollHeight);
      textareaRef.current.style.height = `${newHeight}px`;
      
      if (nodeRef.current) {
        const totalHeight = newHeight + 120 + (variables.length > 0 ? 40 : 0);
        nodeRef.current.style.minHeight = `${totalHeight}px`;
      }
    }
  }, [content, variables.length]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const addVariableTemplate = () => {
    setContent(prev => prev + ' {{variable}}');
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const length = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(length - 10, length - 2);
      }
    }, 0);
  };

  return (
    <div ref={nodeRef}>
      {variables.map((variable, index) => (
        <Handle
          key={`input-${variable}`}
          type="target"
          position={Position.Left}
          id={variable}
          style={{
            top: `${((index + 1) * 100) / (variables.length + 1)}%`,
            background: '#f59e0b',
            width: 10,
            height: 10,
            border: '2px solid white',
          }}
        />
      ))}

      <Handle
        type="target"
        position={Position.Left}
        id="default-input"
        style={{
          top: '50%',
          background: '#f59e0b',
          width: 10,
          height: 10,
          border: '2px solid white',
        }}
      />
      
      <BaseNode 
        data={data} 
        type="text" 
        inputHandles={variables.length || 1}
        onDoubleClick={() => textareaRef.current?.focus()}
      >
        <Box sx={{ position: 'relative' }}>
          <TextField
            inputRef={textareaRef}
            fullWidth
            multiline
            value={content}
            onChange={handleContentChange}
            placeholder="Enter text... Use {{variable_name}} for variables"
            size="small"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                lineHeight: 1.5,
              },
            }}
          />
          <IconButton
            size="small"
            onClick={addVariableTemplate}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: '#fef3c7',
              '&:hover': { bgcolor: '#fde68a' },
            }}
            title="Add variable"
          >
            <AutoFixHighIcon sx={{ fontSize: 16, color: '#92400e' }} />
          </IconButton>
        </Box>
        
        {variables.length > 0 && (
          <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="caption" sx={{ 
              color: '#64748b', 
              display: 'flex', 
              alignItems: 'center',
              gap: 0.5,
              mb: 1,
              fontWeight: 600,
            }}>
              <TextFieldsIcon sx={{ fontSize: 14 }} />
              Variables ({variables.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {variables.map(variable => (
                <Chip
                  key={variable}
                  label={variable}
                  size="small"
                  sx={{
                    bgcolor: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.7rem',
                    height: 20,
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </BaseNode>

      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          background: '#f59e0b',
          width: 10,
          height: 10,
          border: '2px solid white',
        }}
      />
    </div>
  );
};

export default TextNode;