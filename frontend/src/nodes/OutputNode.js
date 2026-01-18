import React from 'react';
import BaseNode from './BaseNode';
import { Typography } from '@mui/material';

const OutputNode = ({ data }) => {
  return (
    <BaseNode data={data} type="output">
      <Typography variant="body2" color="text.secondary">
        Output node for results
      </Typography>
    </BaseNode>
  );
};

export default OutputNode;