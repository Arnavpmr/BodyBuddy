import { userData } from "./data/index.js";
import { exerciseData } from "./data/index.js";
import { workoutData } from "./data/index.js";
// import {ObjectId} from 'mongodb';
import { dbConnection, closeConnection } from "./config/mongoConnection.js";

const seedUsers = [
  {
    firstName: "Arnav",
    lastName: "Marchareddy",
    userName: "arnavpmr",
    email: "arnavpmr@gmail.com",
    password: "Apal@9761",
    aboutMe: {
      description: "I am a dude looking to workout!",
      age: 20,
    },
    role: "owner",
  },
  {
    firstName: "John",
    lastName: "Doe",
    userName: "jdoe69",
    email: "jdoe@gmail.com",
    password: "Apal@9761",
    aboutMe: {
      description: "I am a dude looking to workout!",
      age: 69,
    },
    role: "user",
  },
  {
    firstName: "Jennifer",
    lastName: "Smith",
    userName: "jsmith123",
    email: "j.smith@example.com",
    password: "Jsmith123@",
    aboutMe: {
      description: "Hi there!",
      age: 28,
    },
    role: "user",
  },
  {
    firstName: "David",
    lastName: "Johnson",
    userName: "davidPass456",
    email: "david.j@example.com",
    password: "DavidPass456@",
    aboutMe: {
      description: "Greetings!",
      age: 35,
    },
    role: "user",
  },
  {
    firstName: "Emily",
    lastName: "Brown",
    userName: "emilyPass789",
    email: "emily.b@example.com",
    password: "EmilyPass789@",
    aboutMe: {
      description: "Nice to meet you!",
      age: 22,
    },
    role: "user",
  },
  {
    firstName: "Daniel",
    lastName: "Garcia",
    userName: "danielPass123",
    email: "d.garcia@example.com",
    password: "DanielPass123@",
    aboutMe: {
      description: "Hello world!",
      age: 40,
    },
    role: "admin",
  },
];

const seedExercises = [
  {
    name: "Push-Up",
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    description:
      "The push-up is a classic bodyweight exercise that targets the upper body muscles.",
    instructions:
      "Start in a plank position.\nLower your body towards the ground by bending your elbows.\nPush back up to the starting position.",
    equipment: ["None"],
    difficulty: "Beginner",
    image: "filePath1.jpg",
  },
  {
    name: "Bench Press",
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    description:
      "The bench press is a compound exercise that targets the chest, triceps, and shoulders.",
    instructions:
      "Lie on a flat bench with a barbell.\nLower the bar to your chest.\nPress the bar back up to the starting position.",
    equipment: ["Barbell", "Bench"],
    difficulty: "Intermediate",
    image: "filePath6.jpg",
  },
  {
    name: "Dumbbell Flyes",
    targetMuscles: ["Chest", "Shoulders"],
    description:
      "Dumbbell flyes isolate the chest muscles, emphasizing the stretch and contraction.",
    instructions:
      "Lie on your back on a bench with dumbbells in hand.\nLower the dumbbells out to the sides, maintaining a slight bend in the elbows.\nBring the dumbbells back up over the chest.",
    equipment: ["Dumbbells", "Bench"],
    difficulty: "Intermediate",
    image: "filePath8.jpg",
  },
  {
    name: "Tricep Dips",
    targetMuscles: ["Triceps"],
    description:
      "Tricep dips are an effective bodyweight exercise for targeting the triceps.",
    instructions:
      "Position your hands on parallel bars or sturdy surfaces.\nLower your body by bending your elbows.\nPush back up to the starting position.",
    equipment: ["Parallel Bars"],
    difficulty: "Intermediate",
    image: "filePath9.jpg",
  },
  {
    name: "Tricep Kickbacks",
    targetMuscles: ["Triceps"],
    description:
      "Tricep kickbacks isolate and target the triceps using dumbbells.",
    instructions:
      "Hold a dumbbell in each hand, hinge at the hips.\nExtend your arms straight back, squeezing the triceps.\nReturn to the starting position.",
    equipment: ["Dumbbells"],
    difficulty: "Intermediate",
    image: "filePath10.jpg",
  },
  {
    name: "Pull-Ups",
    targetMuscles: ["Back", "Biceps"],
    description:
      "Pull-ups are a compound exercise that targets the back and biceps.",
    instructions:
      "Hang from a pull-up bar with hands shoulder-width apart.\nPull your body up towards the bar.\nLower your body back down.",
    equipment: ["Pull-Up Bar"],
    difficulty: "Intermediate",
    image: "filePath11.jpg",
  },
  {
    name: "Lat Pulldowns",
    targetMuscles: ["Back"],
    description:
      "Lat pulldowns focus on the muscles in the upper back and lats.",
    instructions:
      "Sit at a lat pulldown machine with a wide grip.\nPull the bar down to your chest, squeezing your back muscles.\nReturn the bar to the starting position.",
    equipment: ["Lat Pulldown Machine"],
    difficulty: "Intermediate",
    image: "filePath12.jpg",
  },
  {
    name: "Deadlift",
    targetMuscles: ["Back", "Hamstrings", "Glutes"],
    description:
      "The deadlift is a powerful full-body exercise that targets the back, hamstrings, and glutes.",
    instructions:
      "Stand with feet hip-width apart and a barbell in front of you.\nBend at the hips and knees to lower your body.\nLift the bar by straightening your hips and knees.",
    sets: 5,
    reps: 10,
    equipment: ["Barbell"],
    difficulty: "Advanced",
    image: "filePath7.jpg",
  },
  {
    name: "Bicep Curls",
    targetMuscles: ["Biceps"],
    description: "Bicep curls isolate and target the muscles in the biceps.",
    instructions:
      "Hold a dumbbell in each hand, arms extended.\nCurl the weights towards your shoulders.\nLower the weights back down.",
    sets: 5,
    reps: 10,
    equipment: ["Dumbbells"],
    difficulty: "Intermediate",
    image: "filePath13.jpg",
  },
  {
    name: "Leg Press",
    targetMuscles: ["Quadriceps", "Hamstrings", "Glutes"],
    description:
      "The leg press is a machine exercise that targets the muscles in the lower body.",
    instructions:
      "Sit on the leg press machine with feet on the platform.\nPush the platform away by extending your knees.\nBend your knees to return to the starting position.",
    sets: 5,
    reps: 10,
    equipment: ["Leg Press Machine"],
    difficulty: "Intermediate",
    image: "filePath14.jpg",
  },
  {
    name: "Lunges",
    targetMuscles: ["Quadriceps", "Hamstrings", "Glutes"],
    description:
      "Lunges are effective for targeting the muscles in the lower body and improving balance.",
    instructions:
      "Stand with feet together.\nTake a step forward with one leg, lowering your body.\nReturn to the starting position and switch legs.",
    sets: 5,
    reps: 10,
    equipment: ["None"],
    difficulty: "Intermediate",
    image: "filePath5.jpg",
  },
  {
    name: "Calf Raises",
    targetMuscles: ["Calves"],
    description: "Calf raises focus on the muscles in the calves.",
    instructions:
      "Stand on a raised surface with heels hanging off the edge.\nLift your heels by pushing through the balls of your feet.\nLower your heels back down.",
    sets: 5,
    reps: 10,
    equipment: ["None"],
    difficulty: "Beginner",
    image: "filePath15.jpg",
  },
  {
    name: "Seated Calf Raises",
    targetMuscles: ["Calves"],
    description:
      "Seated calf raises target the muscles in the calves from a seated position.",
    instructions:
      "Sit on a calf raise machine with knees bent.\nLift your heels by pushing through the balls of your feet.\nLower your heels back down.",
    sets: 5,
    reps: 10,
    equipment: ["Calf Raise Machine"],
    difficulty: "Intermediate",
    image: "filePath16.jpg",
  },
];

