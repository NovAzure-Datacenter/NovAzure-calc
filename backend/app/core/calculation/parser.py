import ast
from typing import Any, Dict, Optional, Set, Tuple, Union


class FormulaParser:
    def __init__(self):
        self.ops = {
            ast.Add: "Add",
            ast.Sub: "Subtract",
            ast.Mult: "Multiply",
            ast.Div: "Divide",
            ast.Pow: "Power",
        }

    def parse_formula_to_ast(self, formula: str) -> Tuple[Union[Dict[str, Any], str, int, float], Set[str]]:
        try:
            expr_ast = ast.parse(formula, mode="eval")
            root_node = expr_ast.body

            custom_ast = self._build_ast(root_node)
            dependencies = self._extract_variables(root_node)

            return custom_ast, dependencies
        except Exception as e:
            raise ValueError(f"Error parsing formula: {e}")

    def _build_ast(self, node: ast.AST) -> Union[Dict[str, Any], str, int, float]:
        if isinstance(node, ast.BinOp):
            return {
                "type": self.ops[type(node.op)],
                "left": self._build_ast(node.left),
                "right": self._build_ast(node.right),
            }

        elif isinstance(node, ast.UnaryOp):
            return {
                "type": f"Unary_{type(node.op).__name__}",
                "operand": self._build_ast(node.operand),
            }

        elif isinstance(node, ast.Constant) and isinstance(node.value, (float, int)):
            return node.value

        elif isinstance(node, ast.Name):
            return node.id

        else:
            raise ValueError(f"Unsupported node type: {type(node).__name__}")

    def _extract_variables(self, node: ast.AST, vars_set: Optional[Set[str]] = None) -> Set[str]:
        if vars_set is None:
            vars_set = set()

        if isinstance(node, ast.BinOp):
            self._extract_variables(node.left, vars_set)
            self._extract_variables(node.right, vars_set)

        elif isinstance(node, ast.UnaryOp):
            self._extract_variables(node.operand, vars_set)

        elif isinstance(node, ast.Name):
            vars_set.add(node.id)

        return vars_set


def parse_formula_to_ast(formula: str) -> Tuple[Union[Dict[str, Any], str, int, float], Set[str]]:
    parser = FormulaParser()
    return parser.parse_formula_to_ast(formula)
