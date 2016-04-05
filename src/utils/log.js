function log (msg, isError = false) {
  if (isError) {
    console.error(msg);
  } else {
    console.log(msg);
  }
}

export default log;
