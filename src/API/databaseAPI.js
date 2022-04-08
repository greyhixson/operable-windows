import { app, error, user } from '@/store/store';
import {
  getDatabase, ref, set, onValue, get, child, remove,
} from 'firebase/database';
import Vue from 'vue';

const db = getDatabase(app);

function writeUserSettings() {
  if (user.userCredential) {
    const settings = JSON.parse(JSON.stringify(user.settings));
    if (settings) {
      Vue.$cookies.set('settings', settings);
      set(ref(db, `users/${user.userCredential.user.uid}`), {
        first_name: settings.first_name,
        last_name: settings.last_name,
        phone_number: settings.phone_number,
        favorite_organization: settings.favorite_organization,
        favorite_space: settings.favorite_space,
        organization_name: settings.organization_name,
        notifications: settings.notifications,
      })
        .then(() => {
          // Data saved successfully!
        })
        .catch((e) => {
          error.message = e.message;
          error.code = e.code;
        });
    }
  }
}

function addUserSettingsListener() {
  if (user.userCredential) {
    const userSettings = ref(db, `users/${user.userCredential.user.uid}`);
    onValue(userSettings, (snapshot) => {
      const data = snapshot.val();
      user.settings = JSON.parse(JSON.stringify(data));
    });
  }
}

function getOrg(orgName) {
  const dbRef = ref(db);
  let orgObj = null;
  get(child(dbRef, `organizations/${orgName}`)).then((snapshot) => {
    if (snapshot.exists()) {
      orgObj = snapshot.val();
    }
  }).catch((e) => {
    error.message = e.message;
    error.code = e.code;
  });
  return orgObj;
}

async function deleteOrg(orgName) {
  if (user.userCredential && user.settings.organization_name === orgName) {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    await remove(ref(db, `organizations/${strippedOrg}`));
  }
}

async function deleteSpace(orgName, spaceObj) {
  if (user.userCredential && user.settings.organization_name === orgName) {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    const strippedSpace = spaceObj.name.toLowerCase().replace(/\s+/g, '');
    await remove(ref(db, `organizations/${strippedOrg}/spaces/${strippedSpace}`));
  }
}

async function getAllSpaces(orgName) {
  let spacesArr = [];
  if (user.userCredential && user.settings.organization_name === orgName) {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    const dbRef = ref(db);
    try {
      const spacesObj = await (await get(child(dbRef, `organizations/${strippedOrg}/spaces`))).val();
      spacesArr = Object.values(spacesObj);
    } catch (e) {
      error.message = e.message;
      error.code = e.code;
    }
  }
  return spacesArr;
}

function writeNewOrg(org) {
  if (user.userCredential) {
    const strippedOrg = org.name.toLowerCase().replace(/\s+/g, '');
    if (strippedOrg) {
      set(ref(db, `organizations/${strippedOrg}`), {
        city: org.city,
        state: org.state,
        name: org.name,
      })
        .then(() => {
          // Data saved successfully!
        })
        .catch((e) => {
          error.message = e.message;
          error.code = e.code;
        });
    }
  }
}

function writeSpace(orgName, spaceObj) {
  if (user.userCredential) {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    const strippedSpace = spaceObj.name.toLowerCase().replace(/\s+/g, '');
    if (strippedOrg && strippedSpace) {
      set(ref(db, `organizations/${strippedOrg}/spaces/${strippedSpace}`), {
        name: spaceObj.name,
        max_humidity: spaceObj.max_humidity,
        min_temp: spaceObj.min_temp,
        max_temp: spaceObj.max_temp,
        max_aqi: spaceObj.max_aqi,
      })
        .then(() => {
          // Data saved successfully!
        })
        .catch((e) => {
          error.message = e.message;
          error.code = e.code;
        });
    }
  }
}

export {
  writeUserSettings,
  writeNewOrg,
  writeSpace,
  getOrg,
  getAllSpaces,
  deleteOrg,
  deleteSpace,
  addUserSettingsListener,
};
