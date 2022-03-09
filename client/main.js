const checkout = document.getElementById("checkout");

checkout.onclick = async () => {
  try {
    const res = await fetch("http://localhost:3000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            quantity: 1,
          },
          {
            id: 2,
            quantity: 3,
          },
        ],
      }),
    });
    const data = await res.json();
    console.log("checking out...", data);
    window.location = data.url;
  } catch (error) {
    const h3 = document.createElement("h3");
    h3.textContent = "Ups ha habido un error";
    document.body.prepend(h3);
    h3.classList = "error";
    console.log(error);
    setTimeout(() => {
      h3.classList = "";
    }, 4000);
  }
};
