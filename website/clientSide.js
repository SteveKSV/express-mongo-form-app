async function CreateUser(userFirstName, userLastName, userAge, userCountry, userPhone) {
    const response = await fetch("/users", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: `${userFirstName} ${userLastName}`,  // Fix the variable names here
            age: parseInt(userAge, 10),
            country: userCountry,
            phone: userPhone,
        })
    });

    if (response.ok === true) {
        const user = await response.json();
        customFormReset();
    }
}

function customFormReset() {
    document.getElementById("myForm").reset();
}

document.getElementById("customReset").addEventListener("click", e => {
    e.preventDefault();
    customFormReset();
});

document.forms["myForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["myForm"];
    const firstName = form.elements["firstName"].value;
    const lastName = form.elements["lastName"].value;
    const age = form.elements["age"].value;
    const country = form.elements["country"].value;
    const phone = form.elements["phone"].value;

    CreateUser(firstName, lastName, age, country, phone);
});