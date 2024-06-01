let ticketTypesData = [];

// Set the min attribute of the date input field to the current date
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;

document
  .getElementById("date")
  .setAttribute("min", today.toISOString().split("T")[0]);
document.getElementById("expiry-year").setAttribute("min", currentYear);

const expiryYearInput = document.getElementById("expiry-year");
const expiryMonthInput = document.getElementById("expiry-month");

expiryYearInput.addEventListener("change", validateExpiryDate);
expiryMonthInput.addEventListener("change", validateExpiryDate);

function validateExpiryDate() {
  if (parseInt(expiryYearInput.value, 10) === currentYear) {
    expiryMonthInput.setAttribute("min", currentMonth);
  } else {
    expiryMonthInput.setAttribute("min", 1);
  }
}

// Redirect to sign-in page if user is not logged in
const user = JSON.parse(localStorage.getItem("user"));
const userId = user ? user._id : null;

if (!userId) {
  window.location.href = "/signin";
}

// Fetch ticket types from the server and populate the select element
const select = document.getElementById("ticket-type");

fetch("/ticket-types")
  .then((response) => response.json())
  .then((ticketTypes) => {
    ticketTypesData = ticketTypes;
    populateTicketTypes(ticketTypes);
  })
  .catch((error) => console.error("Error:", error));

function populateTicketTypes(ticketTypes) {
  ticketTypes.forEach((ticketType) => {
    const option = document.createElement("option");
    option.id = ticketType._id;
    option.value = ticketType.type;
    option.textContent = ticketType.type;
    select.appendChild(option);
  });
}

// Add event listener to form submission
const form = document.getElementById("newReservationForm");
form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();

  const reservationData = {
    userId: user._id,
    ticketType: document.getElementById("ticket-type").value,
    date: document.getElementById("date").value,
    people: document.getElementById("people").value,
    price:
      parseFloat(
        document
          .getElementById("price")
          .textContent.replace("Total Price: $", "")
      ) || 0,
    saveCard: document.getElementById("save-card").checked,
    cardName: document.getElementById("card-name").value,
    cardNumber: document.getElementById("card-number").value,
    expiryMonth: document.getElementById("expiry-month").value,
    expiryYear: document.getElementById("expiry-year").value,
    securityCode: document.getElementById("security-code").value,
  };

  createReservation(reservationData);
}

async function createReservation(reservationData) {
  try {
    const response = await fetch("/new-reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      updateUserReservations(data._id, reservationData);
      alert("Reservation added successfully");
      window.location.href = "/dashboard";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function updateUserReservations(reservationId, reservationData) {
  user.reservations.push({ ...reservationData, _id: reservationId });
  localStorage.setItem("user", JSON.stringify(user));
}

// Update ticket type description and price
const ticketTypeSelect = document.getElementById("ticket-type");
ticketTypeSelect.addEventListener("change", updateTicketTypeDetails);

function updateTicketTypeDetails() {
  const selectedOptionId = ticketTypeSelect.selectedOptions[0].id;

  if (selectedOptionId === "default") {
    document.getElementById("ticket-type-description").textContent = "";
    document.getElementById("single-ticket-price").textContent = "";
  } else {
    const selectedTicketType = ticketTypesData.find(
      (t) => t._id === selectedOptionId
    );
    document.getElementById("ticket-type-description").textContent =
      selectedTicketType.description;
    document.getElementById(
      "single-ticket-price"
    ).textContent = `(A single ticket price is $${selectedTicketType.basePrice}.)`;
  }

  updatePrice();
}

const peopleInput = document.getElementById("people");
peopleInput.addEventListener("input", updatePrice);

function updatePrice() {
  const ticketTypeId = ticketTypeSelect.selectedOptions[0].id;
  const people = peopleInput.value;

  if (ticketTypeId && people > 0) {
    const selectedTicketType = ticketTypesData.find(
      (t) => t._id === ticketTypeId
    );
    const price = selectedTicketType.basePrice * people;
    document.getElementById("price").textContent = `Total Price: $${price}`;
  } else {
    document.getElementById("price").textContent = "";
  }
}

// Handle payment step transition
const goToPaymentButton = document.getElementById("go-to-payment");
const reservationInfo = document.querySelector(".reservation-info");
const paymentInfo = document.querySelector(".payment-info");

goToPaymentButton.addEventListener("click", async function (e) {
  e.preventDefault();

  if (validateReservationInfo()) {
    await fetchSavedCreditCards(userId);
    reservationInfo.classList.add("hidden");
    paymentInfo.classList.remove("hidden");
  }
});

function validateReservationInfo() {
  const fields = reservationInfo.querySelectorAll("input, select");
  let allFieldsValid = true;

  fields.forEach((field) => {
    if (!field.checkValidity()) {
      allFieldsValid = false;
      field.reportValidity();
      return;
    }
  });

  return allFieldsValid;
}

async function fetchSavedCreditCards(userId) {
  try {
    const response = await fetch(`/saved-credit-cards/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    displaySavedCreditCards(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displaySavedCreditCards(cards) {
  const cardContainer = document.getElementById("card-container");
  if (cards.length === 0) {
    cardContainer.innerHTML = "You don't have any saved cards";
  } else {
    const cardHtml = cards
      .map(
        (card, index) => `
      <div class="card">
        <input type="radio" id="card${index}" name="card" value="${card._id}">
        <label for="card${index}">${
          card.cardName
        } - **** **** **** ${card.cardNumber.slice(-4)}</label>
      </div>
    `
      )
      .join("");
    cardContainer.innerHTML = cardHtml;
    addCardRadioButtonsEventListeners(cards);
  }
}

function addCardRadioButtonsEventListeners(cards) {
  cards.forEach((card, index) => {
    const radioButton = document.getElementById(`card${index}`);
    radioButton.setAttribute("data-checked", "no");

    radioButton.addEventListener("click", function () {
      toggleRadioButton(this, cards, index);
    });
  });
}

function toggleRadioButton(radioButton, cards, index) {
  if (radioButton.getAttribute("data-checked") === "yes") {
    radioButton.checked = false;
    radioButton.setAttribute("data-checked", "no");
  } else {
    radioButton.setAttribute("data-checked", "yes");
  }

  cards.forEach((_, otherIndex) => {
    if (otherIndex !== index) {
      document
        .getElementById(`card${otherIndex}`)
        .setAttribute("data-checked", "no");
    }
  });

  toggleFormElements(radioButton.checked);
}

function toggleFormElements(disabled) {
  const formElements = [
    document.getElementById("card-number"),
    document.getElementById("expiry-month"),
    document.getElementById("expiry-year"),
    document.getElementById("security-code"),
    document.getElementById("save-card"),
    document.getElementById("card-name"),
  ];
  formElements.forEach((element) => {
    if (element) {
      element.disabled = disabled;
      if (!disabled) element.value = "";
    }
  });
}

// Handle going back to reservation info step
const goBackButton = document.getElementById("go-back");
goBackButton.addEventListener("click", function (e) {
  e.preventDefault();
  reservationInfo.classList.remove("hidden");
  paymentInfo.classList.add("hidden");
});

// Handle save card checkbox visibility
const saveCardCheckbox = document.getElementById("save-card");
const cardNameLabel = document.querySelector('label[for="card-name"]');
const cardNameInput = document.getElementById("card-name");

saveCardCheckbox.addEventListener("change", function () {
  cardNameLabel.classList.toggle("hidden", !saveCardCheckbox.checked);
  cardNameInput.classList.toggle("hidden", !saveCardCheckbox.checked);
});
