const GOOGLE_FORM_BASE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdrZV6srmmJA_Pnm3XN-Zi0OzE67jX4JtVdE3pBVv0l1aLRFQ/viewform";
const ENTRY_NAME = "entry.1768668933";
const ENTRY_ENROL = "entry.1396371442";
const ENTRY_LITRES = "entry.481178912";
const ENTRY_PLEDGE = "entry.850374082";
const ENTRY_RATING = "entry.298455197";

let selectedRating = 5;
let lastCalculatedLitres = 0;

document.addEventListener("DOMContentLoaded", () => {
  const showerSlider = document.getElementById("shower");
  const bottlesSlider = document.getElementById("bottles");
  const btnCalculate = document.getElementById("btn-calculate");
  const btnSubmit = document.getElementById("btn-submit");
  const btnReset = document.getElementById("btn-reset");
  const likertButtons = document.querySelectorAll(".likert-btn");

  if (showerSlider) showerSlider.addEventListener("input", updateLabels);
  if (bottlesSlider) bottlesSlider.addEventListener("input", updateLabels);
  if (btnCalculate) btnCalculate.addEventListener("click", calculateImpact);
  if (btnSubmit) btnSubmit.addEventListener("click", submitPledge);
  if (btnReset) btnReset.addEventListener("click", resetApp);

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
  const nameInput = document.getElementById("user-name").value.trim();
  const enrolInput = document.getElementById("user-enrol").value.trim();

  if (!nameInput || !enrolInput) {
    alert("Please enter your Full Name and Enrollment ID before calculating!");
    return;
  }

  const showerMins = parseFloat(document.getElementById("shower").value);
  const tapDailyLitres = parseFloat(document.querySelector('input[name="tap"]:checked').value);
  const weeklyBottles = parseFloat(document.getElementById("bottles").value);
  const messDailyLitres = parseFloat(document.querySelector('input[name="mess"]:checked').value);

  const excessShowerMonthly = Math.max(0, showerMins - 5) * 9 * 30;
  const tapMonthly = tapDailyLitres * 30;
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
  const nameInput = document.getElementById("user-name").value.trim();
  const enrolInput = document.getElementById("user-enrol").value.trim();
  const pledge = document.querySelector('input[name="pledge"]:checked').value;
  const weeklySaveEst = Math.max(35, Math.round(lastCalculatedLitres * 0.25));
  const box = document.getElementById("confirmation-box");

  const params = new URLSearchParams({
    usp: "pp_url",
    [ENTRY_NAME]: nameInput,
    [ENTRY_ENROL]: enrolInput,
    [ENTRY_LITRES]: `${lastCalculatedLitres} L`,
    [ENTRY_PLEDGE]: pledge,
    [ENTRY_RATING]: `${selectedRating}/5`
  });
  const finalFormUrl = `${GOOGLE_FORM_BASE_URL}?${params.toString()}`;

  box.innerHTML = `
    <strong>Pledge Ready, ${nameInput}!</strong><br>
    • <b>Enrollment ID:</b> ${enrolInput}<br>
    • <b>Monthly Footprint:</b> ${lastCalculatedLitres.toLocaleString("en-IN")} L<br>
    • <b>7-Day Pledge:</b> ${pledge} (~${weeklySaveEst} L weekly saving)<br>
    • <b>Awareness Rating:</b> ${selectedRating}/5<br><br>
    <a href="${finalFormUrl}" target="_blank" rel="noopener" 
       style="display:inline-block;background:#0284c7;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:700;">
       Tap Here to Submit Your Pre-Filled Log (1-Click) →
    </a>
  `;
  box.classList.remove("hidden");
}

function resetApp() {
  document.getElementById("confirmation-box").classList.add("hidden");
  document.getElementById("screen-result").classList.add("hidden");
  document.getElementById("screen-input").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}