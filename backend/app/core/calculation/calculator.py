# Calculator
from typing import Dict, List

from .dependency_graph import DependencyGraph
from .parameter import Parameter


class Calculator:
    def __init__(self, parameters: List[Parameter], inputs: Dict[str, float]):
        self.parameters = parameters
        self.inputs = inputs
        self.context = inputs.copy()
        self.param_map = {p.name: p for p in parameters}

    def evaluate(self, targets: List[str]) -> Dict[str, List[float]]:
        graph = DependencyGraph(self.parameters)
        evaluation_order = graph.topological_sort()

        for param_name in evaluation_order:
            param = self.param_map[param_name]

            if param_name not in self.context:
                param.resolve_value(self.context)

                if param.result is None:
                    raise ValueError(f"Parameter '{param_name}' could not be resolved.")

                self.context[param_name] = param.result

        results = []
        for target in targets:
            if target not in self.context:
                raise ValueError(f"Target '{target}' was not resolved.")
            results.append(self.context[target])

        return {"result": results}
