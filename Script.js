/* =========================================================
   GST CALCULATOR — SCRIPT
   This file handles:
   1. Reading user input (amount + GST %)
   2. Validating the input
   3. Calculating GST amount and final amount
   4. Displaying the results on the page
   5. Resetting the form
   ========================================================= */

// --- Grab references to all the elements we need ---
const form = document.getElementById("gstForm");
const amountInput = document.getElementById("amount");
const gstRateSelect = document.getElementById("gstRate");
const amountError = document.getElementById("amountError");

const resultPanel = document.getElementById("resultPanel");
const originalAmountResult = document.getElementById("originalAmountResult");
const gstAmountResult = document.getElementById("gstAmountResult");
const finalAmountResult = document.getElementById("finalAmountResult");

const breakdownBase = document.getElementById("breakdownBase");
const breakdownGst = document.getElementById("breakdownGst");

const resetBtn = document.getElementById("resetBtn");

/**
 * Formats a number as an Indian Rupee string with 2 decimal places.
 * Example: formatCurrency(1180) -> "₹ 1,180.00"
 */
function formatCurrency(value) {
  return (
    "₹ " +
    value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Handles the "Calculate" button click (form submit).
 */
form.addEventListener("submit", function (event) {
  // Prevent the default browser behaviour of reloading the page on submit
  event.preventDefault();

  // Clear any previous error message before re-validating
  amountError.textContent = "";

  const rawValue = amountInput.value.trim();

  // --- VALIDATION 1: empty input field ---
  if (rawValue === "") {
    amountError.textContent = "Please enter an amount before calculating.";
    amountInput.focus();
    resultPanel.classList.remove("show"); // hide any old result
    return; // stop here, do not calculate
  }

  const amount = parseFloat(rawValue);

  // --- VALIDATION 2: not a valid positive number ---
  if (isNaN(amount) || amount <= 0) {
    amountError.textContent = "Please enter a valid amount greater than 0.";
    amountInput.focus();
    resultPanel.classList.remove("show");
    return; // stop here, do not calculate
  }

  // Get the selected GST percentage (5, 12, 18, or 28)
  const gstRate = parseFloat(gstRateSelect.value);

  // --- CORE GST CALCULATION ---
  // GST Amount = (Original Amount x GST Rate) / 100
  const gstAmount = (amount * gstRate) / 100;

  // Final Amount = Original Amount + GST Amount
  const finalAmount = amount + gstAmount;

  // --- DISPLAY THE RESULTS ---
  originalAmountResult.textContent = formatCurrency(amount);
  gstAmountResult.textContent = formatCurrency(gstAmount);
  finalAmountResult.textContent = formatCurrency(finalAmount);

  // --- UPDATE THE VISUAL BREAKDOWN BAR ---
  // Shows what proportion of the final amount is the base price vs the GST
  const basePercent = (amount / finalAmount) * 100;
  const gstPercent = (gstAmount / finalAmount) * 100;
  breakdownBase.style.width = basePercent + "%";
  breakdownGst.style.width = gstPercent + "%";

  // Reveal the result panel (CSS handles the fade/slide-in animation)
  resultPanel.classList.add("show");
});

/**
 * Handles the "Reset" button click.
 * Clears the form and hides the results.
 */
resetBtn.addEventListener("click", function () {
  form.reset(); // resets the input field and dropdown back to default values

  amountError.textContent = ""; // clear any error message
  resultPanel.classList.remove("show"); // hide the result panel again

  // Reset the breakdown bar widths back to zero
  breakdownBase.style.width = "0%";
  breakdownGst.style.width = "0%";

  amountInput.focus(); // put the cursor back in the amount field for convenience
});