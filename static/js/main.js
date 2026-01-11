async function fetchLyrics() {
  const title = document.getElementById("title").value.trim();
  const artist = document.getElementById("artist").value.trim();
  const duration = document.getElementById("duration").value.trim();

  const button = document.getElementById("search-btn");
  const result = document.getElementById("result-container");
  const lyrics = document.getElementById("lyrics-text");
  const error = document.getElementById("error-message");
  const copyBtn = document.getElementById("copy-btn");

  if (!title) {
    alert("Please enter a song title");
    return;
  }

  button.disabled = true;
  button.innerText = "Searching...";
  result.style.display = "none";
  lyrics.style.display = "none";
  error.style.display = "none";
  copyBtn.style.display = "none";

  try {
    const query = new URLSearchParams({ title, artist, duration });
    const response = await fetch(`/api/lyrics?${query}`);
    const data = await response.json();

    result.style.display = "block";

    if (response.ok) {
      const content =
        data.syncedLyrics || data.plainLyrics || "No lyrics found";

      lyrics.textContent = content;
      lyrics.style.display = "block";

      copyBtn.style.display = "block";
      copyBtn.innerText = "Copy Lyrics";
    } else {
      error.textContent = data.message || "An error occurred";
      error.style.display = "block";
    }
  } catch (err) {
    result.style.display = "block";
    error.textContent = "Something went wrong";
    error.style.display = "block";
  } finally {
    button.disabled = false;
    button.innerText = "Get Lyrics";
  }
}

async function copyToClipboard() {
  const lyrics = document.getElementById("lyrics-text");
  const copyBtn = document.getElementById("copy-btn");
  const originalText = copyBtn.innerText;

  try {
    await navigator.clipboard.writeText(lyrics.textContent);

    copyBtn.innerText = "Copied!";
    copyBtn.style.background = "#238636";

    setTimeout(() => {
      copyBtn.innerText = originalText;
      copyBtn.style.background = "#30363d";
    }, 2000);
  } catch (err) {
    alert("Failed to copy lyrics");
  }
}