
import ast
from typing import Any, Dict, Set, Tuple, Union


class FormulaParser:
    def __init__(self):
        self.ops = {
            ast.Add: "Add",
            ast.Sub: "Subtract", 
            ast.Mult: "Multiply",
            ast.Div: "Divide",
            ast.Pow: "Power"
        }
    
    def build_ast(self, node: ast.AST) -> Union[Dict[str, Any], str, int, float]:
        if isinstance(node, ast.BinOp):
            return {
                "type": self.ops[type(node.op)],
                "left": self.build_ast(node.left),
                "right": self.build_ast(node.right)
            }
        elif isinstance(node, ast.UnaryOp):
            return {
                "type": f"Unary_{type(node.op).__name__}",
                "operand": self.build_ast(node.operand)
            }
        elif isinstance(node, ast.Constant):  # Python >= 3.8
            return node.value
        elif isinstance(node, ast.Name):
            return node.id
        elif isinstance(node, ast.Call):
            # Handle function calls by returning the function name
            return self.build_ast(node.func)
        elif isinstance(node, ast.Compare):
            # Handle comparison operations by returning the left operand
            return self.build_ast(node.left)
        else:
            raise ValueError(f"Unsupported node type: {type(node)}")
    
    def extract_variables(self, node: ast.AST, vars_set: Set[str] = None) -> Set[str]:
        if vars_set is None:
            vars_set = set()

        if isinstance(node, ast.BinOp):
            self.extract_variables(node.left, vars_set)
            self.extract_variables(node.right, vars_set)
        elif isinstance(node, ast.UnaryOp):
            self.extract_variables(node.operand, vars_set)
        elif isinstance(node, ast.Name):
            vars_set.add(node.id)
        elif isinstance(node, ast.Call):
            # Extract function name and arguments
            self.extract_variables(node.func, vars_set)
            for arg in node.args:
                self.extract_variables(arg, vars_set)
        elif isinstance(node, ast.Compare):
            # Extract left operand and all comparators
            self.extract_variables(node.left, vars_set)
            for comparator in node.comparators:
                self.extract_variables(comparator, vars_set)

        return vars_set
    
    def parse_formula_to_ast(self, formula: str) -> Tuple[Dict[str, Any], Set[str]]:
        try:
            # Parse the formula string into a Python AST
            expr_ast = ast.parse(formula, mode='eval')
            root_node = expr_ast.body

            # Convert to custom AST representation
            custom_ast = self.build_ast(root_node)
            
            # Extract variable dependencies
            dependencies = self.extract_variables(root_node)

            return custom_ast, dependencies
        except Exception as e:
            raise ValueError(f"Error parsing formula: {e}")

def parse_formula_to_ast(formula: str) -> Tuple[Dict[str, Any], Set[str]]:
    parser = FormulaParser()
    return parser.parse_formula_to_ast(formula)
