#!/usr/bin/env python3
"""
IT Configuration Test Runner

This script runs all IT configuration tests and provides a summary of results.
It can be used for continuous integration or manual testing.

Usage:
    python run_it_tests.py              # Run all IT tests
    python run_it_tests.py --verbose    # Run with verbose output
    python run_it_tests.py --coverage   # Run with coverage report
"""

import subprocess
import sys
import argparse
from pathlib import Path

def run_command(command, description):
    """Run a command and return success status."""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(command)}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ FAILED: {description}")
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        return False
    except FileNotFoundError:
        print(f"❌ COMMAND NOT FOUND: {command[0]}")
        print("Make sure pytest is installed: pip install pytest")
        return False

def main():
    parser = argparse.ArgumentParser(description="Run IT configuration tests")
    parser.add_argument("--verbose", "-v", action="store_true", 
                       help="Verbose output")
    parser.add_argument("--coverage", "-c", action="store_true",
                       help="Run with coverage report")
    parser.add_argument("--specific", "-s", type=str,
                       help="Run specific test file or pattern")
    
    args = parser.parse_args()
    
    # Get the backend directory
    backend_dir = Path(__file__).parent
    
    print("🧪 IT Configuration Test Suite")
    print(f"📂 Running tests from: {backend_dir}")
    
    results = []
    
    if args.specific:
        # Run specific test
        command = ["python", "-m", "pytest"]
        if args.verbose:
            command.append("-v")
        if args.coverage:
            command.extend(["--cov=app.services.calculations", "--cov-report=html"])
        command.append(args.specific)
        
        success = run_command(command, f"Specific test: {args.specific}")
        results.append(("Specific Test", success))
        
    else:
        # Run IT configuration tests
        test_commands = [
            (
                ["python", "-m", "pytest", "app/services/calculations/test_it_config.py"] + 
                (["-v"] if args.verbose else []) +
                (["--cov=app.services.calculations.it_config", "--cov-report=html"] if args.coverage else []),
                "IT Configuration Module Tests"
            ),
            (
                ["python", "-m", "pytest", "app/services/calculations/test_main.py"] +
                (["-v"] if args.verbose else []) +
                (["--cov=app.services.calculations.main", "--cov-report=html", "--cov-append"] if args.coverage else []),
                "Main Calculation Tests (including IT CAPEX integration)"
            ),
        ]
        
        # Run all test commands
        for command, description in test_commands:
            success = run_command(command, description)
            results.append((description, success))
    
    # Print summary
    print(f"\n{'='*60}")
    print("🧪 TEST SUMMARY")
    print(f"{'='*60}")
    
    all_passed = True
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status}: {test_name}")
        if not success:
            all_passed = False
    
    print(f"\n{'='*60}")
    if all_passed:
        print("🎉 ALL TESTS PASSED!")
        print("\n💡 Your IT configuration module is working correctly!")
        if args.coverage:
            print("📊 Coverage report generated in htmlcov/index.html")
    else:
        print("⚠️  SOME TESTS FAILED")
        print("\n🔧 Please fix the failing tests before proceeding.")
    
    print(f"{'='*60}")
    
    # Exit with appropriate code
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
