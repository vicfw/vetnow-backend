function deleteDoc(user) {
  setTimeout(() => {
    user.password = undefined;
    user.save({ validateBeforeSave: false });
  }, 180000);
}
module.exports = deleteDoc;
//180000
