const cars = [
  {
    id: 1,
    name: "Toyota Corolla Hybrid",
    category: "Sedan",
    pricePerDay: 65,
    seats: 5,
    transmission: "Automatic",
    image: "https://unsplash.com"
  },
  {
    id: 2,
    name: "Mazda CX-5 Touring",
    category: "SUV",
    pricePerDay: 89,
    seats: 5,
    transmission: "Automatic",
    image: "https://unsplash.com"
  },
  {
    id: 3,
    name: "Tesla Model 3",
    category: "Electric",
    pricePerDay: 115,
    seats: 5,
    transmission: "Single-Speed",
    image: "https://unsplash.com"
  },
  {
    id: 4,
    name: "Hyundai Tucson AWD",
    category: "SUV",
    pricePerDay: 95,
    seats: 5,
    transmission: "Automatic",
    image: "https://unsplash.com"
  }
];

const carGrid = document.getElementById("car-grid");
const filterBtns = document.querySelectorAll(".filter-btn");
const modal = document.getElementById("booking-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalCarTitle = document.getElementById("modal-car-title");
const modalCarRate = document.getElementById("modal-car-rate");
const pickupInput = document.getElementById("pickup-date");
const returnInput = document.getElementById("return-date");
const totalPriceEl = document.getElementById("total-price");
const bookingForm = document.getElementById("booking-form");
const submitBtn = document.getElementById("submit-btn");

let selectedCar = null;

function renderCars(category = "all") {
  const filtered = category === "all"
    ? cars
    : cars.filter(car => car.category === category);

  carGrid.innerHTML = filtered.map(car => `
    <article class="car-card">
      <img src="${car.image}" alt="${car.name}" />
      <div class="car-body">
        <span class="badge">${car.category}</span>
        <h3>${car.name}</h3>
        <p class="car-specs">${car.seats} Seats &bull; ${car.transmission}</p>
        <div class="car-footer">
          <div class="price">$${car.pricePerDay}<span>/day</span></div>
          <button class="btn-primary" onclick="openBooking(${car.id})">Book Now</button>
        </div>
      </div>
    </article>
  `).join("");
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderCars(btn.dataset.category);
  });
});

function openBooking(carId) {
  selectedCar = cars.find(c => c.id === carId);
  modalCarTitle.textContent = `Book ${selectedCar.name}`;
  modalCarRate.textContent = `$${selectedCar.pricePerDay} AUD / day`;
  bookingForm.reset();
  totalPriceEl.textContent = "$0";

  const today = new Date().toISOString().split("T");
  pickupInput.min = today;
  returnInput.min = today;

  modal.classList.remove("hidden");
}

closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

function calculateTotal() {
  if (!selectedCar || !pickupInput.value || !returnInput.value) {
    totalPriceEl.textContent = "$0";
    return;
  }
  const start = new Date(pickupInput.value);
  const end = new Date(returnInput.value);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    totalPriceEl.textContent = `$${diffDays * selectedCar.pricePerDay} AUD (${diffDays} days)`;
  } else {
    totalPriceEl.textContent = "Select a valid return date";
  }
}

pickupInput.addEventListener("change", () => {
  returnInput.min = pickupInput.value;
  calculateTotal();
});
returnInput.addEventListener("change", calculateTotal);

bookingForm.addEventListener("submit", (e) => {
  const start = new Date(pickupInput.value);
  const end = new Date(returnInput.value);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    e.preventDefault();
    alert("Return date must be at least 1 day after pickup date.");
    return;
  }

  const totalCost = days * selectedCar.pricePerDay;
  document.getElementById("hidden-car-details").value =
    `${selectedCar.name} | ${days} day(s) | $${totalCost} AUD`;

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending Reservation...";
});

renderCars();
