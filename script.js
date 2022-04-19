'use strict';

class Device {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(
    coords,
    type,
    location,
    nozzles,
    contact,
    product1,
    product2,
    concentration1,
    concentration2,
    working1,
    working2,
    refilldate,
    price,
    refill1,
    refill2,
    consum1
  ) {
    this.coords = coords; // [lat, lng]
    this.type = type;
    this.location = location;
    this.nozzles = nozzles;
    this.product1 = product1;
    this.product2 = product2;
    this.concentration1 = concentration1;
    this.concentration2 = concentration2;
    this.contact = contact;
    this.working1 = working1;
    this.working2 = working2;
    this.refilldate = refilldate;
    this.price = price;
    this.refill1 = refill1;
    this.refill2 = refill2;
  }

  _setDescription() {
    this.description = `${this.type}`;
  }
}

///////////////////////////////////////
// APPLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerDevice = document.querySelector('.devices');
const inputType = document.querySelector('.form__input--type');
const inputLocation = document.querySelector('.form__input--location');
const inputNozzles = document.querySelector('.form__input--nozzles');
const inputContact = document.querySelector('.form__input--contact');
const inputProduct1 = document.querySelector('.form__input--product1');
const inputProduct2 = document.querySelector('.form__input--product2');
const inputConcentration1 = document.querySelector(
  '.form__input--concentration1'
);
const inputConcentration2 = document.querySelector(
  '.form__input--concentration2'
);
const inputWorking1 = document.querySelector('.form__input--working1');
const inputWorking2 = document.querySelector('.form__input--working2');
const inputRefillDate = document.querySelector('.form__input--refilldate');
const inputPrice = document.querySelector('.form__input--price');
const inputRefill1 = document.querySelector('.form__input--refill1');
const inputRefill2 = document.querySelector('.form__input--refill2');

class App {
  #map;
  #mapZoomLevel = 8;
  #mapEvent;
  #devices = [];

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener('submit', this._newDevice.bind(this));
    containerDevice.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#devices.forEach(device => {
      this._renderDeviceMarker(device);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputLocation.focus();
  }

  _hideForm() {
    // Empty inputs
    inputLocation.value =
      inputNozzles.value =
      inputContact.value =
      inputConcentration1.value =
      inputConcentration2.value =
      inputWorking1.value =
      inputWorking2.value =
      inputRefillDate.value =
      inputPrice.value =
      inputRefill1.value =
      inputRefill2.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }
  _newDevice(e) {
    e.preventDefault();
    const type = inputType.value;
    const location = inputLocation.value;
    const contact = inputContact.value;
    const nozzles = +inputNozzles.value;
    const product1 = inputProduct1.value;
    const product2 = inputProduct2.value;
    const concentration1 = +inputConcentration1.value;
    const concentration2 = +inputConcentration2.value;
    const working1 = +inputWorking1.value;
    const working2 = +inputWorking2.value;
    const { lat, lng } = this.#mapEvent.latlng;
    const refilldate = inputRefillDate.value;
    const price = +inputPrice.value;
    const refill1 = +inputRefill1.value;
    const refill2 = +inputRefill2.value;
    let device;
    // console.log(location);

    device = new Device(
      [lat, lng],
      type,
      location,
      nozzles,
      contact,
      product1,
      product2,
      concentration1,
      concentration2,
      working1,
      working2,
      refilldate,
      price,
      refill1,
      refill2
    );

    // Get data from form

    // If workout running, create running object

    // If workout cycling, create cycling object

    // Add new object to workout array
    this.#devices.push(device);

    // Render workout on map as marker
    this._renderDeviceMarker(device);

    // Render workout on list
    this._renderDevice(device);

    // Hide form + clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderDeviceMarker(device) {
    L.marker(device.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          // className: `${device.type}-popup`,
        })
      )
      .setPopupContent(`${device.type}`)
      .openPopup();
  }

  _renderDevice(device) {
    let html = ` <li class="device1 device--${device.type}" data-id="${
      device.id
    }">
    <h2 class="desc">${device.type}</h2>
    <h2 class="desc">${device.location}</h2>
    <h2 class="desc">💨${device.nozzles}</h2>
    <h2 class="desc">📞${device.contact}</h2>
    <h2 class="desc">1🧪${device.product1}</h2>
    <h2 class="desc">🕐${device.working1}min</h2>
    <h2 class="desc">2🧪${device.product2}</h2>
    <h2 class="desc">🕐${device.working2}min</h2>
    <h4 class="desc">Dopunjeno ${device.refill1}L</h4>
    <h5 class="desc">${device.refilldate}</h5>
    <h4 class="desc">Dopunjeno ${device.refill2}L</h4>
    <h5 class="desc">${device.refilldate}</h5>
    <h6 class="desc">1🧪${Number(
      (((device.nozzles * 40 * device.concentration1) / 100) *
        device.working1 *
        30) /
        1000
    ).toFixed(2)} L/mesecno</h6>
    <h6 class="desc">2🧪${Number(
      (((device.nozzles * 40 * device.concentration2) / 100) *
        device.working2 *
        30) /
        1000
    ).toFixed(2)} L/mesecno</h6>
    <h6 class="desc">Cena dopune ${device.price}€</h6>`;
    form.insertAdjacentHTML('afterend', html);
  }

  // deleteDevice(id) {
  //   const fnd = id === this.#devices.dataset.id;
  //   console.log(fnd);
  // }

  _moveToPopup(e) {
    // BUGFIX: When we click on a workout before the map has loaded, we get an error. But there is an easy fix:
    if (!this.#map) return;

    const deviceEl = e.target.closest('.device1');

    if (!deviceEl) return;

    const device1 = this.#devices.find(
      device1 => device1.id === deviceEl.dataset.id
    );

    this.#map.setView(device1.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // using the public interface
    // workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem('devices', JSON.stringify(this.#devices));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('devices'));

    if (!data) return;

    this.#devices = data;

    this.#devices.forEach(device => {
      this._renderDevice(device);
    });
  }

  reset() {
    localStorage.removeItem('devices');
    location.reload();
  }
}

const app = new App();
