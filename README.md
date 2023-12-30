# Welcome to BodyBuddy

Your personal guide to a healthier, fitter lifestyle. Say goodbye to mundane workouts and hello to personalized fitness journeys tailored to your unique goals, preferences, and fitness levels.

## Installation instructions

1. Download zip file.
2. Ensure you have the following engines installed onto your machine:
   - NodeJS (Tested on version 18.12.0)
   - MongoDB (Tested on version 7.0.2)
3. Unzip the folder and navigate into the directory. Then, run the following console command.

   > `npm i`

   This will install the dependencies needed for the website to properly function. The full list of dependencies can be found in [package.json](./package.json)

4. Once the dependencies have been installed, run the seed file to populate the database with dummy values, in order to simulate an application with many users. You can run the seed file with the command:

   > `npm run seed`

   This will automatically run the seed file, and output a message to the command line when it completes.

5. Once all the dependencies have been installed, and the database seeded, you can run the application via the console command:

   > `npm start`

   This will create the server at the port 3000 of localhost. It will provide a link in the command line for easy-access, but you can also navigate there via the browser url bar by typing [http://localhost:3000/](http://localhost:3000/)

6. You can now navigate the website application however you wish, have fun!
