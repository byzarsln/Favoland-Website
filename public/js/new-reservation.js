
let ticketTypesData = [];

// Set the min attribute of the date input field to the current date
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;

$("#date").attr("min", today.toISOString().split("T")[0])
$("#expiry-year").attr("min", currentYear);

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
const select = $("#ticket-type");

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
    select.append(option);
  });
}

// Add event listener to form submission
const form = document.getElementById("newReservationForm");
form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();

  const reservationData = {
    userId: user._id,
    ticketType: $("#ticket-type").val(),
    date: $("#date").val(),
    people: $("#people").val(),
    price:
      parseFloat(
          $("#price").text().replace("Total Price: $", "")
      ) || 0,
      saveCard: $("#save-card").prop("checked"),
      cardName: $("#card-name").val(),
      cardNumber: $("#card-number").val(),
      expiryMonth: $("#expiry-month").val(),
      expiryYear: $("#expiry-year").val(),
      securityCode: $("#security-code").val(),
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
    $("#ticket-type-description").text("");
    $("#single-ticket-price").text("");
    $("#price").text("");
  } else {
    const selectedTicketType = ticketTypesData.find(
      (t) => t._id === selectedOptionId
    );
    $("#ticket-type-description").text(selectedTicketType.description);
    $("#single-ticket-price").text(`(A single ticket price is $${selectedTicketType.basePrice}.)`);
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
    $("#price").text(`Total Price: $${price}`);
  } else {
    $("#price").text("");
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
    $("#card-number"),
    $("#expiry-month"),
    $("#expiry-year"),
    $("#security-code"),
    $("#save-card"),
    $("#card-name"),
  ];
  formElements.forEach((element) => {
    if (element.length) {
      element.prop('disabled', disabled);
      if (disabled) element.val("");
  
      // If the element is the "save-card" checkbox and it is checked, uncheck it
      if (element.attr('id') === 'save-card' && element.prop('checked')) {
        element.prop('checked', false);
      }
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
