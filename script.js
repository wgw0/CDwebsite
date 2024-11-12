const OPS = {
    "+": (n1, n2) => n1 + n2,
    "-": (n1, n2) => n1 > n2 ? n1 - n2 : false,
    "*": (n1, n2) => n1 * n2,
    "/": (n1, n2) => n2 !== 0 && n1 % n2 === 0 ? n1 / n2 : false,
};

function recurseSolveNumbers(numbers, target) {
    let exactSolution = null;  // Stores an exact solution if found
    let closestSolution = null;  // Stores the closest solution if no exact match is found
    let closestDifference = Infinity;  // Tracks the smallest difference from the target

    function solve(nums, opsStack = []) {
        if (nums.length === 1) {
            const result = nums[0];
            const difference = Math.abs(result - target);

            // If an exact match is found, store it and stop further processing
            if (result === target) {
                exactSolution = opsStack.slice();
                return;
            }

            // If no exact match, store the closest solution
            if (difference < closestDifference) {
                closestDifference = difference;
                closestSolution = { result, ops: opsStack.slice() };
            }
            return;
        }

        // Try all pairs of numbers in the array
        for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
                const newNums = nums.slice();
                const [n1, n2] = [newNums.splice(i, 1)[0], newNums.splice(j - 1, 1)[0]];

                for (const [op, fn] of Object.entries(OPS)) {
                    const result = fn(n1, n2);
                    if (result === false) continue;

                    newNums.push(result);
                    opsStack.push(`${n1} ${op} ${n2} = ${result}`);
                    solve(newNums, opsStack);
                    opsStack.pop();
                    newNums.pop();
                }
            }
        }
    }

    // Run the recursive function with a copy of numbers to avoid mutation
    solve([...numbers]);

    // If an exact solution was found, return it
    if (exactSolution) {
        return exactSolution.join("\n") + `\n\nTarget ${target} achieved`;
    }

    // If no exact solution, return the closest solution found
    if (closestSolution) {
        return closestSolution.ops.join("\n") + `\n\nClosest result: ${closestSolution.result} (Target ${target} not achieved)`;
    }

    // If no solution was found at all
    return "No solution found";
}

function solveCountdown() {
    // Get values from the input fields
    const numbersInput = document.getElementById("numbers").value;
    const targetInput = document.getElementById("target").value;

    // Parse input
    const numbers = numbersInput.split(",").map(num => parseInt(num.trim(), 10));
    const target = parseInt(targetInput, 10);

    // Validate inputs
    if (numbers.some(isNaN) || isNaN(target)) {
        document.getElementById("result").innerText = "Please enter valid numbers and target.";
        return;
    }

    // Solve the countdown
    const result = recurseSolveNumbers(numbers, target);
    document.getElementById("result").innerText = result;
}
