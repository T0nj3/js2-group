async function registerUser(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const email1 = document.getElementById('email1').value;
    const password = document.getElementById('password').value;
    const password1 = document.getElementById('password1').value;
  
    const emailRules = /^[\w\-.]+@stud\.noroff\.no$/;
    if (!emailRules.test(email)) {
      alert('You need to enter a Noroff email address');
      return;
    }
  
    if (email === '' || password === '' || email1 === '' || password1 === '') {
      alert('Please fill in all fields.');
      return;
    }
    if (email !== email1) {
      alert('Email addresses do not match.');
      return;
    }
  
    if (password !== password1) {
      alert('Passwords do not match.');
      return;
    }

    if (password.length < 8 || password1.length < 8){
      alert('Password must be at least 8 characters long.');
      return;
    }
  
    try {
      const response = await fetch('https://v2.api.noroff.dev/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: email.split('@')[0], email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to register user');
      }
      const data = await response.json();
      alert('Registration successful! You can now log in.');
      location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration. Please try again.');
    }
  }
  
  document
    .getElementById('register-form')
    .addEventListener('submit', registerUser);