import React from "react";
import { Badge } from "@/components/ui/badge";

/**
 * Service for formula manipulation and color coding
 */

/**
 * Tokenize formula string for processing
 */
export function tokenizeFormula(formula: string): string[] {
	const tokens: string[] = [];
	let currentToken = "";

	const parts = formula.split(/([+\-*/()])/);

	for (const part of parts) {
		if (/^[+\-*/()]$/.test(part)) {
			if (currentToken.trim()) {
				tokens.push(currentToken.trim());
				currentToken = "";
			}
			tokens.push(part);
		} else {
			currentToken += part;
		}
	}

	if (currentToken.trim()) {
		tokens.push(currentToken.trim());
	}

	return tokens;
}

/**
 * Get color-coded formula display
 */
export function getColorCodedFormula(formula: string): (React.ReactElement | null)[] {
	const tokens = tokenizeFormula(formula);

	return tokens
		.map((token, index) => {
			if (/^[+\-*/()]+$/.test(token)) {
				return (
					<Badge
						key={index}
						variant="outline"
						className="text-blue-600 border-blue-200 bg-blue-50 text-xs font-mono"
					>
						{token}
					</Badge>
				);
			} else if (/^\d+$/.test(token)) {
				return (
					<Badge
						key={index}
						variant="outline"
						className="text-purple-600 border-purple-200 bg-purple-50 text-xs font-mono"
					>
						{token}
					</Badge>
				);
			} else if (token.trim()) {
				return (
					<Badge
						key={index}
						variant="outline"
						className="text-gray-600 border-gray-200 bg-gray-50 text-xs font-mono"
					>
						{token}
					</Badge>
				);
			} else {
				return null;
			}
		})
		.filter(Boolean);
} 