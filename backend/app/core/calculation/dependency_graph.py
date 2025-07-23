# DAG construction and topological sort
from typing import Dict, List
from collections import deque

from .parameter import Parameter


class DependencyGraph:
    def __init__(self, parameters: List[Parameter]):
        self.parameters = parameters
        self.graph = self.build_graph()
        self.param_names = {p.name for p in parameters}
        
        self.validate_graph()

    def build_graph(self) -> Dict[str, List[str]]:
        graph = {}
        for param in self.parameters:
            if param.type == "CALCULATION":
                graph[param.name] = param.dependencies
            else:
                graph[param.name] = []
        return graph

    def validate_graph(self):
        for param_name, deps in self.graph.items():
            for dep in deps:
                if dep not in self.param_names:
                    raise ValueError(f"Parameter {param_name} depends on undefined parameter '{dep}'")
    
    
    def topological_sort(self) -> List[str]:
        in_degree = {node: 0 for node in self.graph}
        for node, deps in self.graph.items():
            for dep in deps:
                in_degree[node] += 1

        queue = deque([node for node, degree in in_degree.items() if degree == 0])
        sorted_result = []

        while queue:
            node = queue.popleft()
            sorted_result.append(node)

            for dependant in self.graph:
                if node in self.graph[dependant]:
                    in_degree[dependant] -= 1
                    if in_degree[dependant] == 0:
                        queue.append(dependant)

        if len(sorted_result) != len(self.graph):
            raise ValueError("Cycle detected in parameter dependencies")

        return sorted_result
