window.onload = function () {
  const encryptForm = document.getElementById("encrypt-form");
  const decryptForm = document.getElementById("decrypt-form");
  const decryptedTextContainer = document.getElementById(
    "decrypted-text-container"
  );

  encryptForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const dataTextarea = document.getElementById("encrypt-data");
    const data = dataTextarea.value;
    const encryptedData = await encryptData(data);
    downloadEncryptedData(encryptedData);
  });

  decryptForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("encrypted-file-input");
    const file = fileInput.files[0];
    console.log("File selected:", file);
    const encryptedData = await readFileAsArrayBuffer(file);
    console.log("Encrypted data ArrayBuffer:", encryptedData);
    try {
      const decryptedData = await decryptData(encryptedData);
      console.log("Decrypted data:", decryptedData);
      decryptedTextContainer.textContent = decryptedData;
    } catch (error) {
      console.error("Error decrypting data:", error);
      alert("Error decrypting data. Please check the console for details.");
    }
  });

  async function encryptData(data) {
    const key = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encodedData
    );

    const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
    combinedData.set(iv, 0);
    combinedData.set(new Uint8Array(encryptedData), iv.length);

    return combinedData;
  }

  async function decryptData(encryptedData) {
    const key = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const iv = encryptedData.slice(0, 12);
    const encrypted = encryptedData.slice(12);

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedData);

    return decryptedText;
  }

  function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.onerror = function (event) {
        reject(event.target.error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  function downloadEncryptedData(data) {
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "encrypted_data.bin";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  }
};
