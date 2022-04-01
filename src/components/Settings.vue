<template>
  <v-container
    fill-height
    fluid
  >
    <v-row
      justify="center"
    >
      <v-col
        cols="auto"
        style="width: 250px;"
        class="ml-8"
      >
        <h2> Personal Details</h2>
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
      </v-col>
      <v-col
        cols="auto"
      >
        <h2 class="pb-2">
          Organization Settings
        </h2>
        <v-btn
          class="mb-2"
          to="/addorganization"
        >
          Add an Organization
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      justify="center"
      class="mb-8"
    >
      <v-col cols="auto">
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
      </v-col>
      <v-col cols="auto">
        <h2 class="pb-2">
          Account Settings
        </h2>
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
        <v-row
          dense
        >
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
      </v-col>
    </v-row>
    <v-row
      justify="center"
    >
      <v-dialog
        max-width="400px"
      >
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
          <v-card-actions
            class="pb-4"
          >
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
    </v-row>
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
