import { challengeData, userData } from "./data/index.js";
import { exerciseData, workoutData, challengeObject } from "./data/index.js";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";

const db = await dbConnection();
await db.dropDatabase();

const seedUsers = [
  {
    firstName: "Elon",
    lastName: "Musk",
    userName: "emusk123",
    emailAddress: "emusk@gmail.com",
    password: "Asdf@1234",
    aboutMe: {
      description: "I am a dude looking to workout and take over the world!",
      age: 52,
    },
    role: "owner",
  },
  {
    firstName: "Daniel",
    lastName: "Garcia",
    userName: "danielPass123",
    emailAddress: "d.garcia@example.com",
    password: "Asdf@1234",
    aboutMe: {
      description: "Hello world!",
      age: 40,
    },
    role: "admin",
  },
  {
    firstName: "Jake",
    lastName: "Ji",
    userName: "JakeJI",
    emailAddress: "jake.ji@example.com",
    password: "Asdf@1234",
    aboutMe: {
      description: "I love karate!",
      age: 17,
    },
    role: "admin",
  },
  {
    firstName: "Donald",
    lastName: "Na",
    userName: "donaldna",
    emailAddress: "d.na@gmail.com",
    password: "Asdf@1234",
    aboutMe: {
      description: "I am a monster at deadlifts",
      age: 22,
    },
    role: "admin",
  },
  {
    firstName: "John",
    lastName: "Doe",
    userName: "jdoe33",
    emailAddress: "jdoe33@gmail.com",
    password: "Asdf@1234",
    aboutMe: {
      description: "I am a dude looking to workout!",
      age: 31,
    },
    role: "user",
  },
  {
    firstName: "Jennifer",
    lastName: "Smith",
    userName: "jsmith123",
    emailAddress: "j.smith@example.com",
    password: "Asdf@1234",
    aboutMe: {
      description: "Hi there!",
      age: 28,
    },
    role: "user",
  },
  {
    firstName: "David",
    lastName: "Johnson",
    userName: "davidJo33",
    emailAddress: "david.j@example.com",
    password: "Asdf@1234",
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
    emailAddress: "emily.b@example.com",
    password: "Asdf@1234",
    aboutMe: {
      description: "Nice to meet you!",
      age: 22,
    },
    role: "user",
  },
];

