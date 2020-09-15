# REST API

## Nineth Full Stack JavaScript Techdegree v2 - REST API Project - Unit-09

---
**REST API** using Express provide a way for users to administer, _creating an account and _log-in, a school database containing information about courses: users can interact with the database by retrieving a list of courses, as well as _adding, _updating and _deleting courses in the database.

Created with [**node.js**](https://github.com/nodejs), [**express**](https://github.com/expressjs) and SQL ORM [***Sequelize***](https://github.com/sequelize/sequelize) using middleware for error handlling, authentication and field validations, routes and SQLite database:

- Non authenticated route to get a list of all courses with respective user owner
![Get Courses](https://res.cloudinary.com/da3z5stec/image/upload/v1600205418/REST%20API/Get_courses_nddm6z.png)
- Non authenticated route to get a course with specific id
![Get Course](https://res.cloudinary.com/da3z5stec/image/upload/v1600205418/REST%20API/Get_course_1_hsrtmi.png)
- Non authenticated route to post/create new user. Returning location header to root.
![Post user](https://res.cloudinary.com/da3z5stec/image/upload/v1600205418/REST%20API/Post_user_e9vigp.png)
- Authenticated route to post/create new course. Returning location header with course uri.
![Post Course](https://res.cloudinary.com/da3z5stec/image/upload/v1600205418/REST%20API/Post_course_utczrt.png)
- Authenticated route to put/update a course with specific id
![Put Course](https://res.cloudinary.com/da3z5stec/image/upload/v1600205418/REST%20API/Put_course_sehmi4.png)
- Authenticated route to delete a course with a specific id
![Delete Course](https://res.cloudinary.com/da3z5stec/image/upload/v1600205417/REST%20API/Delete_course_ialosx.png)

Every route has its error response where a problem ocurres because empty fields (or invalid format email), non existing course, authentication problem with wrong user/password/don't own course to modify or not found route.

## Getting Started

To get up and running, run the following commands.

First, install the project's dependencies.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).

---

![MikelIam](https://res.cloudinary.com/da3z5stec/image/upload/v1597004412/Portfolio/logo_about_pemkn6.jpg)