// Function to hash password using SHA-256
function sha256(plain) {
  return crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(plain))
    .then((buffer) => {
      let hash = Array.prototype.map
        .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
      return hash;
    });
}

// Function to save username and hashed password to a text file
function saveCredentials(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Retrieve username and password from the form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  sha256(password)
    .then((hashedPassword) => {
      const data = {
        username: username,
        hashedPassword: hashedPassword,
      };

      fetch("http://localhost:3000/saveData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.text())
        .then((result) => {
          window.location.href = "encrypt.html";
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    })
    .catch((error) => console.error("Error hashing password:", error));
}

document
  .getElementById("loginForm")
  .addEventListener("submit", saveCredentials);
