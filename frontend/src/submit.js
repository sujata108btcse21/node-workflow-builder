export const onSubmit = async (nodes, edges) => {
  try {
    console.log('Submitting pipeline to backend...', { 
      nodeCount: nodes.length, 
      edgeCount: edges.length 
    });
    
    const response = await fetch('http://localhost:8000/pipelines/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodes: nodes,
        edges: edges
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Backend response:', result);
    
    const alertMessage = `
🚀 VECTORSHIFT PIPELINE ANALYSIS
═════════════════════════════════
📊 Nodes: ${result.num_nodes}
🔗 Edges: ${result.num_edges}
🔄 DAG Status: ${result.is_dag ? '✅ Acyclic (No Cycles)' : '❌ Contains Cycles'}
═════════════════════════════════
${result.is_dag ? '✓ Your pipeline is valid!' : '⚠️  Your pipeline contains circular dependencies!'}
${result.message ? `\nℹ️  ${result.message}` : ''}
    `;
    
    alert(alertMessage);
    
    return result;
    
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      const fallbackAlert = `
⚠️  BACKEND CONNECTION FAILED
═════════════════════════════════
Frontend computed analysis:
📊 Nodes: ${nodes.length}
🔗 Edges: ${edges.length}
═════════════════════════════════
Note: Backend at localhost:8000 is required for DAG analysis.
      `;
      alert(fallbackAlert);
      
      return {
        num_nodes: nodes.length,
        num_edges: edges.length,
        is_dag: null,
        message: 'Backend unavailable - using frontend counts only',
        error: true
      };
    }
    
    alert(`❌ Error submitting pipeline:\n${error.message}`);
    throw error;
  }
};