// OPTIONAL: Paste your 3-question Google Form URL below to display a direct logging link on submit
const GOOGLE_FORM_URL = "";

let selectedRating = 5;
let lastCalculatedLitres = 0;

document.addEventListener("DOMContentLoaded", () => {
  const showerSlider = document.getElementById("shower");
  const bottlesSlider = document.getElementById("bottles");
  const btnCalculate = document.getElementById("btn-calculate");
  const btnSubmit = document.getElementById("btn-submit");
  const btnReset = document.getElementById("btn-reset");
  const likertButtons = document.querySelectorAll(".likert-btn");

  showerSlider.addEventListener("input", updateLabels);
  bottlesSlider.addEventListener("input", updateLabels);
  btnCalculate.addEventListener("click", calculateImpact);
  btnSubmit.addEventListener("click", submitPledge);
  btnReset.addEventListener("click", resetApp);

  likertButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedRating = parseInt(btn.getAttribute("data-val"), 10);
      likertButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

function updateLabels() {
  const s = document.getElementById("shower").value;
  const b = document.getElementById("bottles").value;
  document.getElementById("shower-val").textContent = `${s} mins`;
  document.getElementById("bottles-val").textContent = `${b} / week`;
}

function calculateImpact() {
  const showerMins = parseFloat(document.getElementById("shower").value);
  const tapDailyLitres = parseFloat(document.querySelector('input[name="tap"]:checked').value);
  const weeklyBottles = parseFloat(document.getElementById("bottles").value);
  const messDailyLitres = parseFloat(document.querySelector('input[name="mess"]:checked').value);

  // Standard Indian low-flow shower (~9 L/min); avoidable excess above 5-min benchmark
  const excessShowerMonthly = Math.max(0, showerMins - 5) * 9 * 30;
  const tapMonthly = tapDailyLitres * 30;
  // ~3 L industrial water footprint per 1L PET bottle produced + wasted
  const bottlesMonthly = Math.round(weeklyBottles * 3 * 4.3);
  const messMonthly = Math.round(messDailyLitres * 30);

  const total = Math.round(excessShowerMonthly + tapMonthly + bottlesMonthly + messMonthly);
  lastCalculatedLitres = total;

  document.getElementById("total-litres").textContent = `${total.toLocaleString("en-IN")} L`;
  document.getElementById("buckets-eq").textContent =
    `Equivalent to ~${Math.max(1, Math.round(total / 15))} standard 15-litre hostel buckets per month`;

  document.getElementById("b-shower").textContent = `${Math.round(excessShowerMonthly)} L/mo`;
  document.getElementById("b-tap").textContent = `${Math.round(tapMonthly)} L/mo`;
  document.getElementById("b-bottles").textContent = `${bottlesMonthly} L/mo`;
  document.getElementById("b-mess").textContent = `${messMonthly} L/mo`;

  document.getElementById("screen-input").classList.add("hidden");
  document.getElementById("screen-result").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function submitPledge() {
  const pledge = document.querySelector('input[name="pledge"]:checked').value;
  const weeklySaveEst = Math.max(35, Math.round(lastCalculatedLitres * 0.25));
  const box = document.getElementById("confirmation-box");

  let formLinkHtml = "";
  if (GOOGLE_FORM_URL && GOOGLE_FORM_URL.startsWith("http")) {
    formLinkHtml = `<br><br><a href="${GOOGLE_FORM_URL}" target="_blank" rel="noopener" style="color:#0369a1;font-weight:700;">Tap here to record this in our 10-second Google Form log →</a>`;
  }

  box.innerHTML = `
    <strong>Pledge Recorded!</strong><br>
    • <b>Monthly Footprint:</b> ${lastCalculatedLitres.toLocaleString("en-IN")} L<br>
    • <b>7-Day Pledge:</b> ${pledge} (~${weeklySaveEst} L potential weekly saving)<br>
    • <b>Awareness Rating:</b> ${selectedRating}/5
    ${formLinkHtml}
  `;
  box.classList.remove("hidden");
}

function resetApp() {
  document.getElementById("confirmation-box").classList.add("hidden");
  document.getElementById("screen-result").classList.add("hidden");
  document.getElementById("screen-input").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}