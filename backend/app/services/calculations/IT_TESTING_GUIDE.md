# IT Configuration Testing Guide

This directory contains comprehensive tests for the IT configuration module and its integration with the main calculation system.

## 📁 Test Files

### `test_it_config.py`
**Purpose**: Unit tests for all IT configuration functions
**Coverage**: 
- Server power and hardware calculations
- CPU, memory, and network cost calculations
- Bill of Materials (BOM) calculations
- Rack capacity and power planning
- Error handling and edge cases
- Performance testing

**Key Test Categories**:
- ✅ **Power Calculations**: Server power ratings for different data center types
- ✅ **Cost Components**: CPU, memory, network, and BOM cost calculations
- ✅ **Rack Planning**: Cooling capacity constraints and server density
- ✅ **Edge Cases**: Invalid inputs, zero values, negative values
- ✅ **Integration**: Component interactions and full cost calculations

### `test_main.py` (Updated)
**Purpose**: Integration tests for IT costs with main calculation system
**Coverage**:
- IT CAPEX calculation and integration
- Optional IT cost inclusion logic
- Server estimation based on data hall capacity
- Server refresh cycle calculations
- Total cost of ownership with IT costs

**Key Test Categories**:
- ✅ **CAPEX Integration**: IT costs included in total CAPEX when requested
- ✅ **Input Handling**: New IT configuration inputs processed correctly
- ✅ **Cost Logic**: Different costs for General Purpose vs HPC/AI
- ✅ **Refresh Cycles**: Server replacement costs over time
- ✅ **TCO Calculation**: Total cost of ownership including IT equipment

## 🧪 Running Tests

### Option 1: Using the Test Runner (Recommended)
```bash
# Run all IT tests with summary
python run_it_tests.py

# Run with verbose output
python run_it_tests.py --verbose

# Run with coverage report
python run_it_tests.py --coverage

# Run specific test file
python run_it_tests.py --specific app/services/calculations/test_it_config.py
```

### Option 2: Using pytest directly
```bash
# Run IT config tests only
pytest app/services/calculations/test_it_config.py -v

# Run main calculation tests (includes IT integration)
pytest app/services/calculations/test_main.py -v

# Run all tests with coverage
pytest app/services/calculations/ --cov=app.services.calculations --cov-report=html

# Run specific test function
pytest app/services/calculations/test_it_config.py::test_calculate_server_rated_max_power -v
```

### Option 3: Quick validation
```bash
# Just check if imports work
python -c "from app.services.calculations.it_config import *; print('✅ IT config imports successful')"

# Basic function test
python -c "from app.services.calculations.it_config import calculate_typical_it_cost_per_server; print(f'GP Server Cost: ${calculate_typical_it_cost_per_server(\"General Purpose\"):,.2f}')"
```

## 📊 Test Coverage

### IT Configuration Functions Tested:
- [x] `calculate_server_rated_max_power()` - 5 test cases
- [x] `calculate_number_of_server_refreshes()` - 10 test cases  
- [x] `calculate_total_cpu_price_per_server()` - 5 test cases
- [x] `calculate_total_channels()` - 5 test cases
- [x] `calculate_total_memory_cost_per_server()` - 4 test cases
- [x] `calculate_switches_per_rack()` - 6 test cases
- [x] `calculate_total_switch_cost()` - 4 test cases
- [x] `calculate_total_network_cost_per_rack()` - 1 test case
- [x] `calculate_total_network_cost_per_server()` - 1 test case
- [x] `calculate_server_l2_bom()` - 1 test case
- [x] `calculate_total_it_cost_per_server()` - 4 test cases
- [x] `calculate_typical_it_cost_per_server()` - 3 test cases
- [x] `calculate_maximum_number_of_chassis_per_rack_for_air()` - 11 test cases
- [x] `calculate_total_air_power_kw_per_rack()` - 8 test cases

### Additional Integration Tests:
- [x] Full cost calculation workflows
- [x] IT CAPEX integration with main calculations
- [x] Server refresh logic over time  
- [x] Different data center type scenarios
- [x] Error handling for invalid inputs
- [x] Performance benchmarks (100 calculations < 1 second)
- [x] Edge cases: zero values, negative inputs, division by zero
- [x] Memory calculation with different channel configurations
- [x] Network cost allocation and server density scenarios

### Integration Tests:
- [x] Full cost calculation workflows
- [x] IT CAPEX integration with main calculations
- [x] Server refresh logic over time
- [x] Different data center type scenarios
- [x] Error handling for invalid inputs
- [x] Performance benchmarks

## 🎯 Test Scenarios

### Data Center Types Tested:
- **General Purpose**: Standard enterprise servers (1kW, ~$16.5K each calculated cost)
- **HPC/AI**: High-performance servers (2kW, $50K each)
- **Invalid Types**: Error handling for unknown configurations

### Edge Cases Covered:
- Zero or negative input values
- Missing required parameters
- Division by zero scenarios
- Invalid data center types
- Null/None inputs
- Performance under load

### Business Logic Validated:
- Server refresh every 5 years
- 80% utilization of data hall capacity for IT
- Cooling capacity constraints on server density
- Network redundancy requirements (minimum 2 switches)
- Component cost percentages align with industry standards

## 🚨 Common Test Failures

### Import Errors
**Symptom**: `ModuleNotFoundError` when running tests
**Solution**: Ensure you're in the backend directory and the Python path includes the app module
```bash
cd backend
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
python -m pytest
```

### Database Connection Errors
**Symptom**: Tests fail with database connection issues
**Solution**: Ensure database is running or mock database calls for unit tests

### Async Test Issues
**Symptom**: Async tests hanging or failing
**Solution**: Check that `pytest-asyncio` is installed and pytest.ini is configured correctly

### Calculation Mismatches
**Symptom**: Expected vs actual cost calculations don't match
**Solution**: Check if default values have changed or business logic has been updated

## 📈 Performance Benchmarks

The test suite includes performance tests to ensure calculations complete efficiently:
- **Target**: 200 calculations in < 1 second
- **Memory**: Functions should not leak memory during repeated calls
- **Concurrency**: Tests should be thread-safe for parallel execution

## 🔄 Continuous Integration

For CI/CD pipelines, use:
```bash
# Install test dependencies
pip install pytest pytest-asyncio pytest-cov

# Run tests with coverage and JUnit output
pytest app/services/calculations/ \
    --cov=app.services.calculations \
    --cov-report=xml \
    --junitxml=test-results.xml \
    --tb=short
```

## 🛠️ Adding New Tests

When adding new IT configuration functions:

1. **Add unit tests** in `test_it_config.py`:
   ```python
   def test_new_function():
       result = new_function(test_input)
       assert result == expected_output
   ```

2. **Add integration tests** in `test_main.py` if the function affects CAPEX:
   ```python
   @pytest.mark.asyncio
   async def test_new_function_integration():
       # Test integration with main calculate function
   ```

3. **Update this documentation** with new test coverage details

4. **Run the full test suite** to ensure no regressions

## 📚 Further Reading

- [pytest Documentation](https://docs.pytest.org/)
- [Python asyncio Testing](https://docs.python.org/3/library/unittest.html#unittest.IsolatedAsyncioTestCase)
- [Test Coverage Best Practices](https://coverage.readthedocs.io/)
