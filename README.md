# video-annotation

Video Annotation Website made for annotating driving behaviors in videos using natural languages.

Demo website link: https://berkeley-video-annotation.herokuapp.com/

![Example](/Annotation_website_screen.png)

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

This project also uses [MongoDb](https://www.mongodb.com/) as the backend database. 

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/), [npm](https://www.npmjs.com/) and [MongoDb](https://www.mongodb.com/) installed.
2. Install your dependencies

    ```
    cd path/to/video-annotation; npm install
    ```
3. Start your Mongodb database

    ```
    mongod --dbpath= <path to Mongo>
    ```

4. Start your app

    ```
    npm run start
    ```
5. Build your website

    ```
    npm run build
    ```
6. Then you can view your website at localhost
