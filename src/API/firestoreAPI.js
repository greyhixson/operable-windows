import {
  collection, deleteDoc,
  doc, getDoc, getDocs, setDoc, updateDoc,
} from 'firebase/firestore';

import { deleteUser as deleteUserAuth } from 'firebase/auth';

import { db } from '@/store/store';

function getInputKey(input) {
  return input?.toLowerCase().replace(/\s+/g, '');
}

async function getOrg(orgName) {
  const orgKey = getInputKey(orgName);
  const orgRef = doc(db, 'organizations', orgKey);
  return getDoc(orgRef);
}

async function getUser(uid) {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}

async function getUserNotifications(uid) {
  const notificationRef = doc(db, 'notifications', uid);
  const notificationDoc = await getDoc(notificationRef);
  const notificationsObj = notificationDoc.data();
  if (notificationsObj.notifications) {
    return notificationsObj.notifications;
  }
  return null;
}

async function getAllSpaces(orgName) {
  const spaces = [];
  const orgKey = getInputKey(orgName);
  const querySnapshot = await getDocs(collection(db, `organizations/${orgKey}/spaces`));
  querySnapshot.forEach((document) => {
    spaces.push(document.data());
  });
  return spaces;
}

async function getAllOrgs() {
  const orgs = [];
  const querySnapshot = await getDocs(collection(db, 'organizations'));
  querySnapshot.forEach((document) => {
    orgs.push(document.data());
  });
  return orgs;
}

async function writeOrg(org, uid) {
  const { city, state, name } = org;
  const orgKey = getInputKey(name);
  const orgReg = doc(doc(db, 'organizations', orgKey));
  await setDoc(orgReg, {
    name,
    city,
    state,
  }, { merge: true });
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ownedOrgName: name,
  });
}

async function writeSpace(orgName, space) {
  const {
    name, maxAqi, maxHumidity, maxTemp, minTemp,
  } = space;
  const orgKey = getInputKey(orgName);
  const spaceKey = getInputKey(name);
  const spaceRef = doc(db, `organizations/${orgKey}/spaces`, spaceKey);
  await setDoc(spaceRef, {
    maxAqi,
    maxHumidity,
    maxTemp,
    minTemp,
    name,
  },
  { merge: true });
}

async function addNotification(notification, uid) {
  const notificationRef = doc(db, 'notifications', uid);
  const notificationDoc = await getDoc(notificationRef);
  const notificationsObj = notificationDoc.data();

  if (notificationsObj.notifications) {
    notificationsObj.notifications.push(notification);
    await setDoc(notificationRef, {
      notifications: notificationsObj.notifications,
    });
  } else {
    const defaultNotification = [];
    defaultNotification.push(notification);
    await setDoc(notificationRef, {
      notifications: defaultNotification,
    });
  }
}

async function writeNotifications(notifications, uid) {
  const notificationRef = doc(db, 'notifications', uid);
  await setDoc(notificationRef, {
    notifications,
  });
}

async function deleteOrg(orgName, uid) {
  const user = await getUser(uid);
  const { ownedOrgName } = user;
  const orgKey = getInputKey(orgName);
  // Delete all the spaces
  const querySnapshot = await getDocs(collection(db, `organizations/${orgKey}/spaces`));
  querySnapshot.forEach((document) => {
    const spaceKey = getInputKey(document.data().name);
    deleteDoc(doc(db, `organizations/${orgKey}/spaces`, spaceKey));
  });
  // Delete the org
  if (ownedOrgName === orgName) {
    await deleteDoc(doc(db, 'organizations', orgKey));
  }
  // Delete the user
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ownedOrgName: '',
  },
  { merge: true });
}

async function deleteSpace(orgName, space) {
  const orgKey = getInputKey(orgName);
  const spaceKey = getInputKey(space.name);
  await deleteDoc(doc(db, `organizations/${orgKey}/spaces`, spaceKey));
}

async function deleteUser(currentUser, userOwnedOrgName) {
  const { uid } = currentUser;
  const userRef = doc(db, 'users', uid);
  if (userOwnedOrgName) {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const { ownedOrgName } = userDoc.data();
      if (ownedOrgName === userOwnedOrgName) {
        const orgKey = this.getInputKey(ownedOrgName);
        await deleteDoc(doc(db, 'organizations', orgKey));
      }
    }
  }
  await deleteDoc(userRef);
  await deleteUserAuth(currentUser);
}

export {
  getOrg, getUser, getAllOrgs, getAllSpaces, getUserNotifications,
  deleteOrg, deleteSpace, deleteUser,
  writeSpace, writeOrg, writeNotifications, addNotification,
};
