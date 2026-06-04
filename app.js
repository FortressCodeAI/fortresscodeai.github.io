// FortressCodeAI Marketplace – front-end logic

const PAYPAL_ME_BASE = "https://www.paypal.me/FortressCodeAI";

let selectedPack = null;

function initPackSelection() {
  const cards = document.querySelectorAll(".pack-card");
  const nameEl = document.getElementById("selected-pack-name");
  const priceEl = document.getElementById("selected-pack-price");
  const payBtn = document.getElementById("pay-button");

  function updatePayButton() {
    if (!selectedPack) {
      payBtn.classList.add("disabled");
      payBtn.href = "#";
      return;
    }

    payBtn.classList.remove("disabled");

    const amount = selectedPack.price;
    // PayPal.Me supports /amount at the end
    const url = amount > 0 ? `${PAYPAL_ME_BASE}/${amount}` : PAYPAL_ME_BASE;
    payBtn.href = url;
  }

  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      const packId = card.getAttribute("data-pack-id");
      const price = parseFloat(card.getAttribute("data-price"));
      const title = card.querySelector("h3").textContent;

      selectedPack = { id: packId, title, price };

      nameEl.textContent = title;
      priceEl.textContent = price > 0 ? `· CA$${price.toFixed(2)}` : "· Free";

      updatePayButton();
    });
  });

  // Initial state
  payBtn.classList.add("disabled");
  payBtn.addEventListener("click", (e) => {
    if (!selectedPack) {
      e.preventDefault();
      alert("Please select a governance artifact before proceeding to payment.");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPackSelection();
});
