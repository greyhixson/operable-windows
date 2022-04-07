const userStore = {
  userCredential: null,
  settings: {
    first_name: '',
    last_name: '',
    phone_number: '',
    favorite_organization: '',
    favorite_space: '',
    organization_name: '',
    text_notifications: {
      enabled: false,
      notifications: [],
    },
    email_notifications: {
      enabled: false,
      notifications: [],
    },
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
      text_notifications: {
        enabled: false,
        notifications: [],
      },
      email_notifications: {
        enabled: false,
        notifications: [],
      },
    };
  },
};

export default userStore;
