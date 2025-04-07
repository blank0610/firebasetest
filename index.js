import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGtxxaD-YJiDETRMsJ9KFBrJllT4yJfKM",
  authDomain: "menu-84f72.firebaseapp.com",
  projectId: "menu-84f72",
  storageBucket: "menu-84f72.appspot.com",
  messagingSenderId: "844744583140",
  appId: "1:844744583140:web:f6cef7cf517fd628c509f1",
  measurementId: "G-933V98RZDH"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signUpForm = document.getElementById("signUpForm");
const signInForm = document.getElementById("signInForm");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const profileDisplay = document.getElementById("profileDisplay");

// Sign Up
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: name
    });

    alert("User signed up!");
  } catch (error) {
    alert("Sign up error: " + error.message);
  }
});

// Sign In
signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signInEmailInput").value;
  const password = document.getElementById("signInPasswordInput").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Signed in successfully!");
  } catch (error) {
    alert("Sign in error: " + error.message);
  }
});

// Save Profile
saveProfileBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in");

  const name = document.getElementById("nameField").value;
  const bio = document.getElementById("bioField").value;
  const location = document.getElementById("locationField").value;
  const website = document.getElementById("websiteField").value;
  const birthday = document.getElementById("birthdayField").value;
  const twitter = document.getElementById("twitterField").value;
  const linkedin = document.getElementById("linkedinField").value;

  const profileData = {
    name: name || null,
    bio: bio || null,
    location: location || null,
    website: website || null,
    birthday: birthday || null,
    social: {
      twitter: twitter || null,
      linkedin: linkedin || null
    }
  };

  try {
    await setDoc(doc(db, "users", user.uid), profileData, { merge: true });
    alert("Profile saved!");
    loadUserProfile(user.uid); // Refresh display
  } catch (error) {
    alert("Error saving profile: " + error.message);
  }
});

// Load Profile Info
async function loadUserProfile(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      profileDisplay.innerHTML = `
        <div><strong>Name:</strong> ${data.name || ""}</div>
        <div><strong>Email:</strong> ${data.email || ""}</div>
        <div><strong>Bio:</strong> ${data.bio || ""}</div>
        <div><strong>Location:</strong> ${data.location || ""}</div>
        <div><strong>Website:</strong> ${data.website || ""}</div>
        <div><strong>Birthday:</strong> ${data.birthday || ""}</div>
        <div><strong>Twitter:</strong> ${data.social?.twitter || ""}</div>
        <div><strong>LinkedIn:</strong> ${data.social?.linkedin || ""}</div>
      `;
    } else {
      profileDisplay.innerHTML = "<i>No profile found.</i>";
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    profileDisplay.innerHTML = "<i>Error loading profile.</i>";
  }
}

// Show profile when logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserProfile(user.uid);
  } else {
    profileDisplay.innerHTML = "<i>Not signed in.</i>";
  }
});
