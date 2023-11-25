import { inputValidator, idValidator } from "../helpers.js"
import { exercises } from '../configurations/mongoCollections.js'
import {ObjectId} from 'mongodb';


let exerciseDataFunctions = {
    async createExercise(exerciseName, targetMuscle, exerciseDescription, instructions, equipment, difficulty,image){
        try{
            exerciseName = inputValidator(exerciseName, 'exerciseName');
            exerciseDescription = inputValidator(exerciseDescription, 'exerciseDescription');
            instructions = inputValidator(instructions, 'instructions');
            difficulty = inputValidator(difficulty, 'difficulty');
            image = inputValidator(image, 'image');
        }
        catch (e){
            throw `Error in createExercise: ${e}`;
        }

        if(!Array.isArray(targetMuscle) ){
            throw "Error in createExercise: targetMuscle must be an array."
        }
        if(!Array.isArray(equipment)){
            throw "Error in createExercise: Equiment must be an array."
        }

        let newExercise = {
            name : exerciseName, 
            targetMuscles : targetMuscle,
            description : exerciseDescription,
            instructions : instructions,
            equipment : equipment,
            difficulty : difficulty,
            image : image
        };

        const exerciseCollections = await exercises();
        const entry = await exerciseCollections.insertOne(newExercise);
        if (!entry.acknowledged || !entry.insertedId){
            throw 'Error in createExercise: Unable to add event';
        }
        return entry;

    },

    async getExerciseById(exerciseId){
        try{
            idValidator(exerciseId);
        }
        catch(e){
            throw `Error in getExerciseById: ${exerciseId} not valid`;
        }
        const exerciseCollections = await exercises();
        let exercise = await exerciseCollections.findOne({_id: new ObjectId(exerciseId)});
        if(!exercise){
            throw `Error in getExerciseById: No exercise with the ID of ${exerciseId} exists`;
        }
        exercise._id = exercise._id.toString();
        return exercise;
    },

    async getAllExercisesByTarget(muscle){
        try{
            muscle = inputValidator(muscle, 'Muscle');
        }catch (e){
            throw `Error in getAllExercisesByTarget: ${e}`
        }

        const exerciseCollections = await exercises();

    
        const exerciseList = await exerciseCollections.find({targetMuscles : muscle});
        if(!exerciseList){
            throw `Error in getAllExercisesByTarget: No exercises exists that target ${muscle}.`
        }
        return exerciseList.toArray();
    },

    async removeExercise(exerciseId){
        try{
            idValidator(exerciseId);
        }
        catch(e){
            throw `Error in removeExercise: ${exerciseId} not valid.`;
        }
        const exerciseCollections = await exercises();
        let exerciseRemoved = await exerciseCollections.findOneAndDelete({_id: new ObjectId(exerciseId)});
        if(!exerciseRemoved){
            throw "Error in removeExercise: Exercise does not exist."
        }
        let myObj = {exerciseName: exerciseRemoved.name, deleted: true};
        return myObj;
    },

    async updateExercise(exerciseId, exerciseName, targetMuscle, exerciseDescription, instructions, equipment, difficulty, image){

        let exercise = null;
        const exerciseCollections = await exercises();
        try{
            idValidator(exerciseId);
        } catch (e) {
            throw `Error in updateExercise: ${exerciseId} not valid.`;
        }
        exercise = await exerciseCollections.findOne({_id: new ObjectId(exerciseId)});
        if(!exercise){
        throw `Error in updateExercise: Exercise does not exist.`;
        }


        exerciseName = inputValidator(exerciseName, 'exerciseName');
        exerciseDescription = inputValidator(exerciseDescription, 'exerciseDescription');
        instructions = inputValidator(instructions, 'instructions');
        difficulty = inputValidator(difficulty, 'difficulty');
        
        if(!Array.isArray(targetMuscle) ){
            throw "Error in updateExercise: targetMuscle must be an array."
        }
        if(!Array.isArray(equipment)){
            throw "Error in updateExercise: Equiment must be an array."
        }

        
        let updatedExercise = await exerciseCollections.findOneAndUpdate(
            {_id: new ObjectId(exerciseId)},
            {$set: {name : exerciseName, 
                    targetMuscles : targetMuscle,
                    description : exerciseDescription,
                    instructions : instructions,
                    equipment : equipment,
                    difficulty : difficulty,
                    image : image}},
            {returnDocument: "after"});
        return updatedExercise
    }
};

export default exerciseDataFunctions;