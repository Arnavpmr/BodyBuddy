
import {ObjectId} from 'mongodb';

export const inputValidator = (input, inputName) => {
    if(!input){
        throw `Error: ${input} is not a valid ${inputName}`;
    }
    if(typeof input != "string"){
        throw `Error: ${input} is not a valid string`;
    }
    input = input.trim();
    if(input === ""){
        throw `Error: ${inputName} cannot be an empty string`;
    }

    return input;
}

export let emailValidator = (email) =>{
    let domRegex = /[^-[A-Za-z0-9]/g;
    let domRegexTwo = /((?<!\d+|\w+)-)|(-(?!\d+|\w+))/g
    let preRegex = /[^A-Za-z0-9_.-]/g;
    let preRegexTwo = /[._-](?!\w+|\d+)/g;
    
    if(!email.includes('@') || !email.includes('.')){
      throw "Error: Invalid email.";
    }
    if(email.match(/@/g).length != 1){
      throw "Error: Invalid email.";
    }
     
    const [prefix,domain] = email.split('@');
    if(!prefix | !domain){
       throw "Error: Invalid email.";
    }
    const[domainName,com] = domain.split('.')
    if(prefix.length < 1 || domainName.length < 1){
       throw "Error: Invalid email.";
    }

    let invalidChars = prefix.match(preRegex);
    if(invalidChars != null){
       throw "Error: Invalid email.";
    }
    
    invalidChars = prefix.match(preRegexTwo);
    if(invalidChars != null){
       throw "Error: Invalid email.";
    }
    invalidChars = domainName.match(domRegex);
    if(invalidChars != null){
        throw "Error: Invalid email.";
    }
    invalidChars = domainName.match(domRegexTwo);
    if(invalidChars != null){
        throw "Error: Invalid email.";
    }
    if(com.length < 2){
       throw "Error: Invalid email.";
    }
    return true;
}

export const dateValidator = (date) => {
    let temp = new Date(date);
    if(isNaN(temp)){
        throw 'Error: Invalid date';
    }
    return true;
}

export let idValidator = (id) => {
    if(!id){
        throw "Error: No id was provided";
    }
    if(typeof id != 'string'){
        throw "Error: id must be a string!";
    }
    id = id.trim();
    if(id.length === 0){
        throw "Error: id can't be an empty string.";
    }
    if(!ObjectId.isValid(id)){
        throw "Error: id is invalid."
    }
    return id;
}
