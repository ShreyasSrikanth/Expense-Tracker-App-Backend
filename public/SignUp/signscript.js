let form = document.getElementById('form');

form.addEventListener('submit',sendSignUp);

async function fetchUsers(){
    try {
        const response = await axios.get('http://54.158.222.0:4000/users/fetchusers');
        return response.data;

    } catch (err) {
        console.error(err);
        alert("Failed to store data");
    }
}

async function sendSignUp(e){
    e.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;

    var displayUsers = await fetchUsers();
    

    const emailExists = await displayUsers.some(element => element.email === email);

    if(emailExists){
        alert('Email already registered');
        return; // Stop further execution
    }

    try {
        const response = await axios.post('http://54.158.222.0:4000/users/signup', {
            name: name,
            email: email,
            pass: pass,
            ispremiumuser:false,
            totalExpense:0,
            completed: false
        });

        alert("data succefully stored");
        window.location.href = '../Login/Login.html';

        document.getElementById('name').value = "";
        document.getElementById('email').value = "";
        document.getElementById('pass').value = "";

    } catch (err) {
        console.error(err);
        alert("Failed to store data");
    }
}