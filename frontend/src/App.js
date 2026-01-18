import React, { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import './App.css';

// Import all nodes
import TextNode from './nodes/TextNode';
import InputNode from './nodes/InputNode';
import OutputNode from './nodes/OutputNode';
import LLMNode from './nodes/LLMNode';
import FilterNode from './nodes/FilterNode';
import TransformNode from './nodes/TransformNode';
import AggregateNode from './nodes/AggregateNode';
import ConditionNode from './nodes/ConditionNode';
import JoinNode from './nodes/JoinNode';

// Register all node types
const nodeTypes = {
  text: TextNode,
  input: InputNode,
  output: OutputNode,
  llm: LLMNode,
  filter: FilterNode,
  transform: TransformNode,
  aggregate: AggregateNode,
  condition: ConditionNode,
  join: JoinNode,
};

const generateId = (type) => `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createInitialNodes = () => [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 100, y: 50 },
    data: { label: 'Data Source' },
  },
  {
    id: 'text-1',
    type: 'text',
    position: { x: 100, y: 150 },
    data: { 
      label: 'Text Processor',
      content: 'Process {{data}} with {{algorithm}}'
    },
  },
  {
    id: 'filter-1',
    type: 'filter',
    position: { x: 100, y: 300 },
    data: { label: 'Data Filter' },
  },
  {
    id: 'transform-1',
    type: 'transform',
    position: { x: 300, y: 150 },
    data: { label: 'Data Transformer' },
  },
  {
    id: 'aggregate-1',
    type: 'aggregate',
    position: { x: 300, y: 300 },
    data: { label: 'Aggregator' },
  },
  {
    id: 'condition-1',
    type: 'condition',
    position: { x: 500, y: 150 },
    data: { label: 'Condition Check' },
  },
  {
    id: 'join-1',
    type: 'join',
    position: { x: 500, y: 300 },
    data: { label: 'Data Joiner' },
  },
  {
    id: 'llm-1',
    type: 'llm',
    position: { x: 700, y: 150 },
    data: { 
      label: 'AI Processor',
      model: 'gpt-4',
      prompt: 'Analyze the results'
    },
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 700, y: 300 },
    data: { label: 'Results Output' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'input-1', target: 'text-1', animated: true },
  { id: 'e2-3', source: 'text-1', target: 'filter-1' },
  { id: 'e2-4', source: 'text-1', target: 'transform-1' },
  { id: 'e3-5', source: 'filter-1', target: 'aggregate-1' },
  { id: 'e4-5', source: 'transform-1', target: 'aggregate-1' },
  { id: 'e5-6', source: 'aggregate-1', target: 'condition-1' },
  { id: 'e5-7', source: 'aggregate-1', target: 'join-1' },
  { id: 'e6-8', source: 'condition-1', target: 'llm-1' },
  { id: 'e7-8', source: 'join-1', target: 'llm-1' },
  { id: 'e8-9', source: 'llm-1', target: 'output-1', animated: true },
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLoading, setIsLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeChange = useCallback(
    (nodeId) => (updatedData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...updatedData,
                  onChange: handleNodeChange(nodeId),
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setSubmitResult(null);
    
    try {
      const { onSubmit } = await import('./submit');
      const result = await onSubmit(nodes, edges);
      setSubmitResult(result);
      setShowResultDialog(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitResult({ 
        error: true, 
        message: error.message || 'Failed to submit pipeline'
      });
      setShowResultDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNode = (type, label) => {
    const newNodeId = generateId(type);
    
    const defaultConfigs = {
      input: { label: label || 'Input Node' },
      output: { label: label || 'Output Node' },
      text: { 
        label: label || 'Text Node',
        content: 'Enter text here...'
      },
      llm: { 
        label: label || 'AI Processor',
        model: 'gpt-4',
        prompt: 'Enter your prompt here...'
      },
      filter: { 
        label: label || 'Filter Node',
        field: 'value',
        operator: 'greater',
        value: ''
      },
      transform: { 
        label: label || 'Transform Node',
        operation: 'uppercase',
        pattern: '',
        replacement: ''
      },
      aggregate: { 
        label: label || 'Aggregate Node',
        groupBy: 'category',
        aggregation: 'sum',
        outputField: 'result'
      },
      condition: { 
        label: label || 'Condition Node',
        operator: 'greater',
        value: '',
        invert: false
      },
      join: { 
        label: label || 'Join Node',
        joinType: 'inner',
        leftKey: '',
        rightKey: ''
      },
    };

    const newNode = {
      id: newNodeId,
      type: type,
      position: {
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 50,
      },
      data: {
        ...defaultConfigs[type],
        onChange: handleNodeChange(newNodeId),
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  const handleReset = () => {
    setNodes(createInitialNodes());
    setEdges(initialEdges);
    setSubmitResult(null);
    setShowResultDialog(false);
  };

  const nodeTypesList = [
    { type: 'input', label: 'Input', color: '#10b981', icon: '▶️', desc: 'Start data source' },
    { type: 'output', label: 'Output', color: '#ef4444', icon: '⏹️', desc: 'Final results' },
    { type: 'text', label: 'Text', color: '#f59e0b', icon: '📝', desc: 'Text processing' },
    { type: 'llm', label: 'LLM', color: '#3b82f6', icon: '🤖', desc: 'AI processing' },
    { type: 'filter', label: 'Filter', color: '#8b5cf6', icon: '🔍', desc: 'Filter data' },
    { type: 'transform', label: 'Transform', color: '#ec4899', icon: '🔄', desc: 'Transform data' },
    { type: 'aggregate', label: 'Aggregate', color: '#14b8a6', icon: '📊', desc: 'Aggregate data' },
    { type: 'condition', label: 'Condition', color: '#f97316', icon: '⚖️', desc: 'Conditional logic' },
    { type: 'join', label: 'Join', color: '#6366f1', icon: '🔗', desc: 'Join data sources' },
  ];

  const nodesWithHandlers = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onChange: handleNodeChange(node.id),
    },
  }));

  return (
    <Box sx={{ display: 'flex', height: '100vh', p: 2, gap: 2, bgcolor: '#f8fafc' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          width: 320, 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#334155',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            VectorShift
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
            Node-based workflow builder • Assessment
          </Typography>
          <Chip 
            icon={<InfoIcon />}
            label="Drag & drop nodes to connect"
            size="small"
            variant="outlined"
            sx={{ 
              fontSize: 11, 
              height: 24,
              borderColor: '#cbd5e1',
              color: '#475569',
            }}
          />
        </Box>

        <Typography variant="subtitle1" sx={{ 
          mb: 2, 
          fontWeight: 600, 
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <span>📦</span> Node Types
        </Typography>
        
        <List dense sx={{ mb: 3, maxHeight: 400, overflowY: 'auto', pr: 1 }}>
          {nodeTypesList.map((nodeType) => (
            <ListItem
              key={nodeType.type}
              button
              onClick={() => handleAddNode(nodeType.type, nodeType.label)}
              sx={{
                mb: 1,
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: nodeType.color,
                  backgroundColor: `${nodeType.color}10`,
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '3px',
                  backgroundColor: nodeType.color,
                  mr: 2,
                  flexShrink: 0,
                }}
              />
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                      {nodeType.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {nodeType.icon}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: 11 }}>
                    {nodeType.desc}
                  </Typography>
                }
                sx={{ my: 0.5 }}
              />
              <AddIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: 16,
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(90deg, #5a6fd8, #6b4090)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: '#cbd5e1',
              },
            }}
          >
            {isLoading ? 'Processing...' : 'Submit Pipeline'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              borderRadius: 2,
              py: 1,
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            Reset Pipeline
          </Button>

          {submitResult && !showResultDialog && (
            <Alert 
              severity={submitResult.error ? "error" : submitResult.is_dag ? "success" : "warning"}
              sx={{ borderRadius: 2 }}
              onClick={() => setShowResultDialog(true)}
              style={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {submitResult.error ? 'Error' : 'Analysis Complete'}
              </Typography>
              {!submitResult.error && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Click to view details
                </Typography>
              )}
            </Alert>
          )}

          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1, fontWeight: 600 }}>
              Pipeline Stats:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`${nodes.length} nodes`}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: 12, 
                  fontWeight: 500,
                  borderColor: '#cbd5e1',
                  color: '#475569',
                }}
              />
              <Chip 
                label={`${edges.length} edges`}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: 12, 
                  fontWeight: 500,
                  borderColor: '#cbd5e1',
                  color: '#475569',
                }}
              />
              <Chip 
                icon={<InfoIcon sx={{ fontSize: 14 }} />}
                label="Click nodes to configure"
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: 11, 
                  fontWeight: 500,
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  height: 24,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper 
        elevation={3}
        sx={{ 
          flex: 1, 
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #e2e8f0',
        }}
      >
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background 
            variant="dots" 
            gap={25} 
            size={1} 
            color="#cbd5e1"
          />
          <Controls 
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
            showInteractive={false}
          />
          <MiniMap 
            nodeStrokeColor={(n) => {
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
              };
              return colors[n.type] || '#94a3b8';
            }}
            nodeColor="#ffffff"
            style={{
              background: 'white',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              right: 10,
              bottom: 10,
            }}
          />
        </ReactFlow>
      </Paper>

      <Dialog 
        open={showResultDialog} 
        onClose={() => setShowResultDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: submitResult?.error 
            ? 'linear-gradient(90deg, #ef4444, #dc2626)' 
            : submitResult?.is_dag 
              ? 'linear-gradient(90deg, #10b981, #059669)'
              : 'linear-gradient(90deg, #f59e0b, #d97706)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PlayArrowIcon />
            Pipeline Analysis Results
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {submitResult?.error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Submission Failed
              </Typography>
              <Typography variant="body2">
                {submitResult.message || 'An error occurred while processing the pipeline.'}
              </Typography>
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-around',
                alignItems: 'center',
                mb: 2
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                    {submitResult?.num_nodes || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Nodes
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
                    {submitResult?.num_edges || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Edges
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                p: 2, 
                borderRadius: 2,
                bgcolor: submitResult?.is_dag ? '#f0fdf4' : '#fef3c7',
                border: `1px solid ${submitResult?.is_dag ? '#bbf7d0' : '#fde68a'}`,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%',
                    bgcolor: submitResult?.is_dag ? '#10b981' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 20,
                  }}>
                    {submitResult?.is_dag ? '✓' : '!'}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Directed Acyclic Graph: {submitResult?.is_dag ? '✅ Valid' : '⚠️ Invalid'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {submitResult?.is_dag 
                        ? 'Pipeline has no cycles and can be executed sequentially.'
                        : 'Pipeline contains cycles and cannot be executed as a DAG.'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ 
                p: 2, 
                borderRadius: 2,
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#475569' }}>
                  Pipeline Status:
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {submitResult?.is_dag 
                    ? '✅ This pipeline can be executed successfully. All nodes are properly connected without cycles.'
                    : '⚠️ This pipeline contains circular dependencies. Review connections to remove cycles.'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button 
            onClick={() => setShowResultDialog(false)}
            sx={{ color: '#64748b' }}
          >
            Close
          </Button>
          {!submitResult?.error && (
            <Button 
              variant="contained"
              onClick={() => {
                setShowResultDialog(false);
                handleReset();
              }}
              sx={{ 
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                borderRadius: 2,
              }}
            >
              Create New Pipeline
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}