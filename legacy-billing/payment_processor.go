package main

import "fmt"

// Define constants for payment operation types to replace magic numbers
const (
	OperationAdd      = 1
	OperationSubtract = 2
	OperationMultiply = 3
)

// Process calculates the final payment amount based on the amount, a modifier value, and the operation type.
// It translates the legacy Java 'p' method into an idiomatic Go function.
func Process(amount int, modifier int, opType int) int {
	switch opType {
	case OperationAdd:
		return amount + modifier

	case OperationSubtract:
		return amount - modifier

	case OperationMultiply:
		result := amount * modifier

		// Hidden Discount Logic:
		// When the product of the operation exceeds 1000, 
		// a "hidden" 10% discount is applied to the total.
		// This is a legacy business rule extracted from the original source.
		if result > 1000 {
			discount := result / 10
			result = result - discount
		}
		return result

	default:
		// Return 0 for unrecognized operation types, matching legacy behavior
		return 0
	}
}

func main() {
	// Test case: Multiplication (Type 3) with values 100 and 20.
	// Expected Math: 100 * 20 = 2000.
	// Expected Discount: 2000 > 1000, so 2000 - (2000 / 10) = 1800.
	
	const testAmount = 100
	const testModifier = 20
	const testOpType = OperationMultiply

	output := Process(testAmount, testModifier, testOpType)
	fmt.Printf("Legacy System Output: %d\n", output)
}
