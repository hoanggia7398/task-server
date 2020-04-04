const Task = function(
  id,
  name,
  description,
  comment,
  mark,
  commentTime,
  start,
  finish,
  status,
  createTime,
  createID,
  linkImageConfirm,
  handleId
) {
  this.id = id;
  this.name = name;
  this.description = description;
  this.comment = comment;
  this.mark = mark;
  this.commentTime = commentTime;
  this.start = start;
  this.finish = finish;
  this.status = status;
  this.createTime = createTime;
  this.createID = createID;
  this.linkImageConfirm = linkImageConfirm;
  this.handleId = handleId;
};

module.exports = Task;
