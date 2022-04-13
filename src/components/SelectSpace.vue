<template>
  <v-container>
    <alert-banner
      v-if="alert.msg && alert.type"
      :alert-msg="alert.msg"
      :alert-type="alert.type"
      :show-alert-prop="alert.show"
      @resetAlert="resetAlert"
    />
    <v-autocomplete
      v-model="orgSelect"
      class="search"
      :items="orgs"
      :search-input.sync="orgSearch"
      :filter="onOrgFilter"
      label="Search for your organizaton"
      clearable
      return-object
    >
      <template v-slot:selection="{ item }">
        <span>{{ item.name }}</span>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item.name" />
          <v-list-item-subtitle v-text="item.city" />
          <v-list-item-subtitle v-text="item.state" />
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <v-autocomplete
      v-model="spaceSelect"
      class="search"
      :items="spaces"
      :search-input.sync="spaceSearch"
      :filter="onSpaceFilter"
      label="Search for your space"
      no-data-text="Please select an organization first"
      clearable
      return-object
    >
      <template v-slot:selection="{ item }">
        <span>{{ item.name }}</span>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item.name" />
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </v-container>
</template>

<style scoped>
.search {
  min-width: 350px;
}
.search >>> label {
  padding-bottom: 30px;
}
</style>

<style>
/* Vuetify bug fix */
.v-select__selections input {
  width: 0 !important;
}
</style>

<script>
import { getWeather, getAirPollution } from '@/API/weatherAPI';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AlertBanner from '@/components/AlertBanner.vue';
import { getAllSpaces, getAllOrgs, getUser } from '@/API/firestoreAPI';

export default {
  name: 'SelectSpace',
  components: {
    AlertBanner,
  },
  data() {
    return {
      alert: {
        type: '',
        msg: '',
        show: false,
      },
      orgSearch: '',
      orgSelect: null,
      orgs: [],
      spaceSearch: '',
      spaceSelect: null,
      spaces: [],
      userFavorite: {
        orgName: '',
        spaceName: '',
      },
    };
  },
  computed: {
    auth() {
      return getAuth();
    },
  },
  watch: {
    async orgSelect() {
      // Load all spaces associated with an org, and the user's favorite space if they have one
      if (this.orgSelect) {
        const { name } = this.orgSelect;
        const { spaceName } = this.userFavorite;
        try {
          this.spaces = await getAllSpaces(name);
          if (spaceName) {
            const matchedSpace = this.spaces.find((space) => space.name === spaceName);
            if (matchedSpace) {
              this.spaceSelect = matchedSpace;
            }
          }
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      } else {
        this.spaces = [];
        this.spaceSelect = null;
        this.spaceSearch = null;
      }
    },
    async spaceSelect() {
      // Send the weather, air pollution, and space data up to the parent component UserView
      if (this.spaceSelect && this.orgSelect) {
        const { city, state } = this.orgSelect;
        try {
          const weather = await getWeather(city, state);
          this.$emit('submitWeather', weather);
          const { coord: { lat, lon } } = weather;
          const airPollution = await getAirPollution(lat, lon);
          this.$emit('submitAirPollution', airPollution);
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
        this.$emit('closeCard', false);
        this.$emit('submitSpace', this.spaceSelect);
        this.$emit('submitOrgName', this.orgSelect.name);
      }
    },
    orgSearch() {
      this.spaces = [];
      this.spaceSelect = null;
      this.spaceSearch = null;
    },
    userFavorite: {
      handler() {
        const { orgName } = this.userFavorite;
        if (orgName) {
          const matchedOrg = this.orgs.find((org) => org.name === orgName);
          if (matchedOrg) {
            this.orgSelect = matchedOrg;
          }
        }
      },
      deep: true,
    },
  },
  async mounted() {
    const { auth } = this;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the user's favorite org and space
        try {
          const userObj = await getUser(user.uid);
          if (userObj) {
            this.userFavorite.orgName = userObj.favorite.orgName;
            this.userFavorite.spaceName = userObj.favorite.spaceName;
          }
        } catch {
          this.setAlert('error', 'An error has occurred, please try again later.');
        }
      }
    });
  },
  async created() {
    try {
      this.orgs = await getAllOrgs();
    } catch {
      this.setAlert('error', 'An error has occurred, please try again later.');
    }
  },
  methods: {
    onOrgFilter(item, queryText) {
      const { name, state, city } = item;
      return name.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
          || state.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
          || city.toLocaleLowerCase().includes(queryText.toLocaleLowerCase());
    },
    onSpaceFilter(item, queryText) {
      const { name } = item;
      return name.toLocaleLowerCase().includes(queryText.toLocaleLowerCase());
    },
    getInputKey(input) {
      return input?.toLowerCase().replace(/\s+/g, '');
    },
    resetAlert() {
      this.alert.show = false;
      this.alert.msg = '';
      this.alert.type = '';
    },
    setAlert(alertType, alertMsg) {
      this.alert.show = true;
      this.alert.msg = alertMsg;
      this.alert.type = alertType;
    },
  },
};
</script>
