from parser import FormulaParser

# Test with variables (correct usage)
test_cases = [
    "exp(growth_rate, time_period, time_unit)",
    "exp(x, y, 'years')",
    "exp(rate, period, unit)",
    "exp(0.05, 1, 'years')",
]

parser = FormulaParser()

print("Testing with Variables (Correct Usage):")
print("=" * 50)

for formula in test_cases:
    try:
        ast_result, deps = parser.parse_formula_to_ast(formula)
        print(f"✅ {formula}")
        print(f"   AST: {ast_result}")
        print(f"   Dependencies: {deps}")
        print()
    except Exception as e:
        print(f"❌ {formula}")
        print(f"   ERROR: {e}")
        print()

print("Test completed!") 