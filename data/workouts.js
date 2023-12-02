import helper from "../helpers.js"
import { workouts, exercises } from '../../../configurations/mongoCollections.js'
import { ObjectId } from "mongodb";

let workoutDataFunctions = {
    async createWorkout(name, workoutType, notes, exercises){
        try{
            name = helper.inputValidator(name, "name");
        } catch (e){
            throw `Error in createWorkout: ${e}`
        }
        
        //optional
        notes = notes.trim();
        if(typeof notes != "string"){
            throw "Error in createWorkout: notes must be a valid string";
        }

        if(!Array.isArray(workoutType) ){
            throw "Error in createWorkout: workoutType must be an array."
        }
        if(!Array.isArray(exercises)){
            throw "Error in createWorkout: exercises must be an array."
        }

        let newWorkout = {
            name : name, 
            type : workoutType,
            notes : notes,
            exercises : exercises
        }

        const workoutCollections = await workouts();
        const entry = await workoutCollections.insertOne(newWorkout);
        if (!entry.acknowledged || !entry.insertedId){
            throw 'Error in createWorkout: Unable to add workout';
        }
        const newWorkoutId = entry.insertedId.toString();
        const workout = await this.getWorkoutById(newWorkoutId.toString());
        return workout;
    },

    async getAllWorkouts(){
        const workoutCollections = await workouts();
        let allWorkouts = await workoutCollections.find({}).toArray();
        
        if(!allWorkouts){
            throw "Error in getAllWorkouts: No workouts in database.";
        }
        return allWorkouts;
    },

    async getWorkoutsByType(workoutType){
        workoutType = helper.inputValidator(workoutType, 'Type')
        const workoutCollections = await workouts();
        const workoutList = await workoutCollections.find({ "type": { $elemMatch: workoutType}});
        if(!workoutList){
            throw `Error in getWorkoutsByType: No workouts of type '${workoutType}' exist.`
        }
        return exercises.toArray();
    },

    async getWorkoutById(workoutId){
        try{
            helper.idValidator(workoutId);
        }
        catch(e){
            throw `Error in getWorkoutById: ${e}`;
        }
        const workoutCollections = await workouts();
        let workout = await workoutCollections.findOne({_id: new ObjectId(workoutId)});
        if(!workout){
            throw `Error in getWorkoutById: No workout with the ID of ${workoutId} exists`;
        }
        workout._id = workout._id.toString();
        return workout;
    },

    async pushExerciseToWorkout( workoutId, exerciseId){
        try{
            workoutId = helper.idValidator(workoutId, 'WorkoutId');
            exerciseId = helper.idValidator(exerciseId, 'ExerciseId');
        } catch (e){
            throw`Error in pushExerciseToWorkout: ${e}`
        }
        const workoutCollections = await workouts();
        const entry = await workoutCollections.findOneAndUpdate(
            {_id: new ObjectId(workoutId)},
            {
                $push: {exercises: new ObjectId(exerciseId)} 
            },
            {returnDocument: "after"}
        );
            return entry
        },

    async pullExerciseFromWorkout(workoutId, exerciseId){
        try{
            workoutId = helper.idValidator(workoutId, 'WorkoutId');
        } catch (e){
            throw`Error in pullExerciseFromWorkout: ${e}`
        }
        
        const workoutCollections = await workouts();
        const workoutAfterPull = await workoutCollections.findOneAndUpdate(
            {_id: new ObjectId(workoutId)},
            {
                $pull: {exercises: new ObjectId(exerciseId)}
            },
            { returnDocument: "after"}
        )
        return workoutAfterPull;
    },

    async removeWorkout(workoutId){
        try{
            helper.idValidator(workoutId);
        }
        catch (e) {
            throw `Error in removeWorkout: ${workoutId} not valid`;
        }
        const workoutCollections = await workouts();
        let workoutRemoved = await workoutCollections.findOneAndDelete({_id: new ObjectId(workoutId)});
        if(!workoutRemoved){
            throw "Error in removeWorkout: Workout does not exist."
        }
        let myObj = {name: workoutRemoved.name, deleted: true};
        return myObj;
    }
};

export default workoutDataFunctions;