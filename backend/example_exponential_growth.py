#!/usr/bin/env python3
"""
Example: Using the enhanced exponential function for financial modeling
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.calculation.parameter import Parameter

def demonstrate_exponential_growth():
    """Show various examples of exponential growth calculations"""
    
    print("📈 Exponential Growth Examples")
    print("=" * 50)
    
    # Example 1: Compound Interest
    print("\n💰 Example 1: Compound Interest")
    print("-" * 30)
    
    # Investment with 5% annual growth over 3 years
    compound_interest = Parameter({
        "name": "compound_interest",
        "type": "CALCULATION",
        "formula": "principal * exp(growth_rate, time_years, 'years')"
    })
    
    context = {
        "principal": 10000,  # $10,000 initial investment
        "growth_rate": 0.05,  # 5% annual growth rate
        "time_years": 3       # 3 years
    }
    
    result = compound_interest.evaluate_formula(context)
    final_value = context["principal"] * result
    
    print(f"Initial Investment: ${context['principal']:,}")
    print(f"Growth Rate: {context['growth_rate']*100}% per year")
    print(f"Time Period: {context['time_years']} years")
    print(f"Growth Factor: {result:.3f}")
    print(f"Final Value: ${final_value:.2f}")
    
    # Example 2: Population Growth
    print("\n👥 Example 2: Population Growth")
    print("-" * 30)
    
    # Population with 2% annual growth over 10 years
    population_growth = Parameter({
        "name": "population_growth",
        "type": "CALCULATION",
        "formula": "initial_population * exp(growth_rate, time_years, 'years')"
    })
    
    context = {
        "initial_population": 1000000,  # 1 million people
        "growth_rate": 0.02,            # 2% annual growth
        "time_years": 10                # 10 years
    }
    
    result = population_growth.evaluate_formula(context)
    final_population = context["initial_population"] * result
    
    print(f"Initial Population: {context['initial_population']:,}")
    print(f"Growth Rate: {context['growth_rate']*100}% per year")
    print(f"Time Period: {context['time_years']} years")
    print(f"Growth Factor: {result:.3f}")
    print(f"Final Population: {final_population:,.0f}")
    
    # Example 3: Monthly Growth
    print("\n📅 Example 3: Monthly Growth")
    print("-" * 30)
    
    # Investment with 1% monthly growth over 6 months
    monthly_growth = Parameter({
        "name": "monthly_growth",
        "type": "CALCULATION",
        "formula": "initial_amount * exp(monthly_rate, months, 'months')"
    })
    
    context = {
        "initial_amount": 5000,  # $5,000 initial
        "monthly_rate": 0.01,    # 1% monthly growth
        "months": 6               # 6 months
    }
    
    result = monthly_growth.evaluate_formula(context)
    final_amount = context["initial_amount"] * result
    
    print(f"Initial Amount: ${context['initial_amount']:,}")
    print(f"Monthly Growth Rate: {context['monthly_rate']*100}%")
    print(f"Time Period: {context['months']} months")
    print(f"Growth Factor: {result:.3f}")
    print(f"Final Amount: ${final_amount:.2f}")
    
    # Example 4: Different Time Units
    print("\n⏰ Example 4: Different Time Units")
    print("-" * 30)
    
    # Same growth rate, different time units
    growth_rate = 0.05  # 5% annual rate
    
    # 1 year
    yearly = Parameter({
        "name": "yearly",
        "type": "CALCULATION",
        "formula": "exp(rate, 1, 'years')"
    })
    
    # 12 months
    monthly = Parameter({
        "name": "monthly",
        "type": "CALCULATION",
        "formula": "exp(rate, 12, 'months')"
    })
    
    # 365 days
    daily = Parameter({
        "name": "daily",
        "type": "CALCULATION",
        "formula": "exp(rate, 365, 'days')"
    })
    
    context = {"rate": growth_rate}
    
    yearly_result = yearly.evaluate_formula(context)
    monthly_result = monthly.evaluate_formula(context)
    daily_result = daily.evaluate_formula(context)
    
    print(f"Growth Rate: {growth_rate*100}% per year")
    print(f"1 year: {yearly_result:.3f}")
    print(f"12 months: {monthly_result:.3f}")
    print(f"365 days: {daily_result:.3f}")
    print(f"All equal: {yearly_result == monthly_result == daily_result}")
    
    # Example 5: Negative Growth (Decay)
    print("\n📉 Example 5: Negative Growth (Decay)")
    print("-" * 30)
    
    # Asset depreciation with 10% annual decay
    depreciation = Parameter({
        "name": "depreciation",
        "type": "CALCULATION",
        "formula": "initial_value * exp(decay_rate, years, 'years')"
    })
    
    context = {
        "initial_value": 50000,  # $50,000 asset
        "decay_rate": -0.10,     # -10% annual decay
        "years": 5                # 5 years
    }
    
    result = depreciation.evaluate_formula(context)
    final_value = context["initial_value"] * result
    
    print(f"Initial Value: ${context['initial_value']:,}")
    print(f"Decay Rate: {context['decay_rate']*100}% per year")
    print(f"Time Period: {context['years']} years")
    print(f"Decay Factor: {result:.3f}")
    print(f"Final Value: ${final_value:.2f}")

if __name__ == "__main__":
    demonstrate_exponential_growth() 