# Overview

With this scenario I created a set of applications to perform the task.
- Responsive Web UI, written in React/Next.js
- C# .net 9.0 API which processes & retrieves the data
- Processor application which is used to pickup files and send to API to process the data.
- SQLite database file, present in the API directory.

To view the data, use the web UI that was created, which includes viewing transactions, the different reporting functions that are mentioned, plus the rejected transactions.  In addition, I provided a web UI around being able to send bulk data in XML, JSON, or CSV to the API to allow for processing from the UI; however, the main way to enter transactions in the system is through the file watcher Processor application that looks at files in a configured directory to pick up a newly created file and process it.

## Trade-offs

With an application like this, for the sake of time, several things were not implemented the way that I would normally implement them in a real application.

- Security is a big one.  I added the requirement for a JWT token on the API, so one must be present, but for this excercise I hard-coded a JWT token from the callers, instead of using an actual IDP to get the token.  Normally, I would get a token from an IDP based on real credentials.  I have the same token being passed from the web UI and the Processor.FileWatcher to the API.  The API will not return or process data unless the token is present.
- The API and web site would have been deployed in seperate docker containers, and not as standalone debug projects. For the sake of "ease of deployment", and without knowing how the clients are setup I opted to keep this "simple".
- The Processor file watcher is deployed as a Windows console app, which is not ideal for this type of appliation, but for this exercies it allows for a Windows File Watcher which will pick up files.  
- Another trade-off, which is major is that if I was doing this for real, the file watcher would put transactions on a queue, like RabbitMQ, and I would have containerized scalable watchers processing individual transactions off the queue to process the data in a faster manner.  This would provide for a much more robust transaction processing system.
- No unit tests were written.  This is a must for a real application, but the basis for them was setup in the C# application and in the React application.
- I did an API that takes a bulk amount of data, I would never do this in real development, as I believe in "chatty" being better than "chunky", but in this project, I opted for this for the sake of time.  I did develop a way to enter transactions one-at-a-time in the Processor.FileWatcher, and it's configurable in the appsettings.json file in the project, if Bulk is set to false it will work, but due to the volume, and the actual processors were single threaded it was much slower due to making more HTTPS requests than with the bulk.  In a real scenario I would break these transactions down to individual transactions in a queue and then have scaled containerized applications performing the processing, with a load balanced scalable API.

At the end of the day, this is a crude application compared to what I would have developed in a real application.

## Installation

- Download the GIT forked repo
- For the C# code there is a solution called "Processor-Interview.sln", open this to run both the API and the "Processor" file watcher.
- For the web UI.  If you don't have the latest version of NPM, you will want to download it.
  - Go to the directory called "UI" directory and in a command-line run "npm install" to install all packages, locally, for the UI.
  - Run "npm run dev" to run the site.
  - Navigate to http://localhost:8083 to run the site, make sure the C# API is running first, and that it is running at https://localhost:7039.
- For the processor to run, run it out of the main C# solution, with the API running, the project is called "Processor.FileWatcher".  It will need a configured directory for intake of files in the appsettings.json file, point to the directory of your choice and then run.

## Known Limitations

For the large files, due to the use of SQLite, performance is bad for inserting the files.  Also, I have encountered an issue with the Processor.FileWatcher where it sometimes does not process a second file that is dropped, you have to stop it and relaunch a times. SQLite is a performance bottleneck.

Speed is also a factor, since I don't have the application enabled to have multple processors off of a queue.

