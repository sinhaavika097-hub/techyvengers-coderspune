async function addTestEmployee() {
    const response = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            empId: "DEV-003",
            name: "Ansh Raj",
            role: "Biotech Hacker",
            password: "MySuperSecretPassword123" 
        })
    });

    const data = await response.json();
    console.log("✅ Database Response:", data);
}

addTestEmployee();