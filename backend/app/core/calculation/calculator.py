# Calculator
from typing import Dict, List, Union

from .dependency_graph import DependencyGraph
from .parameter import Parameter


class Calculator:
    def __init__(self, parameters: List[Parameter], inputs: Dict[str, Union[float, str]]):
        self.parameters = parameters
        self.inputs = inputs
        self.context = inputs.copy()
        self.param_map = {p.name: p for p in parameters}

    def evaluate(self, target: str) -> Dict[str, float]:
        graph = DependencyGraph(self.parameters)
        evaluation_order = graph.topological_sort()

        for param_name in evaluation_order:
            param = self.param_map[param_name]

            if param_name not in self.context:
                param.resolve_value(self.context)

                if param.result is None:
                    raise ValueError(f"Parameter '{param_name}' could not be resolved.")

                self.context[param_name] = param.result

        if target not in self.context:
            raise ValueError(f"Target '{target}' was not resolved.")

        return {"result": self.context[target]}