//shoulders, obliques, quadriceps, biceps, abdominals, abductors and chest
const seedExercises = [
  {
    name: "Push-Up",
    targetMuscles: ["Chest", "Shoulders"],
    description:
      "The push-up is a classic bodyweight exercise that targets the upper body muscles.",
    instructions:
      "Start in a plank position.\nLower your body towards the ground by bending your elbows.\nPush back up to the starting position.",
    equipment: [],
    difficulty: "Beginner",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fpushup.jpeg?alt=media&token=4d30bb6e-c568-4e2a-877e-9791d311ae4f",
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
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fbenchpress.jpg?alt=media&token=2e2e0f5d-a8a3-4521-8d8e-71b9e74efe58",
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
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fdumbbell-fly.jpg?alt=media&token=a5c0d729-83da-4f24-9541-33847d031ae9",
  },
  {
    name: "Pull-Ups",
    targetMuscles: ["Shoulders", "Biceps"],
    description:
      "Pull-ups are a compound exercise that targets the back and biceps.",
    instructions:
      "Hang from a pull-up bar with hands shoulder-width apart.\nPull your body up towards the bar.\nLower your body back down.",
    equipment: ["Pull-Up Bar"],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fpullup.jpg?alt=media&token=8139565e-ae1c-4444-92f6-34ceff40bff7",
  },
  {
    name: "Bicep Curls",
    targetMuscles: ["Biceps"],
    description: "Bicep curls isolate and target the muscles in the biceps.",
    instructions:
      "Hold a dumbbell in each hand, arms extended.\nCurl the weights towards your shoulders.\nLower the weights back down.",
    equipment: ["Dumbbells"],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fbicep_curl.jpg?alt=media&token=d1b31da0-7bb0-4935-bb8c-63d63e649edd",
  },
  {
    name: "Leg Press",
    targetMuscles: ["Quadriceps"],
    description:
      "The leg press is a machine exercise that targets the muscles in the lower body.",
    instructions:
      "Sit on the leg press machine with feet on the platform.\nPush the platform away by extending your knees.\nBend your knees to return to the starting position.",
    equipment: ["Leg Press Machine"],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fleg_press.jpg?alt=media&token=fd4dc0c9-42c1-450c-bd91-d47b1bb27d11",
  },
  {
    name: "Lunges",
    targetMuscles: ["Quadriceps"],
    description:
      "Lunges are effective for targeting the muscles in the lower body and improving balance.",
    instructions:
      "Stand with feet together.\nTake a step forward with one leg, lowering your body.\nReturn to the starting position and switch legs.",
    equipment: [],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Flunges.jpg?alt=media&token=69298be5-4fd2-4490-8d05-aacc3ce15aa8",
  },
  {
    name: "Squats",
    targetMuscles: ["Quadriceps", "Abductors"],
    description:
      "Squats are a fundamental lower body exercise, targeting the muscles in your thighs and hips.",
    instructions:
      "Stand with feet shoulder-width apart.\nBend your knees and lower your body as if sitting back into a chair.\nKeep your back straight and chest up.",
    equipment: [],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fsquats.jpg?alt=media&token=b6ec9b05-8776-4ac6-8504-e68a3a01d9d1",
  },
  {
    name: "Bicycle Crunches",
    targetMuscles: ["Abdominals", "Obliques"],
    description:
      "Bicycle crunches are effective for working the abdominal muscles and obliques.",
    instructions:
      "Lie on your back with hands behind your head.\nLift your legs and move them in a bicycle pedaling motion.\nBring opposite elbow to knee with each rotation.",
    equipment: ["Mat"],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fbicycle_crunch.jpg?alt=media&token=abda98c4-5ff7-4e81-ad91-cae1812e4b1f",
  },
  {
    name: "Dumbbell Shoulder Press",
    targetMuscles: ["Shoulders"],
    description:
      "Dumbbell shoulder press helps to strengthen the shoulder muscles and triceps.",
    instructions:
      "Hold a dumbbell in each hand at shoulder height.\nPress the weights overhead, fully extending your arms.\nLower the weights back to shoulder height.",
    equipment: ["Dumbbells"],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fdumbbell-shoulder-press.jpg?alt=media&token=a7b2f0ae-b0d4-4a68-947c-9092c6b9f55c",
  },
  {
    name: "Lat Pulldown",
    targetMuscles: ["Biceps"],
    description:
      "Lat pulldown is a great exercise for targeting the muscles in the back and biceps.",
    instructions:
      "Use a cable machine with a wide grip bar.\nPull the bar down towards your chest, squeezing your shoulder blades together.\nControl the movement as you return to the starting position.",
    equipment: ["Cable Machine"],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Flat_pulldown.jpg?alt=media&token=8f1ee3d0-d4a8-46a8-8066-80e123f55dc0",
  },
  {
    name: "Leg Raises",
    targetMuscles: ["Abdominals"],
    description:
      "Leg raises target the lower abdominal muscles and hip flexors.",
    instructions:
      "Lie on your back with hands under your hips.\nLift your legs towards the ceiling.\nLower them back down without letting them touch the ground.",
    equipment: [],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Flegraises.jpg?alt=media&token=95b3f78c-a2b4-4948-8df9-4976774825cb",
  },
  {
    name: "Hammer Curls",
    targetMuscles: ["Biceps"],
    description:
      "Hammer curls focus on the biceps and also engage the muscles in the forearms.",
    instructions:
      "Hold a dumbbell in each hand with a neutral grip (palms facing in).\nCurl the weights toward your shoulders.\nLower the weights back down with control.",
    equipment: ["Dumbbells"],
    difficulty: "Intermediate",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fhammer_curls.jpg?alt=media&token=559931f4-ec91-44a3-b36e-6a6ef9921777",
  },
  {
    name: "Pistol Squat",
    targetMuscles: ["Quadriceps"],
    description:
      "The pistol squat is a challenging single-leg exercise that targets the quadriceps, hamstrings, and glutes.",
    instructions:
      "Stand on one leg with the other leg extended in front of you.\nLower your body by flexing your hips and knees, keeping the raised leg straight.\nLower until your thigh is parallel to the ground or as far as your flexibility allows.\nPush through your heel to return to the starting position.",
    equipment: [],
    difficulty: "Advanced",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fpistol_sqaut.jpg?alt=media&token=8884980c-8732-4eb2-866b-3f2afc864479",
  },
  {
    name: "Muscle Up",
    targetMuscles: ["Shoulders"],
    description:
      "The muscle-up is an advanced bodyweight exercise that targets the muscles in your back, chest, and triceps.",
    instructions:
      "Hang from a bar with an overhand grip, hands slightly wider than shoulder-width apart.\nInitiate the movement by pulling your chest towards the bar.\nAs you reach the top of the pull-up, transition into a dip by pushing yourself up and over the bar.\nLower yourself back down with control, reversing the motion.",
    equipment: ["Pull-up Bar"],
    difficulty: "Advanced",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fmuscleup.jpg?alt=media&token=d0dfde9c-0402-4017-bddd-3e04bb7f0884",
  },
  {
    name: "Lateral Lunges",
    targetMuscles: ["Adductors"],
    description:
      "Lunge with them length to strength them adductors! Yes this image is correct, I couldn't find a good one for lunges.",
    instructions:
      "I put my right hand in\nI put my right hand out\nIn out, in out\nShake it all about. ",
    equipment: ["Spirit", "Legs"],
    difficulty: "Beginner",
    image:
      "https://firebasestorage.googleapis.com/v0/b/bodybuddy-2bcc5.appspot.com/o/res%2Fexercises%2Fmuscleup.jpg?alt=media&token=d0dfde9c-0402-4017-bddd-3e04bb7f0884",
  },
];

