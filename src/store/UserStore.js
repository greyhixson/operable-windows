const userStore = {
  userCredential: null,
  settings: {
    first_name: '',
    last_name: '',
    phone_number: '',
    favorite_organization: '',
    favorite_space: '',
    organization_name: '',
    notifications: [],
  },
  clearUserStore() {
    this.userCredential = null;
    this.settings = {
      first_name: '',
      last_name: '',
      phone_number: '',
      favorite_organization: '',
      favorite_space: '',
      organization_name: '',
      notifications: [],
    };
  },
};

export default userStore;
