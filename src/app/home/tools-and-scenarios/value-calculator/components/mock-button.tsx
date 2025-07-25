import { Button } from "@/components/ui/button";

const mockInputs = {
  "x": 10.0,
  "y": 15.0
};

const mockParameters = [
  {
    name: "x",
    type: "USER",
  },
  {
    name: "y",
    type: "USER",
  },
  {
    name: "a",
    type: "COMPANY",
    value: 2,
  },
  {
    name: "opex",
    type: "CALCULATION",
    formula: "a*x",
  },
  {
    name: "capex",
    type: "CALCULATION",
    formula: "a*y",
  },
  {
    name: "TCO",
    type: "CALCULATION",
    formula: "capex+opex",
  },
];

const mockTarget = "TCO";

export default function MockButton() {
  const runCalculation = async () => {
    try {
      const requestBody = {
        inputs: mockInputs,
        parameters: mockParameters,
        target: mockTarget,
      };
      console.log(requestBody);
      const response = await fetch("http://localhost:8000/api/v1/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("result: ", data);
    } catch (err) {
      console.error(err);
    }
  };
  return <Button onClick={runCalculation}>Mock</Button>;
}