## NAME PROJECT: BLOG-APP

## Overview
- Search Blog follow title,
- Create Blog
- Manage Blogs
- List Blog follow author
- Manage Topic
- Comment and like blog

## PROJECT STRUCTURE
# client
  * url: /
 * Pages: 
  - Home: Overview Blog,
  - Category: List Blog follow the Topic
  - Account: Info user, list blogs become user and notifications,
  - Detail: Blog detail, comment and like blog,
  - Auth: login and signup check OTP code with email

# Admin
 * url: /system
 * Pages: 
   - Dashboard: List blogs,
   - Detail: Blog detail,
   - Manage: manage Categories,

## MAIN TECHNOLOGY
 - Font-end: Typescript, Angular
 - Back-end:  Typescript, NodeJs(express)
 - Database: MongoD(mongoose), redis



#### Start project BE:
 - Run redis_cli command: `FT.CREATE blog_index PREFIX 1 blog: SCHEMA key_word TEXT`
 - Install packages command: `npm init`
 - Run project with command: `npm run dev`