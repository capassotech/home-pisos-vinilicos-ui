const firebaseConfig = {
    apiKey: "AIzaSyBiq1JVYxAteGujLGDaP5FDPiROIpZWKBU",
    authDomain: "hpv-desarrollo.firebaseapp.com",
    databaseURL: "https://hpv-desarrollo-default-rtdb.firebaseio.com",
    projectId: "hpv-desarrollo",
    storageBucket: "hpv-desarrollo.firebasestorage.app",
    messagingSenderId: "43047314530",
    appId: "1:43047314530:web:95492d73ec4a9f967a5d3b"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();