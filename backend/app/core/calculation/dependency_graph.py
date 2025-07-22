# DAG construction and topological sort
from typing import Dict, List

from app.core.calculation.parameter import Parameter


class DependencyGraph:
    def __init__(self, parameters: list["Parameter"]):
        self.parameters = parameters
        self.graph = self.build_graph()

    def build_graph(self) -> Dict[str, List[str]]:
        graph = {}
        for param in self.parameters:
            if param.type == "CALCULATION":
                graph[param.name] = param.dependencies
            else:
                graph[param.name] = []
        return graph
