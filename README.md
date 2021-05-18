This is chat app - for test only.

//////////////////////
How to run the app at  local host :
client  run  at localhost:3000   server at port 5000

1.after downloading from git rum : npm i   at /server and at /client .
2. for client at client.js and for servera at server.js.
3.download  mongoDb (Free) then run mongo.exe at windows/mac
run  with  npm start  for server and also for client

if you have truble with  mongo you can replace the files indexOld.js  to index.js at server
(after saving this file)
That will use users.js file and save data local at the server memory without DB)



/////////////////////////////
How to run the app at Docker  :

the main different  is the url for the MONGODB at index.js (line 16)
1.after downloading from git rum : npm i   at /server and at /client .
2.run at main folder : `docker-compose up --build`
the app will run at open  at :http://localhost:3000/

//////////////////////////////////////////
to remoce all images and container run
docker rm -vf $(docker ps -a -q)
docker rmi -f $(docker images -a -q)
docker images 


Gilad Dolev


