<template>
  <v-container>
    <h2> Update Personal Information</h2>
    <v-form>
      <v-text-field
        label="First name"
      />
      <v-text-field
        label="Last name"
      />
      <v-text-field
        label="Phone Number"
      />
    </v-form>
    <h2> Organization Settings </h2>

    <v-btn
      class="mb-2"
      to="/addorganization"
    >
      Add an Organization
    </v-btn>

    <h2 class>
      Notification Settings
    </h2>
    <v-checkbox
      v-model="textNotifications"
      label="Text Notifications"
    />
    <v-checkbox
      v-model="emailNotifications"
      label="Email Notifications"
    />
    <h2> Account Settings </h2>
    <v-row>
      <v-col>
        <v-btn>
          Reset Password
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-btn>
          Change Email
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-dialog
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="red lighten-2"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Delete my account
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Delete my account
            </v-card-title>

            <v-card-text class="pt-4">
              This operation can't be undone and will delete your account
              and all information associated with it.
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="deleteAccountDialog = false"
              >
                Delete my account
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-spacer style="padding-bottom: 80px;" />
    <v-dialog max-width="400px">
      <template
        v-slot:activator="{ on, attrs }"
      >
        <v-btn
          dark
          v-bind="attrs"
          width="300px"
          height="60px"
          v-on="on"
        >
          Exit
        </v-btn>
      </template>
      <v-card
        class="mx-auto"
      >
        <v-card-title class="text-h5">
          Save your Settings?
        </v-card-title>
        <v-card-actions>
          <v-btn
            to="/"
            @click="dialog = false"
          >
            Yes
          </v-btn>
          <v-btn
            to="/"

            @click="dialog = false"
          >
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      textNotifications: false,
      emailNotifications: false,
      deleteAccountDialog: false,
      dialog: false,
    };
  },
};
</script>
