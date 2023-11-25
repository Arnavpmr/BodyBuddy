import { inputValidator, emailValidator, idValidator } from "../helpers.js"
import {users} from '../configurations/mongoCollections.js'
import {ObjectId} from 'mongodb';

let userDataFunctions = {
    async createUser(firstName, lastName, userName, email, password, description, age){
        try{
            firstName = inputValidator(firstName, 'firstName');
            lastName = inputValidator(lastName, 'lastName');
            userName = inputValidator(userName, 'userName');
            email = inputValidator(email, 'email');
            password = inputValidator(password, 'password');
        } catch (e){
            throw `Error in createUser: ${e}`;
        }

        // Optional
        description = description.trim();
        if(age && age < 0){
            throw `Error in createUser: Age cannot be a negative number.`
        }

        try{
            emailValidator(email)
        } catch (e){
            throw e;
        }

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            userName: userName, 
            email: email, 
            password: password,
            aboutMe : {description: description,
                        age:age}
            
        };

        const userCollections = await users();
        const entry = await userCollections.insertOne(newUser);
        if (!entry.acknowledged || !entry.insertedId){
            throw 'Error in createUser: Unable to add event.';
        }
        const newUserId = entry.insertedId.toString();
        const user = await this.getUser(newUserId.toString());
        return user;
    },
    async getUser(userId){
        try{
            userId = idValidator(userId);
        }
        catch(e){
            throw `Error in getUser: ${userId} not valid.`;
        }
        const userCollections = await users();
        let user = await userCollections.findOne({_id: new ObjectId(userId)});
        
        user._id = user._id.toString();
        return user;
    },
    async getAllUsers(){
        const userCollections = await users();
        let allUsers = await userCollections.find({}).toArray();
        
        if(!allUsers){
            throw "Error in getAllUsers: No users in database.";
        }
        return allUsers;
    },
    async removeUser(userId){
        try{
            idValidator(userId);
        }
        catch(e){
            throw `Error in removeUser: ${userId} not valid.`;
        }
        const userCollections = await users();
        let userRemoved = await userCollections.findOneAndDelete({_id: new ObjectId(userId)});
        if(!userRemoved){
            throw "Error in removeUser: User does not exist."
        }
        let myObj = {userName: userRemoved.userName, deleted: true};
        return myObj;
    },
    async updateUser(userId, firstName, lastName, userName, email, password, description, age){
        let user = null;
        const userCollections = await users();
        try{
            idValidator(userId);
        } catch (e) {
            throw `Error in updateUser: ${userId} not valid.`;
        }
        user = await userCollections.findOne({_id: new ObjectId(userId)});
        if(!user){
            throw `Error in updateUser: user does not exist.`;
        }
    
        try{
            firstName = inputValidator(firstName, 'firstName');
            lastName = inputValidator(lastName, 'lastName');
            userName = inputValidator(userName, 'userName');
            email = inputValidator(email, 'email');
            password = inputValidator(password, 'password');
        } catch (e){
            throw `Error in updateUser: ${e}`;
        }

        // Optional
        description = description.trim();
        if(age && age < 0){
            throw `Error in updateUser: Age cannot be a negative number.`
        }

        try{
            emailValidator(email)
        } catch (e){
            throw e;
        }

        
        let updatedUser = await userCollections.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {$set: {firstName : firstName,
                    lastName : lastName,
                    userName : userName,
                    email : email,
                    password : password,
                    aboutMe : {description : description, age: age}}},
            {returnDocument: "after"});
        return updatedUser
    }
};

export default userDataFunctions;