const seedWorkouts = [
  {
    name: "Royal Chest Triumph",
    type: ["Strength", "Upper Body"],
    notes: "Conquer your chest and triceps with regal strength!",
    exercises: ["exercise3"],
    isPreset: true,
  },
  {
    name: "Mighty Back & Bicep Blitz",
    type: ["Strength", "Upper Body"],
    notes: "Embark on a powerful journey to sculpt your back and biceps!",
    exercises: ["exercise1"],
    isPreset: true,
  },
  {
    name: "Dynamic Leg & Calf Elevation",
    type: ["Strength", "Lower Body"],
    notes: "Elevate your lower body with dynamic leg and calf exercises!",
    exercises: ["exercise2"],
    isPreset: true,
  },
];

const db = await dbConnection();
await db.dropDatabase();

let workoutIds = [];

for (const users of seedUsers) {
  let created = await userData.createUser(
    users.firstName,
    users.lastName,
    users.userName,
    users.email,
    users.password,
    users.aboutMe.description,
    users.aboutMe.age,
    users.role,
  );
}

for (const exercises of seedExercises) {
  try {
    let created = await exerciseData.createExercise(
      exercises.name,
      exercises.targetMuscles,
      exercises.description,
      exercises.instructions,
      exercises.sets,
      exercises.reps,
      exercises.equipment,
      exercises.difficulty,
      exercises.image,
    );
  } catch (e) {
    console.log(e);
  }
}
for (const workouts of seedWorkouts) {
  let created = await workoutData.createWorkout(
    workouts.name,
    workouts.type,
    workouts.notes,
    workouts.exercises,
    workouts.isPreset,
  );
  workoutIds.push(created._id);
}

// let triExs = await exerciseData.getAllExercisesByTarget("Triceps");
// let chestExs = await exerciseData.getAllExercisesByTarget("Chest");
// let uniqueIds = new Set([
//   ...triExs.map((i) => i._id.toString()),
//   ...chestExs.map((i) => i._id.toString()),
// ]);
// let chestWorkout = [...uniqueIds];

// // for (let i of chestWorkout) {
// //   let push = await workoutData.pushExerciseToWorkout(workoutIds[0], i);
// // }

// let back = await exerciseData.getAllExercisesByTarget("Back");
// let bi = await exerciseData.getAllExercisesByTarget("Biceps");
// let uniqueIds1 = new Set([
//   ...back.map((i) => i._id.toString()),
//   ...bi.map((i) => i._id.toString()),
// ]);
// let backWorkout = [...uniqueIds1];
// // for (let i of backWorkout) {
// //   let push = await workoutData.pushExerciseToWorkout(workoutIds[1], i);
// // }

// let hamstringsEx = await exerciseData.getAllExercisesByTarget("Hamstrings");
// let quadricepsEx = await exerciseData.getAllExercisesByTarget("Quadriceps");
// let calvesEx = await exerciseData.getAllExercisesByTarget("Calves");
// let uniqueIds2 = new Set([
//   ...hamstringsEx.map((i) => i._id.toString()),
//   ...calvesEx.map((i) => i._id.toString()),
//   ...quadricepsEx.map((i) => i._id.toString()),
// ]);
// let legWorkout = [...uniqueIds2];
// for (let i of legWorkout) {
//   let push = await workoutData.pushExerciseToWorkout(workoutIds[2], i);
// }

// let user1 = await userData.getUserByUsername("mromero243");
// let friend = await userData.getUserByUsername("emilyPass789");
// let friendLink = await userData.friendRequest(user1._id, friend._id);
// console.log(friendLink);

await closeConnection();
