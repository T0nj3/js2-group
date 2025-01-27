function checkForToken(){
    if (localStorage.getItem('token') === null) {
        window.location.href = 'login.html';
    }
    else {
        console.log('User is logged in');
    }
}
checkForToken();