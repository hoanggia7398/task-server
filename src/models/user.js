const User = function(
  id,
  username,
  password,
  fullname,
  age,
  phone,
  groupId,
  role
) {
  this.id = id;
  this.username = username;
  this.password = password;
  this.fullname = fullname;
  this.age = age;
  this.phone = phone;
  this.groupId = groupId;
  this.role = role;
};

module.exports = User;
