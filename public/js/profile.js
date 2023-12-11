const profileForm = document.getElementById('profileForm');

function validatePassword(password){
    const psswrd = password;
    if(psswrd.search(/^\s+$/) !== -1) return false;
    if(psswrd.length < 8) return false;
    if(psswrd.search(/^[A-Z]/) === -1 || psswrd.search(/[0-9]/) === -1 || psswrd.search(/[\s]/) !== -1 || psswrd.search(/[^A-Za-z0-9]/) === -1) 
      return false;
    return true;
}

function validateName(name){
    if(name.length < 2 || name.length > 25) return false;
    if(name.search(/[0-9]/) !== -1) return false;
    return true;
}



if(profileForm){
    profileForm.addEventListener('submit', (e) => {
        const firstNameInput = document.getElementById('firstNameInput');
        const lastNameInput = document.getElementById('lastNameInput');
        const emailAddressInput = document.getElementById('emailAddressInput');
        const descriptionInput = document.getElementById('descriptionInput');
        const ageInput = document.getElementById('ageInput');

        let errors = [];

        if(!validateName(firstNameInput.value.trim())) errors.push('firstName must be between 2 and 25 characters, and cannot contain any numbers');
        if(!validateName(lastNameInput.value.trim())) errors.push('lastName must be between 2 and 25 characters, and cannot contain any numbers');
        if(!emailAddressInput.value.trim().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) errors.push('emailAddress must be a valid email');
        const ageVal = ageInput.value.trim();
        const ageNum = Number(ageVal);
        if(ageVal === "" || isNaN(ageNum) || (ageNum < 0 && !isNaN(ageNum))) errors.push('Age must be a valid number');


        if(errors.length > 0){
            console.log(errors);
            //TODO: Something
            e.preventDefault();
        }
        errors = [];
    });

}