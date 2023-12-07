// This file will import both route files and export the constructor method as shown in the lecture code
import authRoutes from './auth_routes.js';
import challengesRoutes from './challenges.js';
import exercisesRoutes from './exercises.js';
import usersRoutes from './users.js';
import workoutsRoutes from './workouts.js';

const constructorMethod = (app) => {
    app.use('/', authRoutes);
    app.use('/challenges', challengesRoutes);
    app.use('/exercises', exercisesRoutes);
    app.use('/users', usersRoutes);
    app.use('/workouts', workoutsRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Route Not found' });
    });
};

export default constructorMethod;
