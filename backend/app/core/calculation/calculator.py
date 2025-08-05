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
    
    def _set_calculation_units(self):
        for param in self.parameters:
            if param.type != "CALCULATION":
                continue
            units = {
                self.param_map[dep].unit
                for dep in param.dependencies
                if dep in self.param_map and self.param_map[dep].unit
            }
            if len(units) == 1:
                param.unit = units.pop()
            else:
                param.unit = None
