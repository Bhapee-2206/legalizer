async function test() {
  const apiKey = "AIzaSyBJeNdPupOD0I0ETqgppJyoRFkpo_I2j9s";
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    require('fs').writeFileSync('models_list.json', JSON.stringify(data, null, 2));
    console.log("Wrote models_list.json");
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

test();
