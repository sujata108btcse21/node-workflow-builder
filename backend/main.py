from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="VectorShift Pipeline Parser API",
    description="API for parsing pipeline nodes and edges",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class NodeData(BaseModel):
    """Node data model"""
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class EdgeData(BaseModel):
    """Edge data model"""
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class PipelineRequest(BaseModel):
    """Request model for pipeline parsing"""
    nodes: List[NodeData]
    edges: List[EdgeData]

class PipelineResponse(BaseModel):
    """Response model for pipeline parsing"""
    num_nodes: int
    num_edges: int
    is_dag: bool
    message: Optional[str] = None

def check_is_dag(nodes: List[NodeData], edges: List[EdgeData]) -> bool:
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG)
    
    Args:
        nodes: List of nodes
        edges: List of edges
    
    Returns:
        bool: True if graph is a DAG (no cycles), False otherwise
    """
    try:
        # Build adjacency list
        adj_list = {}
        node_ids = [node.id for node in nodes]
        
        # Initialize adjacency list for all nodes
        for node_id in node_ids:
            adj_list[node_id] = []
        
        # Add edges to adjacency list
        for edge in edges:
            if edge.source in adj_list:
                adj_list[edge.source].append(edge.target)
        
        # Colors: 0 = unvisited, 1 = visiting, 2 = visited
        colors = {node_id: 0 for node_id in node_ids}
        
        def has_cycle_dfs(node_id: str) -> bool:
            """DFS helper to detect cycles"""
            if colors[node_id] == 1:
                return True
            if colors[node_id] == 2:
                return False
            
            colors[node_id] = 1
            
            for neighbor in adj_list.get(node_id, []):
                if has_cycle_dfs(neighbor):
                    return True
            
            colors[node_id] = 2
            return False
        
        # Check each node for cycles
        for node_id in node_ids:
            if colors[node_id] == 0:
                if has_cycle_dfs(node_id):
                    return False
        
        return True
    
    except Exception as e:
        logger.error(f"Error checking DAG: {e}")
        return False

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to VectorShift Pipeline Parser API",
        "version": "1.0.0",
        "endpoints": {
            "parse_pipeline": "POST /pipelines/parse",
            "health": "GET /health",
            "docs": "GET /docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2024-01-18T10:00:00Z"
    }

@app.post("/pipelines/parse", response_model=PipelineResponse)
async def parse_pipeline(pipeline: PipelineRequest):
    """
    Parse pipeline data and return analysis results
    
    Args:
        pipeline: Pipeline data containing nodes and edges
    
    Returns:
        PipelineResponse: Analysis results including node/edge counts and DAG status
    """
    try:
        logger.info(f"Received pipeline with {len(pipeline.nodes)} nodes and {len(pipeline.edges)} edges")
        
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        is_dag = check_is_dag(pipeline.nodes, pipeline.edges)
        
        message = f"Pipeline parsed successfully. {'Graph is a DAG.' if is_dag else 'Graph contains cycles.'}"
        
        return PipelineResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag,
            message=message
        )
        
    except Exception as e:
        logger.error(f"Error parsing pipeline: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing pipeline: {str(e)}"
        )

@app.get("/pipelines/test")
async def test_endpoint():
    """Test endpoint with sample data"""
    sample_nodes = [
        {
            "id": "1",
            "type": "input",
            "position": {"x": 100, "y": 100},
            "data": {"label": "Input Node"}
        },
        {
            "id": "2",
            "type": "text",
            "position": {"x": 300, "y": 100},
            "data": {"label": "Text Node"}
        }
    ]
    
    sample_edges = [
        {
            "id": "e1-2",
            "source": "1",
            "target": "2",
            "sourceHandle": "output",
            "targetHandle": "input"
        }
    ]
    
    response = await parse_pipeline(PipelineRequest(
        nodes=[NodeData(**node) for node in sample_nodes],
        edges=[EdgeData(**edge) for edge in sample_edges]
    ))
    
    return {
        "test_data": {
            "nodes": sample_nodes,
            "edges": sample_edges
        },
        "analysis": response.dict()
    }