'use client';
import { useState } from "react";

export default function NewValueCalculator() {

    const [industry, setIndustry] = useState("Select Industry");
    const [technology, setTechnology] = useState("Select Technology");
    const [solution, setSolution] = useState("Select Solution");
    const [dataCenterType, setDataCenterType] = useState("");
    const [nameplatePower, setNameplatePower] = useState("");
    const [firstYear, setFirstYear] = useState("");
    const [totalYears, setTotalYears] = useState("");
    const [percentageUsed, setPercentageUsed] = useState("");
    const [solutionVariant1, setSolutionVariant1] = useState("");
    const [solutionVariant2, setSolutionVariant2] = useState("");
    const [requiredInputs, setRequiredInputs] = useState({
        dataCenterType: false,
        nameplatePower: false,
        firstYear: false,
        totalYears: false,
        percentageUsed: false,
    });
    const [advanced1, setAdvanced1] = useState(false);
    const [advanced2, setAdvanced2] = useState(false);
    const [compare, setCompare] = useState(false);

    // Check if all required inputs are filled
    const areRequiredInputsValid = () => {
        const isValid = dataCenterType && nameplatePower && firstYear && totalYears && percentageUsed;
        console.log('Required inputs valid:', isValid, {
            dataCenterType,
            nameplatePower,
            firstYear,
            totalYears,
            percentageUsed
        });
        return isValid;
    };

    // Check if solution variants are selected
    const areSolutionVariantsSelected = () => {
        const isValid = solutionVariant1 && solutionVariant2;
        console.log('Solution variants selected:', isValid, {
            solutionVariant1,
            solutionVariant2
        });
        return isValid;
    };

    // Check if all conditions are met for calculation
    const canCalculate = () => {
        const canCalc = areRequiredInputsValid() && areSolutionVariantsSelected();
        console.log('Can calculate:', canCalc);
        return canCalc;
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen overflow-y-auto pb-20">
            <h1 className="text-2xl font-bold mb-4">New Value Calculator</h1>

            {/* Dropdown Section */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-bold">Select Solution</h3>
                <hr className="border-t-2 border-gray-300 my-2"></hr>
                <section className="flex flex-row gap-4 bg-white p-4 rounded-md">
                    <select 
                        value={industry} 
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Select Industry">Select an Industry</option>
                        <option value="Data Centers">Data Centers</option>
                        <option value="Air Plane Fittings">Air Plane Fittings</option>
                        <option value="Something else">Something else</option>
                    </select>
                    <select 
                        value={technology} 
                        onChange={(e) => setTechnology(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Select Technology">Select a Technology</option>
                        <option value="Data Center Cooling">Data Center Cooling</option>
                        <option value="Air Plane Battery Fittings">Air Plane Battery Fittings</option>
                        <option value="Something else">Something else</option>
                    </select>
                    <select 
                        value={solution} 
                        onChange={(e) => setSolution(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Select Solution">Select a Solution</option>
                        <option value="Air Cooling">Air Cooling</option>
                        <option value="Liquid Cooling">Liquid Cooling</option>
                        <option value="Something else">Something else</option>
                    </select>
                </section>
            </div>

            {/* Solution Wide Inputs */}
            {solution !== "Select Solution" && (
                <>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-bold">Solution Wide Inputs</h3>
                        <hr className="border-t-2 border-gray-300 my-2"></hr>
                        <section className="grid grid-cols-2 bg-white p-4 rounded-md gap-4">
                            <div>
                                <label htmlFor="data-center-type">Data Center Type<span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    id="data-center-type" 
                                    className="w-full p-2 border rounded" 
                                    value={dataCenterType}
                                    onChange={(e) => setDataCenterType(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="nameplate-power">Nameplate Power<span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    id="nameplate-power" 
                                    className="w-full p-2 border rounded" 
                                    value={nameplatePower}
                                    onChange={(e) => setNameplatePower(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="first-year">First Year of Operation<span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    id="first-year" 
                                    className="w-full p-2 border rounded" 
                                    value={firstYear}
                                    onChange={(e) => setFirstYear(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="total-years">Total Years of Operation<span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    id="total-years" 
                                    className="w-full p-2 border rounded" 
                                    value={totalYears}
                                    onChange={(e) => setTotalYears(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="percentage">Percentage User<span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    id="percentage" 
                                    className="w-full p-2 border rounded" 
                                    value={percentageUsed}
                                    onChange={(e) => setPercentageUsed(e.target.value)}
                                    required
                                />
                            </div>
                        </section>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-bold">Select Solution Variants to Compare</h3>
                        <hr className="border-t-2 border-gray-300 my-2"></hr>
                        <section className="grid grid-cols-2 bg-white p-4 rounded-md gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="block text-sm font-bold mb-2">Solution Variant 1</label>
                                <select value={solutionVariant1} onChange={(e) => setSolutionVariant1(e.target.value)} className="w-full p-2 border rounded">
                                    <option value="">Select Solution Variant 1</option>
                                    <option value="Solution Variant 1">Solution Variant 1</option>
                                    <option value="Solution Variant 2">Solution Variant 2</option>
                                    <option value="Solution Variant 3">Solution Variant 3</option>
                                </select>
                                <div className="flex gap-2 mt-2">
                                    <input type="checkbox" id="compare-variants-1" className="w-4 h-4" checked={advanced1} onChange={() => setAdvanced1(!advanced1)} />
                                    <label htmlFor="compare-variants-1" className="text-sm">Advanced</label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="block text-sm font-bold mb-2">Solution Variant 2</label>
                                <select value={solutionVariant2} onChange={(e) => setSolutionVariant2(e.target.value)} className="w-full p-2 border rounded">
                                    <option value="">Select Solution Variant 2</option>
                                    <option value="Solution Variant 1">Solution Variant 1</option>
                                    <option value="Solution Variant 2">Solution Variant 2</option>
                                    <option value="Solution Variant 3">Solution Variant 3</option>
                                </select>
                                <div className="flex gap-2 mt-2">
                                    <input type="checkbox" id="compare-variants-2" className="w-4 h-4" checked={advanced2} onChange={() => setAdvanced2(!advanced2)} />
                                    <label htmlFor="compare-variants-2" className="text-sm">Advanced</label>
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}

            {/* Advanced Inputs */} 
            <div className="flex flex-row gap-4">
                {advanced1 && (
                    <div className="bg-gray-100 p-4 rounded-lg w-[50%]">
                        <h3 className="text-lg font-bold">Advanced Inputs</h3>
                        <hr className="border-t-2 border-gray-300 my-2"></hr>
                        <section className="grid grid-cols-2 bg-white p-4 rounded-md gap-4">
                            <div>
                                <label htmlFor="advanced-input-1">Advanced Input 1</label>
                                <input type="text" id="advanced-input-1" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label htmlFor="advanced-input-2">Advanced Input 2</label>
                                <input type="text" id="advanced-input-2" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label htmlFor="advanced-input-3">Advanced Input 3</label>
                            </div>
                            <div>
                                <label htmlFor="advanced-input-4">Advanced Input 4</label>
                                <input type="text" id="advanced-input-4" className="w-full p-2 border rounded" />
                            </div>
                        </section>
                    </div>
                )}

                {advanced2 && (
                    <div className="bg-gray-100 p-4 rounded-lg w-[50%]">
                        <h3 className="text-lg font-bold">Advanced Inputs 2</h3>
                        <hr className="border-t-2 border-gray-300 my-2"></hr>
                        <section className="grid grid-cols-2 bg-white p-4 rounded-md gap-4">
                            <div>
                                <label htmlFor="advanced-input-1">Advanced Input 1</label>
                                <input type="text" id="advanced-input-1" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label htmlFor="advanced-input-2">Advanced Input 2</label>
                                <input type="text" id="advanced-input-2" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label htmlFor="advanced-input-3">Advanced Input 3</label>
                                <input type="text" id="advanced-input-3" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label htmlFor="advanced-input-4">Advanced Input 4</label>
                                <input type="text" id="advanced-input-4" className="w-full p-2 border rounded" />
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/*Calculate Button*/}
            <div className="bottom-0 left-0 right-0 bg-white p-4">
                <button 
                    className={`w-full p-2 border rounded text-white ${
                        canCalculate() 
                            ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" 
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!canCalculate()}
                    onClick={() => setCompare(!compare)}
                >
                    Calculate
                </button>
            </div>

            {/* Compare Results */}
            {compare && (
                <>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-bold">Compare Results</h3>
                    <hr className="border-t-2 border-gray-300 my-2"></hr>

                    {/* Table Section */}
                    <section className="grid grid-cols-2 bg-white p-4 rounded-md gap-4">
                        <div className="col-span-2">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Metric</th>
                                        <th className="text-center p-2">{solutionVariant1}</th>
                                        <th className="text-center p-2">{solutionVariant2}</th>
                                        <th className="text-center p-2">Comparison</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-2 font-medium">Capex</td>
                                        <td className="text-center p-2">$100,000</td>
                                        <td className="text-center p-2">$120,000</td>
                                        <td className="text-center p-2 text-red-500">+20%</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-2 font-medium">Opex</td>
                                        <td className="text-center p-2">$50,000</td>
                                        <td className="text-center p-2">$40,000</td>
                                        <td className="text-center p-2 text-green-500">-20%</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-2 font-medium">TCO</td>
                                        <td className="text-center p-2">$150,000</td>
                                        <td className="text-center p-2">$160,000</td>
                                        <td className="text-center p-2 text-red-500">+6.7%</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-2 font-medium">Payback Period</td>
                                        <td className="text-center p-2">4 years</td>
                                        <td className="text-center p-2">3.3 years</td>
                                        <td className="text-center p-2 text-green-500">-17.5%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Chart Section */}
                    <section className="bg-white p-4 rounded-md mt-4">
                        <h4 className="text-lg font-bold mb-4">Cost Comparison Chart</h4>
                        <div className="flex items-end justify-between h-64 p-4 bg-gray-50 rounded">
                            {/* Capex Bars */}
                            <div className="flex flex-col items-center">
                                <div className="w-8 bg-blue-500 rounded-t" style={{height: '60%'}}></div>
                                <div className="w-8 bg-red-500 rounded-t mt-2" style={{height: '72%'}}></div>
                                <p className="text-xs mt-2 text-center">Capex</p>
                            </div>
                            
                            {/* Opex Bars */}
                            <div className="flex flex-col items-center">
                                <div className="w-8 bg-blue-500 rounded-t" style={{height: '30%'}}></div>
                                <div className="w-8 bg-red-500 rounded-t mt-2" style={{height: '24%'}}></div>
                                <p className="text-xs mt-2 text-center">Opex</p>
                            </div>
                            
                            {/* TCO Bars */}
                            <div className="flex flex-col items-center">
                                <div className="w-8 bg-blue-500 rounded-t" style={{height: '90%'}}></div>
                                <div className="w-8 bg-red-500 rounded-t mt-2" style={{height: '96%'}}></div>
                                <p className="text-xs mt-2 text-center">TCO</p>
                            </div>
                            
                            {/* Payback Bars */}
                            <div className="flex flex-col items-center">
                                <div className="w-8 bg-yellow-500 rounded-t" style={{height: '40%'}}></div>
                                <div className="w-8 bg-yellow-500 rounded-t mt-2" style={{height: '33%'}}></div>
                                <p className="text-xs mt-2 text-center">Payback</p>
                            </div>
                        </div>
                        
                        {/* Chart Legend */}
                        <div className="flex justify-center mt-4 space-x-6">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                                <span className="text-sm">{solutionVariant1}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                                <span className="text-sm">{solutionVariant2}</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Export Buttons */}
                <div className="flex justify-center mt-4 gap-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Export to Excel</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Export to PDF</button>
                </div>
                </>
            )}

        </div>
    )
}