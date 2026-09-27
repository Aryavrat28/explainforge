const text = document.getElementById("text");
const level = document.getElementById("level");
const explain = document.getElementById("explain");
const example = document.getElementById("example");
const status = document.getElementById("status");
const results = document.getElementById("results");

example.onclick = () => {
  text.value = "Virtual memory is a memory management technique that allows an operating system to use disk storage as an extension of RAM. It allows programs to use more memory than is physically available.";
  level.value = "Student";
};

explain.onclick = async () => {
  if (!text.value.trim()) {
    status.textContent = "Please enter some text.";
    return;
  }

  explain.disabled = true;
  status.textContent = "Explaining with local AI...";
  results.classList.add("hidden");

  try {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        text: text.value,
        level: level.value
      })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.details || data.error);

    document.getElementById("explanation").textContent = data.explanation;
    document.getElementById("exampleText").textContent = data.example;
    document.getElementById("takeaway").textContent = data.takeaway;

    const list = document.getElementById("keyPoints");
    list.innerHTML = "";

    (data.keyPoints || []).forEach(point => {
      const li = document.createElement("li");
      li.textContent = point;
      list.appendChild(li);
    });

    results.classList.remove("hidden");
    status.textContent = "Explanation generated locally.";
  } catch (error) {
    status.textContent = `Error: ${error.message}`;
  } finally {
    explain.disabled = false;
  }
};
