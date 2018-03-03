// dao/userSqlMapping.js
// CRUD SQL语句
var user = {
    insert:'INSERT INTO user(id, name, age) VALUES(0,?,?)',
    update:'update user set name=?, age=? where id=?',
    delete: 'delete from user where id=?',
    queryById: 'select * from user where id=?',
    // queryAll: 'select * from user',
    queryAll:"SELECT * FROM `user` limit 10",
    addUser:'INSERT INTO user( name, sex,intro) VALUES(?,?,?)',
    course:"SELECT * FROM `course`  limit 10",
};

module.exports = user;