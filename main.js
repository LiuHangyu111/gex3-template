const { createApp } = Vue;

createApp({
  data() {
    return {
      form: {
        fullName: '', dob: '', gender: '',
        totalVisitors: '', totalChildren: '',
        accommodation: '',
        cardHolder: '', cardNumber: '', expiry: '', cvc: ''
      },
      errors: {},
      generalError: '',
      places: [],
      isLoadingPlaces: true,
      placesError: '',
      selectedPlaces: [],
      accommodationOptions: [
        'No accommodation needed',
        'Forest View Hotel',
        'Totoro Family Inn',
        'Witch Valley Guesthouse',
        'Luxury Ghibli Resort'
      ],
      showSummary: false
    };
  },
  mounted() {
    this.loadPlaces();
  },
  methods: {
    async loadPlaces() {
      try {
        const response = await fetch('ghibli_park.json');
        if (!response.ok) throw new Error('Network response was not ok');
        this.places = await response.json();
        this.isLoadingPlaces = false;
      } catch (err) {
        this.placesError = 'Failed to load park data';
        this.isLoadingPlaces = false;
      }
    },
    togglePlace(place) {
      const index = this.selectedPlaces.findIndex(s => s.id === place.id);
      if (index >= 0) {
        this.selectedPlaces.splice(index, 1);
      } else {
        this.selectedPlaces.push(place);
      }
      if (this.errors.parks && this.selectedPlaces.length > 0) {
        delete this.errors.parks;
        if (Object.keys(this.errors).length === 0) this.generalError = '';
      }
    },
    clearErrors() {
      this.errors = {};
      this.generalError = '';
      this.showSummary = false;
    },
    validateForm() {
      let valid = true;
      if (!this.form.fullName) { this.errors.fullName = 'Required'; valid = false; }
      if (!this.form.dob) { this.errors.dob = 'Required'; valid = false; }
      if (!this.form.gender) { this.errors.gender = 'Required'; valid = false; }
      if (this.selectedPlaces.length === 0) { this.errors.parks = 'Select at least one'; valid = false; }
      if (!this.form.totalVisitors && this.form.totalVisitors !== 0) { this.errors.totalVisitors = 'Required'; valid = false; }
      if (this.form.totalChildren === '' || this.form.totalChildren === null) { this.errors.totalChildren = 'Required'; valid = false; }
      if (!this.form.accommodation) { this.errors.accommodation = 'Required'; valid = false; }
      if (!this.form.cardHolder) { this.errors.cardHolder = 'Required'; valid = false; }
      if (!this.form.cardNumber) { this.errors.cardNumber = 'Required'; valid = false; }
      if (!this.form.expiry) { this.errors.expiry = 'Required'; valid = false; }
      if (!this.form.cvc) { this.errors.cvc = 'Required'; valid = false; }
      return valid;
    },
    generateItinerary() {
      this.clearErrors();
      if (this.validateForm()) {
        this.showSummary = true;
      } else {
        this.generalError = 'There are mandatory items pending to be filled. Please complete the required fields.';
      }
    }
  }
}).mount('#app');