const exerciseIdMap = {};

for (const exercise of seedExercises) {
  try {
    let createdExercise = await exerciseData.createExercise(
      exercise.name,
      exercise.targetMuscles,
      exercise.description,
      exercise.instructions,
      exercise.equipment,
      exercise.difficulty,
      exercise.image,
    );

    exerciseIdMap[exercise.name] = createdExercise.id.toString();
  } catch (e) {
    console.log(e);
  }
}

const seedWorkouts = [
  {
    name: "Upper Body Blast",
    types: ["Strength", "Upper Body"],
    workoutType: ["Anerobic", "Strength"],
    notes: "A high-intensity workout to sculpt your upper body.",
    exercises: [
      { id: exerciseIdMap["Push-Up"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Bicep Curls"], sets: 3, reps: 10 },
      { id: exerciseIdMap["Pull-Ups"], sets: 3, reps: 8 },
    ],
    isPreset: true,
    weightGoal: "14 kg",
    difficulty: 9,
    restTime: 17,
  },
  {
    name: "Leg Day Power",
    types: ["Strength", "Lower Body"],
    notes:
      "Unleash the strength of your lower body with this intense leg day workout.",
    exercises: [
      { id: exerciseIdMap["Squats"], sets: 4, reps: 10 },
      { id: exerciseIdMap["Lunges"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Leg Press"], sets: 3, reps: 15 },
    ],
    isPreset: true,
    weightGoal: "14 kg",
    difficulty: 9,
    restTime: 17,
  },
  {
    name: "Athlete's Core",
    types: ["Core", "Endurance"],
    notes: "Build a solid core foundation with this challenging workout.",
    exercises: [
      { id: exerciseIdMap["Bicycle Crunches"], sets: 4, reps: 20 },
      { id: exerciseIdMap["Leg Raises"], sets: 3, reps: 15 },
    ],
    isPreset: true,
    weightGoal: "14 kg",
    difficulty: 9,
    restTime: 17,
  },
  {
    name: "Advanced Bodyweight Mastery",
    types: ["Strength", "Endurance"],
    notes: "Master your bodyweight with this advanced workout.",
    exercises: [
      { id: exerciseIdMap["Muscle Up"], sets: 4, reps: 6 },
      { id: exerciseIdMap["Pistol Squat"], sets: 3, reps: 8 },
      { id: exerciseIdMap["Pull-Ups"], sets: 2, reps: 5 },
    ],
    isPreset: true,
    weightGoal: "14 kg",
    difficulty: 9,
    restTime: 17,
  },
  {
    name: "Chest and Shoulders Sculpt",
    types: ["Strength", "Upper Body"],
    notes:
      "Focus on building strength and definition in your chest and shoulders.",
    exercises: [
      { id: exerciseIdMap["Bench Press"], sets: 4, reps: 10 },
      { id: exerciseIdMap["Dumbbell Flyes"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Dumbbell Shoulder Press"], sets: 4, reps: 8 },
    ],
    isPreset: true,
    weightGoal: "14 kg",
    difficulty: 9,
    restTime: 17,
  },
  {
    name: "Total Body Burn",
    types: ["Strength", "Endurance"],
    notes:
      "Engage multiple muscle groups for a full-body burn and endurance boost.",
    exercises: [
      { id: exerciseIdMap["Squats"], sets: 4, reps: 15 },
      { id: exerciseIdMap["Pull-Ups"], sets: 3, reps: 10 },
      { id: exerciseIdMap["Bicycle Crunches"], sets: 3, reps: 20 },
    ],
    isPreset: true,
    weightGoal: "14 kg",
    difficulty: 9,
    restTime: 17,
  },
  {
    name: "Arm Blaster",
    types: ["Strength", "Arms"],
    notes: "Isolate and pump up those arms with this focused workout.",
    exercises: [
      { id: exerciseIdMap["Bicep Curls"], sets: 4, reps: 12 },
      { id: exerciseIdMap["Hammer Curls"], sets: 3, reps: 10 },
      { id: exerciseIdMap["Muscle Up"], sets: 4, reps: 5 },
    ],
    isPreset: true,
    weightGoal: "14 kg",
    difficulty: 9,
    restTime: 17,
  },
  {
    name: "Back and Biceps Blitz",
    types: ["Strength", "Upper Body"],
    notes:
      "Focus on building a strong back and biceps with this intense workout.",
    exercises: [
      { id: exerciseIdMap["Lat Pulldown"], sets: 4, reps: 12 },
      { id: exerciseIdMap["Pull-Ups"], sets: 3, reps: 8 },
      { id: exerciseIdMap["Hammer Curls"], sets: 3, reps: 10 },
    ],
    isPreset: true,
    weightGoal: "14 kg",
    difficulty: 9,
    restTime: 17,
  },
  {
    name: "Leg Day Burnout",
    types: ["Strength", "Lower Body"],
    notes: "Challenge your lower body with this high-rep leg day burnout.",
    exercises: [
      { id: exerciseIdMap["Leg Press"], sets: 4, reps: 15 },
      { id: exerciseIdMap["Lunges"], sets: 5, reps: 12 },
      { id: exerciseIdMap["Squats"], sets: 3, reps: 15 },
    ],
    isPreset: true,
    weightGoal: "100 kg",
    difficulty: 6,
    restTime: 240,
  },
  {
    name: "Core Crusher",
    types: ["Core", "Endurance"],
    notes: "Target your core muscles with this endurance-focused workout.",
    exercises: [
      { id: exerciseIdMap["Bicycle Crunches"], sets: 4, reps: 20 },
      { id: exerciseIdMap["Leg Raises"], sets: 3, reps: 15 },
      { id: exerciseIdMap["Push-Up"], sets: 6, reps: 15 },
    ],
    isPreset: true,
    weightGoal: "20 kg",
    difficulty: 5,
    restTime: 60,
  },
  {
    name: "Strength and Stability",
    types: ["Strength", "Full Body"],
    notes:
      "Improve overall strength and stability with this full-body workout.",
    exercises: [
      { id: exerciseIdMap["Dumbbell Shoulder Press"], sets: 4, reps: 10 },
      { id: exerciseIdMap["Leg Raises"], sets: 3, reps: 15 },
      { id: exerciseIdMap["Push-Up"], sets: 4, reps: 12 },
    ],
    isPreset: true,
    weightGoal: "150 lb",
    difficulty: 3,
    restTime: 120,
  },
  {
    name: "Functional Fitness Circuit",
    types: ["Strength", "Endurance"],
    notes:
      "Improve functional strength and endurance with this circuit workout.",
    exercises: [
      { id: exerciseIdMap["Squats"], sets: 3, reps: 15 },
      { id: exerciseIdMap["Push-Up"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Bicycle Crunches"], sets: 3, reps: 20 },
      { id: exerciseIdMap["Lat Pulldown"], sets: 3, reps: 12 },
    ],
    isPreset: true,
    weightGoal: "60 lb",
    difficulty: 7,
    restTime: 17,
  },
  {
    name: "Upper Body Burnout",
    types: ["Strength", "Upper Body"],
    notes: "Burn out those upper body muscles with this challenging workout.",
    exercises: [
      { id: exerciseIdMap["Bench Press"], sets: 4, reps: 10 },
      { id: exerciseIdMap["Dumbbell Flyes"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Push-Up"], sets: 6, reps: 12 },
    ],
    isPreset: true,
    weightGoal: "14 kg",
    difficulty: 9,
    restTime: 17,
  },
  {
    name: "Dynamic Leg Day",
    types: ["Strength", "Lower Body"],
    notes: "Add power to your lower body with this dynamic leg day routine.",
    exercises: [
      { id: exerciseIdMap["Leg Press"], sets: 4, reps: 12 },
      { id: exerciseIdMap["Lunges"], sets: 3, reps: 15 },
      { id: exerciseIdMap["Leg Raises"], sets: 3, reps: 10 },
    ],
    isPreset: true,
    weightGoal: "60 lb",
    difficulty: 1,
    restTime: 45,
  },
  {
    name: "Upper Body Strength Builder",
    types: ["Strength", "Upper Body"],
    notes:
      "Focus on building strength in your upper body with this targeted workout.",
    exercises: [
      { id: exerciseIdMap["Push-Up"], sets: 4, reps: 12 },
      { id: exerciseIdMap["Bicep Curls"], sets: 3, reps: 10 },
      { id: exerciseIdMap["Dumbbell Shoulder Press"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Lat Pulldown"], sets: 4, reps: 10 },
    ],
    isPreset: true,
    weightGoal: "4 kg",
    difficulty: 4,
    restTime: 30,
  },
];

const seedChallenges = [
  {
    title: "Upper Body Mastery",
    reward: 150,
    description:
      "Complete this challenge to build strength in your upper body.",
    exerciseList: [
      { id: exerciseIdMap["Push-Up"], sets: 4, reps: 12 },
      { id: exerciseIdMap["Bicep Curls"], sets: 3, reps: 10 },
      { id: exerciseIdMap["Dumbbell Shoulder Press"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Lat Pulldown"], sets: 4, reps: 10 },
    ],
  },
  {
    title: "Legs of Steel",
    reward: 175,
    description:
      "Conquer this leg challenge for stronger and more defined lower body muscles.",
    exerciseList: [
      { id: exerciseIdMap["Squats"], sets: 4, reps: 15 },
      { id: exerciseIdMap["Leg Press"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Lunges"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Hammer Curls"], sets: 3, reps: 10 },
    ],
  },
  {
    title: "Full Body Burn",
    reward: 200,
    description:
      "Ignite your metabolism with this intense full-body workout challenge.",
    exerciseList: [
      { id: exerciseIdMap["Pull-Ups"], sets: 4, reps: 10 },
      { id: exerciseIdMap["Dumbbell Flyes"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Bicycle Crunches"], sets: 3, reps: 20 },
      { id: exerciseIdMap["Leg Raises"], sets: 4, reps: 15 },
    ],
  },
  {
    title: "Athlete's Challenge",
    reward: 125,
    description:
      "Challenge yourself with this diverse workout targeting various muscle groups.",
    exerciseList: [
      { id: exerciseIdMap["Muscle Up"], sets: 4, reps: 6 },
      { id: exerciseIdMap["Dumbbell Shoulder Press"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Bicycle Crunches"], sets: 3, reps: 20 },
      { id: exerciseIdMap["Leg Press"], sets: 4, reps: 15 },
    ],
  },
  {
    title: "Total Body Transformation",
    reward: 150,
    description:
      "Transform your entire body with this comprehensive workout challenge.",
    exerciseList: [
      { id: exerciseIdMap["Muscle Up"], sets: 4, reps: 6 },
      { id: exerciseIdMap["Bench Press"], sets: 4, reps: 10 },
      { id: exerciseIdMap["Leg Press"], sets: 4, reps: 15 },
      { id: exerciseIdMap["Dumbbell Flyes"], sets: 3, reps: 12 },
    ],
  },
  {
    title: "Upper Body Palooza",
    reward: 115,
    description:
      "Transform your entire upper body with this comprehensive workout challenge.",
    exerciseList: [
      { id: exerciseIdMap["Push-Up"], sets: 9, reps: 12 },
      { id: exerciseIdMap["Bicep Curls"], sets: 10, reps: 10 },
      { id: exerciseIdMap["Pull-Ups"], sets: 12, reps: 8 },
    ],
  },
  {
    title: "Loser Leg Day",
    reward: 180,
    description: "Destroy your legs with this torturous workout challenge.",
    exerciseList: [
      { id: exerciseIdMap["Squats"], sets: 10, reps: 10 },
      { id: exerciseIdMap["Lunges"], sets: 13, reps: 12 },
      { id: exerciseIdMap["Leg Press"], sets: 15, reps: 15 },
    ],
  },
  {
    title: "Chest and Shoulders Sculpter",
    reward: 200,
    description:
      "Carve out your chest and shoulders with this insane challenge.",
    exerciseList: [
      { id: exerciseIdMap["Bench Press"], sets: 15, reps: 10 },
      { id: exerciseIdMap["Dumbbell Flyes"], sets: 10, reps: 12 },
      { id: exerciseIdMap["Dumbbell Shoulder Press"], sets: 8, reps: 8 },
    ],
  },
  {
    title: "Arm Annilator",
    reward: 80,
    description: "Vaporize your arms with this interesting challenge.",
    exerciseList: [
      { id: exerciseIdMap["Bicep Curls"], sets: 18, reps: 12 },
      { id: exerciseIdMap["Hammer Curls"], sets: 15, reps: 10 },
      { id: exerciseIdMap["Muscle Up"], sets: 12, reps: 5 },
    ],
  },
  {
    title: "Back and Biceps Blitz Day",
    reward: 80,
    description: "Build your back and biceps with this interesting challenge.",
    exerciseList: [
      { id: exerciseIdMap["Lat Pulldown"], sets: 14, reps: 12 },
      { id: exerciseIdMap["Pull-Ups"], sets: 12, reps: 8 },
      { id: exerciseIdMap["Hammer Curls"], sets: 18, reps: 10 },
    ],
  },
  {
    title: "Circuit Crazy",
    reward: 200,
    description:
      "Improve your functional strength with this interesting challenge.",
    exerciseList: [
      { id: exerciseIdMap["Squats"], sets: 3, reps: 15 },
      { id: exerciseIdMap["Push-Up"], sets: 3, reps: 12 },
      { id: exerciseIdMap["Bicycle Crunches"], sets: 18, reps: 20 },
      { id: exerciseIdMap["Lat Pulldown"], sets: 20, reps: 12 },
    ],
  },
];

for (const workout of seedWorkouts) {
  try {
    let createdWorkout = await workoutData.createWorkout(
      workout.name,
      workout.types,
      workout.notes,
      workout.exercises,
      workout.isPreset,
    );
  } catch (e) {
    console.log(e);
  }
}

try {
  await challengeObject.initializeQueue();
} catch (e) {
  console.log(e);
}

for (const challenge of seedChallenges) {
  try {
    let createdChallenge = await challengeData.createChallenge(
      challenge.exerciseList,
      challenge.title,
      challenge.reward,
      challenge.description,
    );
  } catch (e) {
    console.log(e);
  }
}

for (let i = 0; i < 6; i++) {
  await challengeObject.updateCurrent();
}

for (const user of seedUsers) {
  try {
    const created = await userData.createUser(
      user.firstName,
      user.lastName,
      user.userName,
      user.emailAddress,
      user.password,
      user.aboutMe.description,
      user.aboutMe.age,
      user.role,
    );
  } catch (e) {
    console.log(e);
  }
}

console.log("Seed file complete!");
await closeConnection();
