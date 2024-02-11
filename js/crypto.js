window.onload = function () {
  const encryptForm = document.getElementById("encrypt-form");
  const decryptForm = document.getElementById("decrypt-form");
  const decryptedTextContainer = document.getElementById(
    "decrypted-text-container"
  );
  decryptedTextContainer.style.padding = "20px";

  let encryptionKey = null;

  function getEncryptionKey() {
    if (!encryptionKey) {
      encryptionKey = window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
    }
    return encryptionKey;
  }

  encryptForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const dataTextarea = document.getElementById("encrypt-data");

    const data = dataTextarea.value;

    try {
      const key = await getEncryptionKey();
      const encryptedData = await encryptData(data, key);
      downloadEncryptedData(encryptedData);
    } catch (error) {
      console.error("Error encrypting data:", error);
      alert("Error encrypting data. Please check the console for details.");
    }
  });

  decryptForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("encrypted-file-input");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file to decrypt.");
      return;
    }

    try {
      const key = await getEncryptionKey();
      const encryptedData = await readFileAsText(file);
      const decryptedData = await decryptData(encryptedData, key);
      decryptedTextContainer.textContent = decryptedData;
    } catch (error) {
      console.error("Error decrypting data:", error);
      alert("Error decrypting data. Please check the console for details.");
    }
  });

  async function encryptData(data, key) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encodedData
    );

    const concatenatedData = new Uint8Array([
      ...iv,
      ...new Uint8Array(encryptedData),
    ]);
    const base64Data = btoa(String.fromCharCode.apply(null, concatenatedData));

    return base64Data;
  }

  async function decryptData(encryptedData, key) {
    const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) =>
      c.charCodeAt(0)
    );
    const iv = encryptedBytes.slice(0, 12);
    const encrypted = encryptedBytes.slice(12);

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedData);

    return decryptedText;
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.onerror = function (event) {
        reject(event.target.error);
      };
      reader.readAsText(file);
    });
  }

  function downloadEncryptedData(data) {
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "encrypted_data.txt";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  }
};
