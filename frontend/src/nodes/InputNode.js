import React from 'react';
import BaseNode from './BaseNode';
import { Typography } from '@mui/material';

const InputNode = ({ data }) => {
  return (
    <BaseNode data={data} type="input">
      <Typography variant="body2" color="text.secondary">
        Input node for data sources
      </Typography>
    </BaseNode>
  );
};

export default InputNode;