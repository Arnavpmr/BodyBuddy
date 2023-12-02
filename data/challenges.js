import helper from "../helpers.js"
import { challenges } from '../../../configurations/mongoCollections.js'
import {ObjectId} from 'mongodb';

let challengeDataFunctions = {
    async createChallenge(exerciseList, timeLimit, reward, deadline){
        deadline = deadline.trim();
        try{
            helper.dateValidator(deadline);
        }catch(e){
            throw`${e}`;
        }
        
        if(!Array.isArray(exerciseList)){
            throw 'Error in createChallenge: exerciseList must be an array';
        } 
        if(isNaN(reward)){
            throw 'Error in createChallenge: reward must be a valid number';
        }
        if(reward < 1){
            throw 'Error in createChallenge: reward cannot be negative.'
        }
        if(isNaN(timeLimit)){
            throw 'Error in createChallenge: timeLimit must be a valid number '
        }
        if(timeLimit < 1){
            throw 'Error in createChallenge: timeLimit cannot be negative.'
        }

        let newChallenge = {
            exercises : exerciseList,
            timeLimit : timeLimit,
            reward : reward,
            deadline : deadline
        }

        const challengesCollections = await challenges();
        const entry = await challengesCollections.insertOne(newChallenge);
        if (!entry.acknowledged || !entry.insertedId){
            throw 'Error in create: Unable to add event';
        }
        return entry;
    
    },

    async getAllChallenges(){
        const challengeCollections = await challenges();
        let getAllChallenges = await challengeCollections.find({}).toArray(); 
        if(!getAllChallenges){
            throw "Error in getAllChallenges: No challenges in database."
        }
        return getAllChallenges;
    },

    async getChallengeById(challengeId){
        try{
            helper.idValidator(challengeId, 'challengeId');
        } catch (e){
            throw `Error in getChallengeById: ${challengeId} not valid.`;
        }

        const challengeCollections = await challenges();
        let challenge = challengeCollections.findOne({_id: new ObjectId(challengeId)});

        challenge._id = challenge.id.toString();
        return challenge;
    },

    async removeChallenge(challengeId){
        try{
            helper.idValidator(challengeId, 'challengeId');
        } catch (e){
            throw `Error in removeChallenge: ${challengeId} not valid.`;
        }
        const challengeCollections = await challenges();
        let challengeRemoved = await challengeCollections.findOneAndDelete({_id: new ObjectId(challengeId)});
        if(!challengeRemoved){
            throw "Error in removeChallenge: Challenge does not exist."
        }
        let myObj = {_id: challengeRemoved._id.toString(), deleted: true};
        return myObj;
    },

    async updateChallenge(challengeId, exerciseList, timeLimit, reward,deadline){
        let challenge = null;
        const challengeCollections = await challenges();
        try{
            helper.idValidator(challengeId);
        }catch(e){
            throw `Error in updateChallenge: ${challengeId} not valid.`
        }
        challenge = await challengeCollections.find({_id: new ObjectId(challengeId)});
        if(!challenge){
            throw `Error in updateChallenge: challenge does not exist.`
        }

        try{
            deadline = helper.inputValidator(deadline, 'deadline');
        } catch (e){
            throw `Error in updateChallenge: ${e}`;
        }
        if(!Array.isArray(exerciseList)){
            throw 'Error in updateChallenge: exerciseList must be an array';
        } 
        if(isNaN(reward)){
            throw 'Error in updateChallenge: reward must be a valid number';
        }
        if(isNaN(timeLimit)){
            throw 'Error in updateChallenge: timeLimit must be a valid number '
        }


        let updatedChallenge = await challengeCollections.findOneAndUpdate(
            {_id: new ObjectId(challengeId)},
            {$set: {exercises: exerciseList,
                    timeLimit : timeLimit,
                    reward : reward,
                    deadline : deadline
            }},
            {returnDocument: "after"});
        return updatedChallenge;
    }
};

export default challengeDataFunctions;