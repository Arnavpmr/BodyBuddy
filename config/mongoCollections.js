import {dbConnection} from './mongoConnection.js';

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if(!_col){
            const db = await dbConnection();
            _col = db.collection(collection);
        }

        return _col;
    };
};

export const users = getCollectionFn('users');
export const workouts = getCollectionFn('workouts');
export const exercises = getCollectionFn('exercises');
export const challenges = getCollectionFn('challenges');