# zoom-calendar

This little app allow a user to see his Zoom meetings on a calendar but also to create new meeting by drag and drop on the calendar.<br/>
Meetings can't be set on lunch time (1PM-2PM), can't overlap and can't be set in the past.

## Technologies

Front is made with React and back is made with ExpressJS

## To launch the app

First fill the .env file with the right credentials (API_KEY, SECRET, and EMAIL) in the /api folder.<br/>
In the root directory type : **docker-compose up --build ui api**.<br/>
Then you can launch your favorite web browser and go to http://localhost:3000<br/>

## To launch test

In the root directory type : **sudo docker-compose up --build test**
