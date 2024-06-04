// Check if user is already logged in and render username or redirect to sign-in page
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  $("#username").text(user.username);
} else {
  window.location.href = "/signin"; // Redirect to sign-in page
}

// Render reservations or display a message if there are none
function renderReservations(user) {
  const reservationsList = $("#reservations");

  if (user && user.reservations.length > 0) {
    user.reservations.forEach((reservation) => {
      const listItem = createReservationListItem(reservation);
      reservationsList.append(listItem);
    });
  } else {
    const noReservationsMessage = document.createElement("p");
    noReservationsMessage.textContent = "You don't have any reservations.";
    reservationsList.append(noReservationsMessage);
  }
}

function createReservationListItem(reservation) {
  const listItem = document.createElement("li");

  const ticketTypeImage = document.createElement("img");
  ticketTypeImage.id = "ticket-type-image"

  if (reservation.ticketType === "One Park Per Day") {
    ticketTypeImage.src = "../images/one-park-per-day.png";
    ticketTypeImage.alt = "One Park Per Day";
  } else {
    ticketTypeImage.src = "../images/park-hopper.png";
    ticketTypeImage.alt = "Park Hopper";
  }

  const infoDiv = document.createElement("div");
  infoDiv.id = "info-div";

  const ticketTypeElement = document.createElement("p");
  ticketTypeElement.textContent = `Ticket Type: ${reservation.ticketType}`;

  const dateElement = document.createElement("p");
  dateElement.textContent = `Date: ${reservation.date}`;

  const peopleElement = document.createElement("p");
  peopleElement.textContent = `People: ${reservation.people}`;

  const priceElement = document.createElement("p");
  priceElement.textContent = `Price: $${reservation.price}`;

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel Reservation";
  cancelButton.id = reservation._id;
  cancelButton.onclick = cancelReservation;

  infoDiv.appendChild(ticketTypeElement);
  infoDiv.appendChild(dateElement);
  infoDiv.appendChild(peopleElement);
  infoDiv.appendChild(priceElement);
  infoDiv.appendChild(cancelButton);

  listItem.appendChild(ticketTypeImage);
  listItem.appendChild(infoDiv);

  return listItem;
}

async function cancelReservation(event) {
  const reservationId = event.target.id;

  // Get the user object from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Confirm with the user before deleting the reservation
  const confirmDelete = confirm(
    "Are you sure you want to cancel this reservation?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`/delete-reservation/${reservationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user._id }),
    });

    if (!response.ok) {
      throw new Error("Failed to cancel reservation");
    }

    // Update the user object in localStorage
    const reservationIndex = user.reservations.findIndex(
      (reservation) => reservation._id === reservationId
    );
    user.reservations.splice(reservationIndex, 1);
    localStorage.setItem("user", JSON.stringify(user));

    alert("Reservation cancelled successfully");
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

function signOut() {
  const confirmation = confirm("Do you really want to sign out?");

  if (confirmation) {
    localStorage.removeItem("user");
    window.location.href = "/"; // Redirect to home page
  }
}

// Initial rendering of reservations
renderReservations(user);


$("#sidebar-username").text(user.username);
