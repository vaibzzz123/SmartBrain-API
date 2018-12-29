## Endpoints:

/: GET request, returns all users in the database.

/signin: POST request, takes in user's email and password, and attempts to sign in. If successful, it will return a 200, with the user's info. If unsuccessful, it will return a 400 indicating so.

/register: POST request, takes in a new user's email, name, username, pasword, and creates a new user, returning the data for that user.

/profile/:id: GET request, returns database entry for a user with the specified id.

/image: PUT request, increments the signed in user's rank, and returns the new rank.

/imageurl: POST request, processes Clarifai API request, taking in the image to send to API.
